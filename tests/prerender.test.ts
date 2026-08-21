// Verifies the prerendered dist/ output that agents and crawlers consume.
// Requires a build first: `bun run build` (CI runs build before test).

import { describe, expect, test } from "bun:test";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { htmlToMarkdown } from "../scripts/markdown";

const DIST = join(import.meta.dir, "..", "dist");
const built = existsSync(join(DIST, "sitemap.xml"));

describe.if(built)("prerendered output", () => {
  const home = readFileSync(join(DIST, "index.html"), "utf8");

  test("homepage has an H1 and 500+ chars of visible text without JS", () => {
    expect(home).toContain("<h1");
    const text = home
      .replace(/<script[\s\S]*?<\/script>/g, "")
      .replace(/<style[\s\S]*?<\/style>/g, "")
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ");
    expect(text.length).toBeGreaterThan(500);
    // Content efficiency: readable text should be at least 5% of the HTML.
    expect(text.length / home.length).toBeGreaterThan(0.05);
  });

  test("homepage has canonical, og:image, og:type, and lang", () => {
    expect(home).toContain('<link rel="canonical" href="https://descanto.com/"');
    expect(home).toContain('property="og:image"');
    expect(home).toContain('property="og:type"');
    expect(home).toContain('<html lang="en">');
  });

  test("homepage JSON-LD parses and includes SoftwareApplication + Organization with contactPoint", () => {
    const m = /<script type="application\/ld\+json">([\s\S]*?)<\/script>/.exec(home);
    expect(m).not.toBeNull();
    const ld = JSON.parse(m![1]);
    const types = ld["@graph"].map((n: { "@type": string }) => n["@type"]);
    expect(types).toContain("SoftwareApplication");
    expect(types).toContain("Organization");
    const org = ld["@graph"].find((n: { "@type": string }) => n["@type"] === "Organization");
    expect(org.contactPoint.email).toBe("hello@descanto.com");
    expect(org.sameAs.length).toBeGreaterThan(0);
    expect(org.legalName).toBe("DV CENTRAL HOLDINGS LTD");
    expect(org.address["@type"]).toBe("PostalAddress");
    expect(org.address.postalCode).toBe("WC2H 9JQ");
  });

  test("every static page is prerendered with its own title and canonical", () => {
    for (const page of ["pricing", "about", "contact", "privacy", "terms", "news", "early-access"]) {
      const html = readFileSync(join(DIST, `${page}.html`), "utf8");
      expect(html).toContain(`<link rel="canonical" href="https://descanto.com/${page}"`);
      expect(html).not.toContain("<title>Descanto — instant-wake cloud desktops for agents</title>");
    }
  });

  test("trust anchor pages carry 500+ chars of visible content", () => {
    for (const page of ["about", "contact", "privacy", "terms"]) {
      const html = readFileSync(join(DIST, `${page}.html`), "utf8");
      const text = html
        .replace(/<script[\s\S]*?<\/script>/g, "")
        .replace(/<[^>]+>/g, " ")
        .replace(/\s+/g, " ");
      expect(text.length, page).toBeGreaterThan(500);
    }
  });

  test("every prerendered page has a markdown sibling", () => {
    for (const md of ["index.md", "pricing.md", "about.md", "contact.md", "privacy.md", "terms.md", "news.md", "early-access.md", "404.md"]) {
      expect(existsSync(join(DIST, md)), md).toBe(true);
      expect(readFileSync(join(DIST, md), "utf8")).toMatch(/^# /);
    }
  });

  test("404.html exists with agent pointers, and _redirects has no SPA fallback", () => {
    const nf = readFileSync(join(DIST, "404.html"), "utf8");
    expect(nf).toContain("sitemap");
    expect(nf).toContain("llms.txt");
    const redirects = readFileSync(join(DIST, "_redirects"), "utf8");
    expect(redirects).not.toContain("/index.html 200");
  });

  test("sitemap lists every prerendered page with lastmod", () => {
    const sitemap = readFileSync(join(DIST, "sitemap.xml"), "utf8");
    for (const path of ["/", "/pricing", "/about", "/contact", "/privacy", "/terms", "/news", "/early-access"]) {
      expect(sitemap).toContain(`<loc>https://descanto.com${path}</loc>`);
    }
    expect(sitemap).toContain("<lastmod>");
  });

  test("llms.txt ships with when-to-use guidance", () => {
    const llms = readFileSync(join(DIST, "llms.txt"), "utf8");
    expect(llms).toContain("## When to use Descanto");
    expect(llms).toContain("openapi.json");
    expect(llms).toContain("Accept: text/markdown");
  });
});

describe("htmlToMarkdown", () => {
  test("converts headings, links, and code blocks", () => {
    const md = htmlToMarkdown(
      '<h1>Title<br/>two</h1><p>Body with <a href="/pricing">pricing</a>.</p><pre><code>$ descanto wake</code></pre>',
    );
    expect(md).toContain("# Title two");
    expect(md).toContain("[pricing](https://descanto.com/pricing)");
    expect(md).toContain("```\n$ descanto wake\n```");
  });

  test("strips svg and scripts, unescapes entities", () => {
    const md = htmlToMarkdown("<svg><path d='x'/></svg><p>it&#x27;s &amp; done</p><script>evil()</script>");
    expect(md).toBe("it's & done\n");
  });
});
