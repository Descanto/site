// Cloudflare Pages Function: POST /api/contact
// Relays the contact form to CONTACT_TO via Resend. RESEND_API_KEY is a
// Pages secret; CONTACT_TO / CONTACT_FROM are plain-text vars with defaults.

interface Env {
  RESEND_API_KEY: string;
  CONTACT_TO?: string;
  CONTACT_FROM?: string;
}

// Minimal local shape — this dir is outside tsconfig, so we don't pull in
// @cloudflare/workers-types just for one signature.
type PagesFunction<E> = (ctx: { request: Request; env: E }) => Promise<Response>;

interface ContactBody {
  name?: string;
  email?: string;
  message?: string;
  // Honeypot — real users never fill this hidden field.
  company?: string;
}

const MAX_MESSAGE_LENGTH = 5000;

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
  let body: ContactBody;
  try {
    body = await request.json();
  } catch {
    return json(400, { error: "Invalid JSON body" });
  }

  if (body.company) return json(200, { ok: true }); // silently drop bots

  const name = body.name?.trim() ?? "";
  const email = body.email?.trim() ?? "";
  const message = body.message?.trim() ?? "";

  if (!name || !email || !message) {
    return json(400, { error: "name, email, and message are required" });
  }
  if (message.length > MAX_MESSAGE_LENGTH) {
    return json(400, { error: `Message too long (max ${MAX_MESSAGE_LENGTH} characters)` });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return json(400, { error: "Invalid email address" });
  }

  const to = env.CONTACT_TO ?? "hello@descanto.com";
  const from = env.CONTACT_FROM ?? "Descanto contact form <noreply@descanto.com>";

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [to],
      reply_to: email,
      subject: `Descanto contact form — ${name}`,
      html: `<p><strong>${escapeHtml(name)}</strong> &lt;${escapeHtml(email)}&gt;</p><p>${escapeHtml(message).replaceAll("\n", "<br>")}</p>`,
      text: `${name} <${email}>\n\n${message}`,
    }),
  });

  if (!res.ok) {
    console.error("Resend error", res.status, await res.text());
    return json(502, { error: "Failed to send — email us directly at hello@descanto.com" });
  }

  return json(200, { ok: true });
};
