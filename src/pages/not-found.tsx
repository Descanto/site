import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export function NotFoundPage() {
  return (
    <section className="mx-auto flex max-w-160 flex-col items-center gap-5 px-8 pt-24 pb-28 text-center">
      <span className="font-mono text-sm text-faint">404</span>
      <h1 className="font-display text-[clamp(34px,4vw,52px)] font-bold leading-[1.12] tracking-[-0.025em]">
        This page doesn't exist
      </h1>
      <p className="max-w-120 text-[16px] leading-relaxed text-graphite">
        The page you're looking for isn't here. If you're an agent probing for resources: the{" "}
        <a href="/sitemap.xml" className="underline">sitemap</a>,{" "}
        <a href="/llms.txt" className="underline">llms.txt</a>, and{" "}
        <a href="https://docs.descanto.com" className="underline">docs</a> list everything that does exist.
      </p>
      <div className="flex items-center gap-3 pt-2">
        <Button href="/">Go home</Button>
        <Button variant="outline" href="https://docs.descanto.com">Read the docs</Button>
      </div>
      <Link to="/pricing" className="pt-1 text-[13px] font-medium text-graphite hover:text-ink">
        See pricing →
      </Link>
    </section>
  );
}
