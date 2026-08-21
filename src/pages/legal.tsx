import type { ReactNode } from "react";

/** Shared layout for the prose-only legal pages (/privacy, /terms). */
export function LegalPage({
  eyebrow,
  title,
  updated,
  children,
}: {
  eyebrow: string;
  title: string;
  updated: string;
  children: ReactNode;
}) {
  return (
    <article className="mx-auto flex max-w-180 flex-col gap-7 px-8 pt-18 pb-24">
      <div className="flex flex-col gap-3">
        <span className="text-xs font-semibold tracking-widest text-faint">{eyebrow}</span>
        <h1 className="font-display text-[clamp(34px,4vw,52px)] font-bold leading-[1.12] tracking-[-0.025em]">{title}</h1>
        <p className="text-[13px] text-faint">Last updated {updated}</p>
      </div>
      <div className="flex flex-col gap-5 text-[15.5px] leading-[1.7] text-graphite [&_h2]:pt-3 [&_h2]:font-display [&_h2]:text-[22px] [&_h2]:font-bold [&_h2]:tracking-tight [&_h2]:text-ink [&_a]:text-ink [&_a]:underline [&_ul]:flex [&_ul]:flex-col [&_ul]:gap-1.5 [&_ul]:pl-5 [&_li]:list-disc">
        {children}
      </div>
    </article>
  );
}
