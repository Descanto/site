// Cloudflare Pages middleware: markdown content negotiation for every page.
//
// Agents that send `Accept: text/markdown` (acceptmarkdown.com) get the
// prerendered markdown rendition of the page (dist/<path>.md, built by
// scripts/prerender.ts) instead of HTML. Both variants carry
// `Vary: Accept` so CDN caches never hand the wrong variant to the
// wrong client. Unknown paths fall through to Pages' native 404.html
// (status 404), or 404.md for markdown clients.

import { prefersMarkdown, markdownAssetPath } from "./_lib";

interface Env {
  ASSETS: { fetch: (req: Request | string) => Promise<Response> };
}

type PagesContext = {
  request: Request;
  env: Env;
  next: () => Promise<Response>;
};

function withVaryAccept(res: Response): Response {
  const out = new Response(res.body, res);
  const vary = out.headers.get("Vary");
  if (!vary) out.headers.set("Vary", "Accept");
  else if (!/\baccept\b/i.test(vary.replace(/accept-encoding/gi, ""))) out.headers.set("Vary", `${vary}, Accept`);
  return out;
}

export const onRequest = async (context: PagesContext): Promise<Response> => {
  const { request, env } = context;
  const url = new URL(request.url);
  const mdPath = markdownAssetPath(url.pathname);

  // Not a page (API route, asset, .xml/.json/.txt file) — pass through untouched.
  if (!mdPath) return context.next();

  if ((request.method === "GET" || request.method === "HEAD") && prefersMarkdown(request.headers.get("Accept"))) {
    const asset = await env.ASSETS.fetch(new URL(mdPath, url.origin).toString());
    if (asset.ok) {
      return withVaryAccept(
        new Response(asset.body, {
          status: 200,
          headers: { "Content-Type": "text/markdown; charset=utf-8", "X-Robots-Tag": "noindex" },
        }),
      );
    }
    // Unknown page for a markdown client: markdown 404 with pointers.
    const notFound = await env.ASSETS.fetch(new URL("/404.md", url.origin).toString());
    return withVaryAccept(
      new Response(notFound.ok ? notFound.body : "# 404 — page not found\n", {
        status: 404,
        headers: { "Content-Type": "text/markdown; charset=utf-8" },
      }),
    );
  }

  // HTML variant of a negotiated page: mark it Vary: Accept too.
  return withVaryAccept(await context.next());
};
