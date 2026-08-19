// Cloudflare Pages Function: POST /api/waitlist
// Adds the requester to the Resend "Early Access" audience and emails the
// request to CONTACT_TO so every signup is also an actionable inbox item.

interface Env {
  RESEND_API_KEY: string;
  CONTACT_TO?: string;
  CONTACT_FROM?: string;
  WAITLIST_AUDIENCE_ID?: string;
}

// Minimal local shape — this dir is outside tsconfig, so we don't pull in
// @cloudflare/workers-types just for one signature.
type PagesFunction<E> = (ctx: { request: Request; env: E }) => Promise<Response>;

interface WaitlistBody {
  email?: string;
  name?: string;
  useCase?: string;
  tier?: string;
  // Honeypot — real users never fill this hidden field.
  company?: string;
}

const EARLY_ACCESS_AUDIENCE = "8264a804-b8f3-4525-939a-4024fcad2bff";
const TIERS = new Set(["small", "default", "large", "unsure"]);

function json(status: number, body: Record<string, unknown>): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

function escapeHtml(s: string): string {
  return s
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  let body: WaitlistBody;
  try {
    body = await request.json();
  } catch {
    return json(400, { error: "Invalid JSON body" });
  }

  if (body.company) return json(200, { ok: true }); // silently drop bots

  const email = body.email?.trim() ?? "";
  const name = body.name?.trim().slice(0, 200) ?? "";
  const useCase = body.useCase?.trim().slice(0, 2000) ?? "";
  const tier = TIERS.has(body.tier ?? "") ? body.tier! : "unsure";

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return json(400, { error: "A valid email is required" });
  }

  const headers = {
    Authorization: `Bearer ${env.RESEND_API_KEY}`,
    "Content-Type": "application/json",
  };

  const audienceId = env.WAITLIST_AUDIENCE_ID ?? EARLY_ACCESS_AUDIENCE;
  const [firstName, ...rest] = name.split(/\s+/);
  const contactRes = await fetch(`https://api.resend.com/audiences/${audienceId}/contacts`, {
    method: "POST",
    headers,
    body: JSON.stringify({
      email,
      first_name: firstName ?? "",
      last_name: rest.join(" "),
      unsubscribed: false,
    }),
  });
  // 409 = already on the list; that's fine, still forward the request email.
  if (!contactRes.ok && contactRes.status !== 409) {
    console.error("Resend contact error", contactRes.status, await contactRes.text());
    return json(502, { error: "Failed to join — email us at hello@descanto.com" });
  }

  const to = env.CONTACT_TO ?? "hello@descanto.com";
  // TODO: switch to noreply@descanto.com once that domain finishes Resend
  // verification (it's pending; vrbty.dev is verified today).
  const from = env.CONTACT_FROM ?? "Canto waitlist <noreply@vrbty.dev>";

  const emailRes = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers,
    body: JSON.stringify({
      from,
      to: [to],
      reply_to: email,
      subject: `Early access request — ${name || email} (${tier} tier)`,
      html: [
        `<p><strong>${escapeHtml(name || "(no name)")}</strong> &lt;${escapeHtml(email)}&gt;</p>`,
        `<p>Tier interest: <strong>${tier}</strong></p>`,
        useCase ? `<p>${escapeHtml(useCase).replaceAll("\n", "<br>")}</p>` : "<p><em>No use case given.</em></p>",
        `<p style="color:#8e8e92">Added to the Early Access audience${contactRes.status === 409 ? " (was already on it)" : ""}.</p>`,
      ].join(""),
      text: `${name || "(no name)"} <${email}>\nTier interest: ${tier}\n\n${useCase || "No use case given."}`,
    }),
  });

  if (!emailRes.ok) {
    // Contact was stored — don't fail the user over the notification.
    console.error("Resend email error", emailRes.status, await emailRes.text());
  }

  return json(200, { ok: true });
};
