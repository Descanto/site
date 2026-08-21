// Build-time prerenderer, run by `bun scripts/prerender.ts` after the client
// and SSR vite builds. For every route it writes:
//   dist/<path>/index.html  — full HTML with the app server-rendered into #root,
//                             per-page <title>/description/canonical/OG tags,
//                             and JSON-LD on the homepage and news posts.
//   dist/<path>.md          — a markdown rendition served via Accept: text/markdown
//                             content negotiation (see functions/_middleware.ts).
// Plus dist/sitemap.xml, dist/404.html, and dist/404.md.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { htmlToMarkdown } from "./markdown";

// The SSR bundle produced by `vite build --ssr src/entry-server.tsx`.
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore — built artifact, no types.
import * as server from "../dist-server/entry-server.js";

const DIST = join(import.meta.dir, "..", "dist");
const { staticPages, homeJsonLd, SITE_URL, OG_IMAGE, posts, render } = server;

const template = readFileSync(join(DIST, "index.html"), "utf8");
const buildDate = new Date().toISOString().slice(0, 10);

function escapeAttr(s: string): string {
  return s.replaceAll("&", "&amp;").replaceAll('"', "&quot;").replaceAll("<", "&lt;");
}


interface RenderTarget {
  path: string;
  title: string;
  description: string;
  ogType: "website" | "article";
  lastmod: string;
  jsonLd?: object;
}

const targets: RenderTarget[] = [
  ...staticPages.map((p: { path: string; title: string; description: string; ogType: "website" | "article"; lastmod?: string }) => ({
    ...p,
    lastmod: p.lastmod ?? buildDate,
    jsonLd: p.path === "/" ? homeJsonLd : undefined,
  })),
  ...posts.map((post: { slug: string; title: string; description: string; date: string }) => ({
    path: `/news/${post.slug}`,
    title: `${post.title} — Canto News`,
    description: post.description,
    ogType: "article" as const,
    lastmod: post.date,
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: post.title,
      description: post.description,
      datePublished: post.date,
      url: `${SITE_URL}/news/${post.slug}`,
      author: { "@type": "Organization", name: "Descanto", url: SITE_URL },
      publisher: { "@type": "Organization", name: "Descanto", url: SITE_URL },
    },
  })),
];

function buildPage(target: RenderTarget, appHtml: string): string {
  const canonical = target.path === "/" ? `${SITE_URL}/` : `${SITE_URL}${target.path}`;
  const head = [
    `<link rel="canonical" href="${canonical}" />`,
    `<meta property="og:title" content="${escapeAttr(target.title)}" />`,
    `<meta property="og:description" content="${escapeAttr(target.description)}" />`,
    `<meta property="og:url" content="${canonical}" />`,
    `<meta property="og:type" content="${target.ogType}" />`,
    `<meta property="og:image" content="${OG_IMAGE}" />`,
    `<meta property="og:site_name" content="Canto" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    target.jsonLd ? `<script type="application/ld+json">${JSON.stringify(target.jsonLd)}</script>` : "",
  ]
    .filter(Boolean)
    .join("\n    ");

  return template
    .replace(/<title>[\s\S]*?<\/title>/, `<title>${escapeAttr(target.title)}</title>`)
    .replace(/<meta name="description" content="[^"]*" \/>/, `<meta name="description" content="${escapeAttr(target.description)}" />`)
    .replace("</head>", `    ${head}\n  </head>`)
    .replace('<div id="root"></div>', `<div id="root">${appHtml}</div>`);
}

function outPaths(path: string): { html: string; md: string } {
  if (path === "/") return { html: join(DIST, "index.html"), md: join(DIST, "index.md") };
  // Flat <path>.html files: Pages serves them at the extensionless URL with
  // no trailing-slash redirect, so the served URL matches the canonical.
  return { html: join(DIST, `${path.slice(1)}.html`), md: join(DIST, `${path.slice(1)}.md`) };
}

async function main() {
  for (const target of targets) {
    const appHtml = await render(target.path);
    const page = buildPage(target, appHtml);
    const { html, md } = outPaths(target.path);
    mkdirSync(dirname(html), { recursive: true });
    mkdirSync(dirname(md), { recursive: true });
    writeFileSync(html, page);
    writeFileSync(md, `# ${target.title}\n\n> ${target.description}\n\n${htmlToMarkdown(appHtml).replace(/^# .*\n+/, "")}`);
    console.log(`prerendered ${target.path}`);
  }

  // 404 page: render the wildcard route, serve as Cloudflare Pages' custom 404.
  const notFoundHtml = await render("/this-page-does-not-exist");
  writeFileSync(
    join(DIST, "404.html"),
    buildPage(
      {
        path: "/404",
        title: "Page not found — Canto",
        description: "This page doesn't exist. See the sitemap, llms.txt, or docs for everything that does.",
        ogType: "website",
        lastmod: buildDate,
      },
      notFoundHtml,
    ),
  );
  writeFileSync(
    join(DIST, "404.md"),
    [
      "# 404 — page not found",
      "",
      "The path you requested does not exist on descanto.com.",
      "",
      "Everything that does exist is listed here:",
      "",
      `- Sitemap: ${SITE_URL}/sitemap.xml`,
      `- llms.txt (agent guide): ${SITE_URL}/llms.txt`,
      "- Docs index: https://docs.descanto.com",
      `- OpenAPI spec: ${SITE_URL}/openapi.json`,
      "",
    ].join("\n"),
  );

  // sitemap.xml with lastmod per URL.
  const urls = targets
    .map((t) => {
      const loc = t.path === "/" ? `${SITE_URL}/` : `${SITE_URL}${t.path}`;
      return `  <url>\n    <loc>${loc}</loc>\n    <lastmod>${t.lastmod}</lastmod>\n  </url>`;
    })
    .join("\n");
  writeFileSync(
    join(DIST, "sitemap.xml"),
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
  );
  console.log(`prerendered 404 + sitemap (${targets.length} urls)`);
}

if (import.meta.main) {
  await main();
}
