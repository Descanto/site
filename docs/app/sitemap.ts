import type { MetadataRoute } from "next";
import { source } from "@/lib/source";

export const dynamic = "force-static";

const BASE_URL = "https://docs.descanto.com";

// Generated at build time into out/sitemap.xml (static export).
export default function sitemap(): MetadataRoute.Sitemap {
  return source.getPages().map((page) => ({
    url: `${BASE_URL}${page.url === "/" ? "/" : page.url}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
  }));
}
