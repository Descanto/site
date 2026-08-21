// Catch-all for /api/* paths that no specific function handles. Specific
// routes (contact.ts, waitlist.ts) take precedence in Pages routing; anything
// else gets a structured JSON 404 instead of the HTML 404 page — agents
// probing an API surface can't parse HTML errors.

import { rateLimitHeaders } from "../_ratelimit";

export const onRequest = async ({ request }: { request: Request }): Promise<Response> => {
  const { pathname } = new URL(request.url);
  return new Response(
    JSON.stringify({
      error: {
        code: "not_found",
        message: `No API route exists at ${pathname} on descanto.com.`,
        hint: "The Descanto product API lives at https://api.descanto.com/v1 — see the spec at https://descanto.com/openapi.json and docs at https://docs.descanto.com/api/overview. This host only serves POST /api/contact and POST /api/waitlist.",
      },
    }),
    { status: 404, headers: { "Content-Type": "application/json", ...rateLimitHeaders() } },
  );
};
