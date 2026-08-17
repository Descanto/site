import { Button } from "@/components/ui/button";

const beliefs = [
  ["Trust is structural", "Approvals, audit trails, and hard isolation aren't features on a list — they're the reason you can hand an agent real work. We build them into the architecture, not the marketing."],
  ["Your accounts are yours", "Botto runs on the AI subscription you already pay for, and credentials never leave your device. When you stop wanting us, fork the code and keep everything."],
  ["Honesty is a pricing model", "Canto bills only while your desktop responds, and overage is opt-in. Our slowness can never charge you. Auto-wake never converts into surprise spend."],
];

export function AboutPage() {
  return (
    <>
      <section className="mx-auto flex max-w-[1440px] flex-col gap-6 px-20 pt-22 pb-16 max-lg:px-8">
        <span className="text-xs font-semibold tracking-widest text-white/40">ABOUT DESCANTO</span>
        <h1 className="max-w-250 font-display text-[clamp(34px,3.6vw,52px)] font-medium leading-[1.2] tracking-[-0.025em]">
          Agents are becoming coworkers. Coworkers need two things: trust, and a computer.
        </h1>
        <p className="max-w-180 text-[17px] leading-[1.65] text-white/60">
          Descanto builds both sides of that stack. Botto is the teammate you talk to — open source, local-first, running
          on your accounts and your machine. Canto is the computer it works on — a persistent cloud desktop that wakes in
          half a second and never forgets where it was.
        </p>
      </section>

      <section className="mx-auto max-w-[1440px] px-20 pb-18 max-lg:px-8">
        <div className="grid grid-cols-3 border-t border-white/10 max-md:grid-cols-1">
          {beliefs.map(([title, body], i) => (
            <div key={title} className={`flex flex-col gap-2.5 pt-8 ${i > 0 ? "border-l border-white/10 pl-8 max-md:border-l-0 max-md:pl-0" : "pr-8"}`}>
              <h2 className="font-display text-lg font-semibold tracking-tight">{title}</h2>
              <p className="text-sm leading-relaxed text-white/55">{body}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="contact" className="hairline-t">
        <div className="mx-auto flex max-w-[1440px] items-center justify-between px-20 pt-12 pb-22 max-md:flex-col max-md:items-start max-md:gap-8 max-lg:px-8">
          <div className="flex flex-col gap-2">
            <h2 className="font-display text-[28px] font-medium tracking-tight">Talk to us</h2>
            <p className="text-[14.5px] text-white/55">hello@descanto.com — or open an issue, the repo is the front door.</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" href="https://github.com/descanto">GitHub</Button>
            <Button href="mailto:hello@descanto.com">Contact</Button>
          </div>
        </div>
      </section>
    </>
  );
}
