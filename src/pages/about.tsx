import { Button } from "@/components/ui/button";
import { ContactForm } from "@/components/contact-form";

const beliefs = [
  ["Trust is structural", "Hard isolation, org-scoped APIs, and honest operation handles aren't features on a list — they're the reason you can hand an agent a real computer. We build them into the architecture, not the marketing."],
  ["State is sacred", "A desktop's history is append-only: every hibernate captures a generation, restore never destroys data, and forks never touch their parent. An agent should never lose where it was."],
  ["Honesty is a pricing model", "Canto bills only while your desktop responds. Cold starts, snapshots, and uploads are on us — our slowness can never charge you, and overage is strictly opt-in."],
];

export function AboutPage() {
  return (
    <>
      <section className="mx-auto flex max-w-[1440px] flex-col gap-6 px-20 pt-22 pb-16 max-lg:px-8">
        <span className="text-xs font-semibold tracking-widest text-faint">ABOUT CANTO</span>
        <h1 className="max-w-250 font-display text-[clamp(34px,3.6vw,52px)] font-bold leading-[1.2] tracking-[-0.025em]">
          Agents are becoming coworkers. Coworkers need a computer.
        </h1>
        <p className="max-w-180 text-[17px] leading-[1.65] text-graphite">
          Canto builds that computer: a persistent cloud desktop that wakes in half a second and never forgets where it
          was. Every desktop is a real Linux machine in its own microVM — an agent can drive it through one API, a human
          can watch the screen and take the mouse, and the whole thing hibernates to $0 compute the moment it's idle.
        </p>
      </section>

      <section className="mx-auto max-w-[1440px] px-20 pb-18 max-lg:px-8">
        <div className="grid grid-cols-3 border-t border-hairline max-md:grid-cols-1">
          {beliefs.map(([title, body], i) => (
            <div key={title} className={`flex flex-col gap-2.5 pt-8 ${i > 0 ? "border-l border-hairline pl-8 max-md:border-l-0 max-md:pl-0" : "pr-8"}`}>
              <h2 className="font-display text-lg font-bold tracking-tight">{title}</h2>
              <p className="text-sm leading-relaxed text-graphite">{body}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="contact" className="hairline-t">
        <div className="mx-auto flex max-w-[1440px] items-start justify-between gap-16 px-20 pt-14 pb-22 max-lg:flex-col max-lg:gap-10 max-lg:px-8">
          <div className="flex w-100 shrink-0 flex-col gap-3 max-lg:w-auto">
            <h2 className="font-display text-[28px] font-bold tracking-tight">Talk to us</h2>
            <p className="text-[14.5px] leading-relaxed text-graphite">
              Requesting early access, sizing a fleet, or just curious — drop a note and we'll get back to you. Prefer
              email? hello@descanto.com works too, and the repo is the front door.
            </p>
            <div className="flex items-center gap-3 pt-1">
              <Button size="sm" variant="outline" href="https://github.com/descanto">GitHub</Button>
              <Button size="sm" variant="outline" href="mailto:hello@descanto.com">Email us</Button>
            </div>
          </div>
          <div className="min-w-0 flex-1">
            <ContactForm />
          </div>
        </div>
      </section>
    </>
  );
}
