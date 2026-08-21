// Shared, pure helpers for the docs Pages middleware — dependency-free so
// they can be unit-tested with `bun test` (tests/docs-middleware.test.ts in
// the repo root).

/**
 * True when the request's Accept header asks for text/markdown at least as
 * strongly as text/html (acceptmarkdown.com semantics). A bare "*\/*" or a
 * normal browser Accept header stays on HTML.
 */
export function prefersMarkdown(accept: string | null): boolean {
  if (!accept) return false;
  let md = -1;
  let html = -1;
  for (const part of accept.split(",")) {
    const [type, ...params] = part.trim().split(";");
    let q = 1;
    for (const p of params) {
      const [k, v] = p.trim().split("=");
      if (k === "q") q = Number.parseFloat(v);
    }
    const t = type.trim().toLowerCase();
    if (t === "text/markdown") md = Math.max(md, q);
    if (t === "text/html") html = Math.max(html, q);
  }
  return md > 0 && (html < 0 || md >= html);
}

/**
 * Map a docs pathname to its prerendered markdown asset under /md/, or null
 * when the path isn't a docs page (assets, api, files with extensions, and
 * the /md/ tree itself).
 */
export function markdownAssetPath(pathname: string): string | null {
  if (pathname === "/") return "/md/index";
  // /api/* is mostly docs pages (api/overview, api/desktops, ...); only
  // /api/search is a real endpoint.
  if (pathname.startsWith("/_next/") || pathname === "/api/search" || pathname.startsWith("/md/")) return null;
  if (/\.[a-zA-Z0-9]+$/.test(pathname)) return null;
  const clean = pathname.replace(/\/+$/, "");
  if (clean === "") return "/md/index";
  return `/md${clean}`;
}
