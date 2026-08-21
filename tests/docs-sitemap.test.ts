// Verifies the docs static-export sitemap (docs/out/, built by `cd docs && bun run build`).

import { describe, expect, test } from "bun:test";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { execSync } from "node:child_process";

const OUT = join(import.meta.dir, "..", "docs", "out");
const built = existsSync(join(OUT, "sitemap.xml"));

// Plain conditional rather than describe.if: bun still executes the describe
// callback when .if(false), so a top-level readFileSync would throw in the
// www CI job, where docs/out is never built.
describe.if(built)("docs sitemap", () => {
  const sitemap = built ? readFileSync(join(OUT, "sitemap.xml"), "utf8") : "";

  test("lists every mdx page exactly once", () => {
    const mdxCount = Number(
      execSync('find content/docs -name "*.mdx" | wc -l', { cwd: join(import.meta.dir, "..", "docs") }).toString().trim(),
    );
    expect(sitemap.match(/<loc>/g)?.length).toBe(mdxCount);
  });

  test("covers the key developer resources with lastmod", () => {
    for (const path of ["/", "/quickstart", "/api/overview", "/api/webhooks", "/mcp", "/cli", "/sdk/typescript", "/sdk/python"]) {
      expect(sitemap).toContain(`<loc>https://docs.descanto.com${path}</loc>`);
    }
    expect(sitemap).toContain("<lastmod>");
  });

  test("robots.txt points at the sitemap", () => {
    const robots = readFileSync(join(OUT, "robots.txt"), "utf8");
    expect(robots).toContain("Sitemap: https://docs.descanto.com/sitemap.xml");
  });

  test("api overview documents versioning, deprecation, and rate limits", () => {
    const overview = readFileSync(join(OUT, "api", "overview.html"), "utf8");
    for (const needle of ["Versioning and deprecation", "Sunset", "Deprecation", "Rate limiting", "Retry-After", "RateLimit-Remaining"]) {
      expect(overview).toContain(needle);
    }
  });
});
