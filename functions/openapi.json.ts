// GET /openapi.json — publish the Descanto API's OpenAPI spec at the marketing
// apex, where agents look for it. Fetches the live spec from
// api.descanto.com, pins the production server URL, and overlays
// per-operation summaries (see _openapi-overlay.ts) so every operation is
// self-describing for LLM function-calling. Edge-cached for an hour.

import { operationSummaries } from "./_openapi-overlay";

const UPSTREAM = "https://api.descanto.com/v1/openapi.json";
const HTTP_METHODS = new Set(["get", "post", "put", "patch", "delete", "head", "options"]);

type Operation = {
  operationId?: string;
  summary?: string;
  description?: string;
  responses?: Record<string, unknown>;
};

type Spec = {
  info?: Record<string, unknown>;
  servers?: unknown;
  paths?: Record<string, Record<string, Operation>>;
  components?: { schemas?: Record<string, unknown> };
};

const POLICY_DESCRIPTION = `

## Versioning and deprecation

URL-versioned under \`/v1\`. Additive changes only within a version; breaking changes ship as \`/v2\` alongside \`v1\`. Deprecations are signaled with RFC 9745 \`Deprecation\` and RFC 8594 \`Sunset\` response headers plus at least 90 days changelog notice (https://descanto.com/news). Policy: https://docs.descanto.com/api/overview#versioning-and-deprecation

## Errors

Every non-2xx response is RFC 9457 \`application/problem+json\` (see the \`ProblemJson\` schema). \`503\`/\`504\` are retryable; honor \`Retry-After\` when present.

## Rate limiting

Throttled requests return \`429\` with \`Retry-After\` and IETF RateLimit headers (\`RateLimit-Limit\`/\`Remaining\`/\`Reset\`): https://docs.descanto.com/api/overview#rate-limiting`;

export function overlaySpec(spec: Spec): Spec {
  spec.servers = [{ url: "https://api.descanto.com", description: "Descanto production API" }];
  spec.info = {
    ...spec.info,
    description: `${typeof spec.info?.description === "string" ? spec.info.description : ""}${POLICY_DESCRIPTION}`,
    contact: { name: "Descanto", email: "hello@descanto.com", url: "https://descanto.com/contact" },
    "x-versioning-policy": "https://docs.descanto.com/api/overview#versioning-and-deprecation",
    "x-deprecation-signaling": "Deprecation (RFC 9745) and Sunset (RFC 8594) response headers, 90 days minimum notice",
    "x-ratelimit-policy": "https://docs.descanto.com/api/overview#rate-limiting",
  };

  const hasProblemJson = Boolean(spec.components?.schemas?.ProblemJson);
  const defaultError = {
    description: "Any error. RFC 9457 problem details; 503/504 are retryable, honor Retry-After when present.",
    content: { "application/problem+json": { schema: { $ref: "#/components/schemas/ProblemJson" } } },
  };

  for (const methods of Object.values(spec.paths ?? {})) {
    for (const [method, op] of Object.entries(methods)) {
      if (!HTTP_METHODS.has(method) || typeof op !== "object" || op === null) continue;
      const summary = op.operationId && operationSummaries[op.operationId];
      if (summary && !op.summary && !op.description) op.summary = summary;
      // Guarantee a typed error response on every operation: any status not
      // documented explicitly is the RFC 9457 problem envelope.
      if (hasProblemJson && op.responses && !("default" in op.responses)) {
        op.responses.default = defaultError;
      }
    }
  }
  return spec;
}

export const onRequestGet = async (): Promise<Response> => {
  const upstream = await fetch(UPSTREAM, { cf: { cacheTtl: 3600, cacheEverything: true } } as RequestInit);
  if (!upstream.ok) {
    return new Response(
      JSON.stringify({
        error: {
          code: "upstream_unavailable",
          message: "The OpenAPI spec is temporarily unavailable.",
          hint: "Retry shortly, or fetch it directly from https://api.descanto.com/v1/openapi.json",
        },
      }),
      { status: 502, headers: { "Content-Type": "application/json" } },
    );
  }
  const spec = overlaySpec((await upstream.json()) as Spec);
  return new Response(JSON.stringify(spec), {
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "public, max-age=3600",
      "Access-Control-Allow-Origin": "*",
    },
  });
};
