// Pure HTML -> markdown conversion used by scripts/prerender.ts. Kept
// dependency-free so it can be unit-tested without a built dist-server.

export const SITE_URL = "https://descanto.com";

function unescapeEntities(s: string): string {
  return s
    .replaceAll("&amp;", "&")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">")
    .replaceAll("&quot;", '"')
    .replaceAll("&#x27;", "'")
    .replaceAll("&#39;", "'")
    .replaceAll("&nbsp;", " ");
}

/** Minimal HTML → markdown for our simple marketing pages. */
export function htmlToMarkdown(html: string): string {
  let s = html;
  s = s.replaceAll(/<svg[\s\S]*?<\/svg>/g, "");
  s = s.replaceAll(/<(script|style)[\s\S]*?<\/\1>/g, "");
  // Fenced code blocks before generic tag stripping.
  s = s.replaceAll(/<pre[^>]*>([\s\S]*?)<\/pre>/g, (_, code: string) => {
    const text = unescapeEntities(code.replaceAll(/<[^>]+>/g, ""));
    return `\n\n\`\`\`\n${text}\n\`\`\`\n\n`;
  });
  s = s.replaceAll(/<h1[^>]*>([\s\S]*?)<\/h1>/g, (_, t) => `\n\n# ${t.replaceAll(/<br\s*\/?>/g, " ")}\n\n`);
  s = s.replaceAll(/<h2[^>]*>([\s\S]*?)<\/h2>/g, "\n\n## $1\n\n");
  s = s.replaceAll(/<h3[^>]*>([\s\S]*?)<\/h3>/g, "\n\n### $1\n\n");
  s = s.replaceAll(/<a [^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/g, (_, href: string, text: string) => {
    const t = text.replaceAll(/<[^>]+>/g, "").trim();
    if (!t) return "";
    const abs = href.startsWith("/") ? `${SITE_URL}${href}` : href;
    return `[${t}](${abs})`;
  });
  s = s.replaceAll(/<(strong|b)>([\s\S]*?)<\/\1>/g, "**$2**");
  s = s.replaceAll(/<li[^>]*>/g, "\n- ");
  s = s.replaceAll(/<br\s*\/?>/g, "\n");
  s = s.replaceAll(/<\/(p|div|section|article|li|ul|header|footer|blockquote)>/g, "\n");
  s = s.replaceAll(/<[^>]+>/g, "");
  s = unescapeEntities(s);
  // Tidy whitespace: trim line ends, collapse 3+ newlines, drop stray empties.
  s = s
    .split("\n")
    .map((l) => l.replace(/\s+/g, " ").trim())
    .join("\n")
    .replaceAll(/\n{3,}/g, "\n\n")
    .trim();
  return s + "\n";
}
