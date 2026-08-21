// Cloudflare Pages middleware for docs.descanto.com:
//
// 1. Markdown content negotiation (acceptmarkdown.com): `Accept:
//    text/markdown` on any docs page serves the prerendered markdown
//    rendition from /md/<path> (built by app/md/[...slug]/route.ts). Both
//    variants carry `Vary: Accept` so CDN caches never mix them up.
// 2. Agent-friendly 404s: unknown paths return 404 with a short markdown
//    body pointing at the sitemap, llms.txt, and docs index — for both
//    markdown and HTML clients (HTML clients still get Next's 404 page).

import { prefersMarkdown, markdownAssetPath } from "./_lib";

interface Env {
  ASSETS: { fetch: (req: Request | string) => Promise<Response> };
}

type PagesContext = {
  request: Request;
  env: Env;
  next: () => Promise<Response>;
};

const NOT_FOUND_MD = `# 404 — page not found

The path you requested does not exist on docs.descanto.com.

Everything that does exist is listed here:

- Docs index: https://docs.descanto.com/
- Sitemap: https://docs.descanto.com/sitemap.xml
- llms.txt (agent guide): https://descanto.com/llms.txt
- API reference: https://docs.descanto.com/api/overview
- OpenAPI spec: https://descanto.com/openapi.json
`;

function withVaryAccept(res: Response): Response {
  const out = new Response(res.body, res);
  const vary = out.headers.get("Vary");
  if (!vary) out.headers.set("Vary", "Accept");
  else if (!/\baccept\b/i.test(vary.replace(/accept-encoding/gi, ""))) out.headers.set("Vary", `${vary}, Accept`);
  return out;
}

function markdown404(): Response {
  return withVaryAccept(
    new Response(NOT_FOUND_MD, {
      status: 404,
      headers: { "Content-Type": "text/markdown; charset=utf-8" },
    }),
  );
}

export const onRequest = async (context: PagesContext): Promise<Response> => {
  const { request, env } = context;
  const url = new URL(request.url);
  const mdPath = markdownAssetPath(url.pathname);

  // The static search endpoint is the docs site's one API surface: annotate
  // it with advisory IETF RateLimit headers so agents can self-throttle.
  if (url.pathname === "/api/search") {
    const upstream = await context.next();
    const res = new Response(upstream.body, upstream);
    res.headers.set("RateLimit-Policy", "60;w=60");
    res.headers.set("RateLimit-Limit", "60");
    res.headers.set("RateLimit-Remaining", "59");
    res.headers.set("RateLimit-Reset", "60");
    return res;
  }

  // Not a page (asset, /_next/, /md/, .xml/.txt file) — pass through untouched.
  if (!mdPath) return context.next();

  const wantsMarkdown = (request.method === "GET" || request.method === "HEAD") && prefersMarkdown(request.headers.get("Accept"));

  if (wantsMarkdown) {
    const asset = await env.ASSETS.fetch(new URL(mdPath, url.origin).toString());
    if (asset.ok) {
      return withVaryAccept(
        new Response(asset.body, {
          status: 200,
          headers: { "Content-Type": "text/markdown; charset=utf-8", "X-Robots-Tag": "noindex" },
        }),
      );
    }
    return markdown404();
  }

  const res = await context.next();
  // HTML 404s get a markdown body only for clients that clearly aren't
  // browsers asking for HTML; browsers keep the styled Next 404 page.
  if (res.status === 404) {
    const accept = request.headers.get("Accept") ?? "";
    if (!accept.includes("text/html")) {
      return markdown404();
    }
  }
  return withVaryAccept(res);
};
