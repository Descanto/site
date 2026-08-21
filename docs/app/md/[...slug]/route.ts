import { source } from "@/lib/source";

// Statically exported markdown rendition of every docs page, written to
// out/md/<path> at build time. functions/_middleware.ts serves these when a
// client asks for a page with `Accept: text/markdown` (acceptmarkdown.com).
export const dynamic = "force-static";

export function generateStaticParams() {
  // Required catch-all: the docs root ("/") is exposed as /md/index.
  return source.generateParams().map(({ slug }) => ({ slug: slug.length === 0 ? ["index"] : slug }));
}

export async function GET(_req: Request, { params }: { params: Promise<{ slug: string[] }> }) {
  const { slug } = await params;
  const page = source.getPage(slug.length === 1 && slug[0] === "index" ? [] : slug);
  if (!page) return new Response("Not found", { status: 404 });
  const body = await page.data.getText("processed");
  const md = `# ${page.data.title}\n\n> ${page.data.description ?? ""}\n\n${body}`;
  return new Response(md, {
    headers: { "Content-Type": "text/markdown; charset=utf-8" },
  });
}
