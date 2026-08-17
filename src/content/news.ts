import { marked } from "marked";

export interface NewsPost {
  slug: string;
  title: string;
  description: string;
  category: "Botto" | "Canto" | "Company" | "Engineering";
  date: string; // ISO yyyy-mm-dd
  readMinutes: number;
  featured: boolean;
  html: string;
}

// Every .md file in src/content/news/ becomes a post automatically.
const raw = import.meta.glob("./news/*.md", { query: "?raw", import: "default", eager: true }) as Record<string, string>;

function parseFrontmatter(src: string): { meta: Record<string, string>; body: string } {
  const match = /^---\n([\s\S]*?)\n---\n?/.exec(src);
  if (!match) return { meta: {}, body: src };
  const meta: Record<string, string> = {};
  for (const line of match[1].split("\n")) {
    const idx = line.indexOf(":");
    if (idx > 0) meta[line.slice(0, idx).trim()] = line.slice(idx + 1).trim();
  }
  return { meta, body: src.slice(match[0].length) };
}

export const posts: NewsPost[] = Object.entries(raw)
  .map(([path, src]) => {
    const { meta, body } = parseFrontmatter(src);
    const slug = path.replace("./news/", "").replace(/\.md$/, "");
    const words = body.split(/\s+/).length;
    return {
      slug,
      title: meta.title ?? slug,
      description: meta.description ?? "",
      category: (meta.category as NewsPost["category"]) ?? "Company",
      date: meta.date ?? "1970-01-01",
      readMinutes: Math.max(1, Math.round(words / 220)),
      featured: meta.featured === "true",
      html: marked.parse(body, { async: false }),
    };
  })
  .sort((a, b) => b.date.localeCompare(a.date));

export const featuredPost = posts.find((p) => p.featured) ?? posts[0];

export function formatDate(iso: string): string {
  return new Date(iso + "T00:00:00").toLocaleDateString("en-US", { month: "short", year: "numeric" });
}
