import { describe, expect, test } from "bun:test";
import { prefersMarkdown, markdownAssetPath } from "../functions/_lib";

describe("prefersMarkdown", () => {
  test("plain text/markdown wins", () => {
    expect(prefersMarkdown("text/markdown")).toBe(true);
  });
  test("markdown preferred over html by q-value", () => {
    expect(prefersMarkdown("text/markdown, text/html;q=0.9")).toBe(true);
    expect(prefersMarkdown("text/html, text/markdown;q=0.5")).toBe(false);
  });
  test("equal q prefers markdown (explicit ask)", () => {
    expect(prefersMarkdown("text/markdown, text/html")).toBe(true);
  });
  test("browser Accept header stays on html", () => {
    expect(prefersMarkdown("text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8")).toBe(false);
  });
  test("wildcard or missing header stays on html", () => {
    expect(prefersMarkdown("*/*")).toBe(false);
    expect(prefersMarkdown(null)).toBe(false);
  });
  test("markdown with q=0 is not a preference", () => {
    expect(prefersMarkdown("text/markdown;q=0")).toBe(false);
  });
});

describe("markdownAssetPath", () => {
  test("root maps to index.md", () => {
    expect(markdownAssetPath("/")).toBe("/index.md");
  });
  test("pages map to sibling .md files", () => {
    expect(markdownAssetPath("/pricing")).toBe("/pricing.md");
    expect(markdownAssetPath("/news/fork-225ms")).toBe("/news/fork-225ms.md");
  });
  test("trailing slash is normalized", () => {
    expect(markdownAssetPath("/pricing/")).toBe("/pricing.md");
  });
  test("api, assets, and files with extensions are excluded", () => {
    expect(markdownAssetPath("/api/waitlist")).toBeNull();
    expect(markdownAssetPath("/assets/index-abc.js")).toBeNull();
    expect(markdownAssetPath("/sitemap.xml")).toBeNull();
    expect(markdownAssetPath("/openapi.json")).toBeNull();
    expect(markdownAssetPath("/llms.txt")).toBeNull();
    expect(markdownAssetPath("/og.png")).toBeNull();
  });
});
