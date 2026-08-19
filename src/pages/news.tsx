import { useState } from "react";
import { Link, useParams, Navigate } from "react-router-dom";
import { posts, featuredPost, formatDate, type NewsPost } from "@/content/news";
import { Mark } from "@/components/mark";
import { Button } from "@/components/ui/button";

const filters = ["All", "Canto", "Company", "Engineering"] as const;

function CategoryPill({ category }: { category: string }) {
  return (
    <span className="rounded-full border border-strong px-3 py-1 text-[11px] font-semibold tracking-wider text-graphite uppercase">
      {category}
    </span>
  );
}

export function NewsIndexPage() {
  const [filter, setFilter] = useState<(typeof filters)[number]>("All");
  const visible = posts.filter((p) => filter === "All" || p.category === filter);
  const rest = visible.filter((p) => p.slug !== featuredPost.slug || filter !== "All");

  return (
    <>
      <section className="mx-auto flex max-w-[1440px] items-baseline justify-between px-20 pt-18 pb-10 max-lg:px-8">
        <h1 className="font-display text-[56px] font-bold tracking-[-0.03em]">News</h1>
        <div className="flex items-center gap-5">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`cursor-pointer text-sm ${filter === f ? "font-medium text-ink" : "text-graphite hover:text-graphite"}`}
            >
              {f}
            </button>
          ))}
        </div>
      </section>

      {filter === "All" && (
        <section className="mx-auto max-w-[1440px] px-20 pb-6 max-lg:px-8">
          <Link
            to={`/news/${featuredPost.slug}`}
            className="flex overflow-hidden rounded-2xl border border-hairline bg-surface max-md:flex-col"
          >
            <div className="flex h-85 w-140 shrink-0 items-center justify-center border-r border-hairline bg-panel max-md:h-50 max-md:w-full max-md:border-r-0 max-md:border-b">
              <Mark size={120} invert />
            </div>
            <div className="flex flex-col justify-center gap-3.5 p-12 max-md:p-7">
              <div className="flex items-center gap-3">
                <CategoryPill category={featuredPost.category} />
                <span className="text-[13px] text-faint">{formatDate(featuredPost.date)}</span>
              </div>
              <h2 className="font-display text-[32px] font-bold leading-10 tracking-tight">{featuredPost.title}</h2>
              <p className="text-[15px] leading-relaxed text-graphite">{featuredPost.description}</p>
              <span className="pt-1 text-sm font-medium">Read post →</span>
            </div>
          </Link>
        </section>
      )}

      <section className="mx-auto grid max-w-[1440px] grid-cols-4 gap-6 px-20 pt-6 pb-22 max-xl:grid-cols-2 max-sm:grid-cols-1 max-lg:px-8">
        {rest.map((post: NewsPost) => (
          <Link key={post.slug} to={`/news/${post.slug}`} className="group flex flex-col overflow-hidden rounded-2xl border border-hairline bg-surface">
            <div className="h-42 bg-panel" />
            <div className="flex flex-col gap-2 p-5.5">
              <div className="flex items-center gap-2.5">
                <span className="text-[11px] font-semibold tracking-wider text-graphite uppercase">{post.category}</span>
                <span className="text-xs text-faint">{formatDate(post.date)}</span>
              </div>
              <h3 className="text-base font-semibold leading-snug group-hover:underline">{post.title}</h3>
              <p className="text-[13.5px] leading-5 text-graphite">{post.description}</p>
            </div>
          </Link>
        ))}
      </section>
    </>
  );
}

export function NewsPostPage() {
  const { slug } = useParams();
  const post = posts.find((p) => p.slug === slug);
  if (!post) return <Navigate to="/news" replace />;

  return (
    <article className="mx-auto flex max-w-180 flex-col gap-7 px-8 pt-18 pb-22">
      <div className="flex items-center gap-3">
        <CategoryPill category={post.category} />
        <span className="text-[13px] text-faint">
          {formatDate(post.date)} · {post.readMinutes} min read
        </span>
      </div>
      <h1 className="font-display text-5xl font-bold leading-[1.15] tracking-[-0.025em]">{post.title}</h1>
      <p className="text-lg leading-relaxed text-graphite">{post.description}</p>
      <div className="flex h-70 items-center justify-center rounded-2xl border border-hairline bg-panel">
        <Mark size={96} invert />
      </div>
      <div
        className="prose-news flex flex-col gap-5 text-base leading-relaxed text-graphite [&_h2]:pt-2 [&_h2]:font-display [&_h2]:text-[26px] [&_h2]:font-bold [&_h2]:tracking-tight [&_h2]:text-ink [&_a]:text-accent [&_a]:underline [&_code]:font-mono [&_code]:text-[14px] [&_strong]:text-ink [&_em]:italic"
        dangerouslySetInnerHTML={{ __html: post.html }}
      />
      <div className="flex items-center gap-3 pt-2">
        <Button size="sm" href="mailto:hello@descanto.com?subject=Canto%20early%20access">Request access</Button>
        <Button size="sm" variant="outline" href="https://docs.descanto.com/docs/canto">Read the docs</Button>
      </div>
    </article>
  );
}
