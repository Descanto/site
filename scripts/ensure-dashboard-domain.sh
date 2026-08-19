#!/usr/bin/env bash
# Ensures the dashboard's custom domains are fully wired on Cloudflare:
#   - CNAME vm  -> canto-dashboard.pages.dev   (canonical host)
#   - CNAME canto -> canto-dashboard.pages.dev (kept: app redirects to vm.)
#   - both hostnames attached to the canto-dashboard Pages project
# then polls until Cloudflare validates the canonical hostname.
#
# Idempotent: safe to re-run any time; it only creates what's missing.
#
# Requires CLOUDFLARE_API_TOKEN with BOTH permissions on the account/zone:
#   - Cloudflare Pages: Edit
#   - Zone > DNS: Edit          (descanto.com zone)
set -euo pipefail

ACCOUNT_ID="${CLOUDFLARE_ACCOUNT_ID:-010c4c6b0df9ff6b8de54f1788a3905b}"
ZONE_ID="${CLOUDFLARE_ZONE_ID:-ad21d709525b0360d2842d6708c23703}" # descanto.com
PROJECT="canto-dashboard"
TARGET="canto-dashboard.pages.dev"
CANONICAL="vm.descanto.com"
DOMAINS=("vm.descanto.com" "canto.descanto.com")

api() {
  local method="$1" path="$2" body="${3:-}"
  local out
  out=$(curl -s -X "$method" "https://api.cloudflare.com/client/v4$path" \
    -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
    -H "Content-Type: application/json" \
    ${body:+-d "$body"})
  if ! python3 -c 'import json,sys; d=json.load(sys.stdin); sys.exit(0 if d.get("success") else 1)' <<<"$out" 2>/dev/null; then
    echo "Cloudflare API $method $path failed:" >&2
    echo "$out" | head -c 400 >&2; echo >&2
    echo "(check CLOUDFLARE_API_TOKEN has Pages:Edit + Zone DNS:Edit)" >&2
    return 1
  fi
  printf '%s' "$out"
}

echo "== DNS records =="
for host in "${DOMAINS[@]}"; do
  sub="${host%%.descanto.com}"
  records_json=$(api GET "/zones/$ZONE_ID/dns_records?type=CNAME&name=$host")
  existing=$(python3 -c 'import json,sys; r=json.load(sys.stdin)["result"]; print(r[0]["content"] if r else "")' <<<"$records_json")
  if [ "$existing" = "$TARGET" ]; then
    echo "  $host: CNAME ok"
  elif [ -n "$existing" ]; then
    echo "  $host: CNAME points to '$existing', expected '$TARGET' — fix manually, not overwriting." >&2
    exit 1
  else
    api POST "/zones/$ZONE_ID/dns_records" \
      "{\"type\":\"CNAME\",\"name\":\"$sub\",\"content\":\"$TARGET\",\"proxied\":true}" >/dev/null
    echo "  $host: CNAME created -> $TARGET"
  fi
done

echo "== Pages project domains =="
domains_json=$(api GET "/accounts/$ACCOUNT_ID/pages/projects/$PROJECT/domains")
attached=$(python3 -c 'import json,sys; print("\n".join(d["name"] for d in json.load(sys.stdin)["result"]))' <<<"$domains_json")
for host in "${DOMAINS[@]}"; do
  if grep -qx "$host" <<<"$attached"; then
    echo "  $host: attached"
  else
    api POST "/accounts/$ACCOUNT_ID/pages/projects/$PROJECT/domains" "{\"name\":\"$host\"}" >/dev/null
    echo "  $host: attached now"
  fi
done

echo "== Validation ($CANONICAL) =="
for i in $(seq 1 30); do
  domain_json=$(api GET "/accounts/$ACCOUNT_ID/pages/projects/$PROJECT/domains/$CANONICAL")
  status=$(python3 -c 'import json,sys; print(json.load(sys.stdin)["result"]["status"])' <<<"$domain_json")
  echo "  attempt $i: $status"
  if [ "$status" = "active" ]; then
    echo "== $CANONICAL is live =="
    exit 0
  fi
  # Re-POSTing the domain nudges Cloudflare to re-run validation.
  api POST "/accounts/$ACCOUNT_ID/pages/projects/$PROJECT/domains" "{\"name\":\"$CANONICAL\"}" >/dev/null 2>&1 || true
  sleep 10
done
echo "Validation did not reach 'active' in time — DNS may still be propagating; re-run this job." >&2
exit 1
