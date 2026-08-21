import { describe, expect, test } from "bun:test";
import { prefersMarkdown, markdownAssetPath } from "../docs/functions/_lib";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

describe("docs prefersMarkdown", () => {
  test("markdown ask wins, browser Accept stays on html", () => {
    expect(prefersMarkdown("text/markdown")).toBe(true);
    expect(prefersMarkdown("text/markdown, text/html;q=0.9")).toBe(true);
    expect(prefersMarkdown("text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8")).toBe(false);
    expect(prefersMarkdown("*/*")).toBe(false);
    expect(prefersMarkdown(null)).toBe(false);
  });
});

describe("docs markdownAssetPath", () => {
  test("root and pages map into the /md/ tree", () => {
    expect(markdownAssetPath("/")).toBe("/md/index");
    expect(markdownAssetPath("/quickstart")).toBe("/md/quickstart");
    expect(markdownAssetPath("/api/overview")).toBe("/md/api/overview"); // api reference pages are docs pages
    expect(markdownAssetPath("/api/search")).toBeNull(); // the one real endpoint
    expect(markdownAssetPath("/sdk/typescript")).toBe("/md/sdk/typescript");
    expect(markdownAssetPath("/quickstart/")).toBe("/md/quickstart");
  });
  test("assets, /md/ itself, and files with extensions are excluded", () => {
    expect(markdownAssetPath("/_next/static/x.js")).toBeNull();
    expect(markdownAssetPath("/md/quickstart")).toBeNull();
    expect(markdownAssetPath("/sitemap.xml")).toBeNull();
    expect(markdownAssetPath("/favicon.svg")).toBeNull();
  });
});

const OUT = join(import.meta.dir, "..", "docs", "out");
const built = existsSync(join(OUT, "sitemap.xml"));

describe.if(built)("docs markdown renditions and metadata", () => {
  test("every sitemap URL has a markdown rendition under /md/", () => {
    const sitemap = readFileSync(join(OUT, "sitemap.xml"), "utf8");
    const paths = [...sitemap.matchAll(/<loc>https:\/\/docs\.descanto\.com([^<]*)<\/loc>/g)].map((m) => m[1]);
    expect(paths.length).toBeGreaterThan(0);
    for (const p of paths) {
      const md = p === "/" ? "md/index" : `md${p}`;
      expect(existsSync(join(OUT, md)), md).toBe(true);
      expect(readFileSync(join(OUT, md), "utf8")).toMatch(/^# /);
    }
  });

  test("homepage ships JSON-LD with Organization contactPoint + address", () => {
    const home = readFileSync(join(OUT, "index.html"), "utf8");
    const m = /<script type="application\/ld\+json">([\s\S]*?)<\/script>/.exec(home);
    expect(m).not.toBeNull();
    const ld = JSON.parse(m![1]);
    const org = ld["@graph"].find((n: { "@type": string }) => n["@type"] === "Organization");
    expect(org.contactPoint.email).toBe("hello@descanto.com");
    expect(org.address.postalCode).toBe("WC2H 9JQ");
    expect(ld["@graph"].some((n: { "@type": string }) => n["@type"] === "SoftwareApplication")).toBe(true);
  });

  test("homepage carries canonical, og:type, og:image, and lang", () => {
    const home = readFileSync(join(OUT, "index.html"), "utf8");
    // Next normalizes the root canonical to no trailing slash.
    expect(home).toContain('rel="canonical" href="https://docs.descanto.com"');
    expect(home).toContain('property="og:type" content="website"');
    expect(home).toContain('property="og:image"');
    expect(home).toContain('<html lang="en"');
  });

  test("_redirects exposes /developers and apex trust anchors", () => {
    const redirects = readFileSync(join(OUT, "_redirects"), "utf8");
    expect(redirects).toContain("/developers / 301");
    expect(redirects).toContain("/privacy https://descanto.com/privacy 301");
    expect(redirects).toContain("/openapi.json https://descanto.com/openapi.json 301");
  });
});
