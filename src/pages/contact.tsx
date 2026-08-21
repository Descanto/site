import { Button } from "@/components/ui/button";
import { ContactForm } from "@/components/contact-form";

const channels = [
  ["Email", "hello@descanto.com is read by the founding team — expect a reply within one business day. It's the right channel for early-access questions, fleet sizing, partnership ideas, security reports, and privacy requests alike."],
  ["GitHub", "github.com/descanto hosts the CLI, the SDKs, and the MCP server. Issues and pull requests there are watched as closely as email — for anything reproducible in code, it's usually the fastest route to a fix."],
  ["Early access", "Requesting desktops? Use the early-access form — it routes straight to provisioning and asks the two questions we need (tier and use case) to get you an API key quickly."],
];

export function ContactPage() {
  return (
    <>
      <section className="mx-auto flex max-w-[1440px] flex-col gap-5 px-20 pt-22 pb-12 max-lg:px-8">
        <span className="text-xs font-semibold tracking-widest text-faint">CONTACT</span>
        <h1 className="max-w-250 font-display text-[clamp(34px,3.6vw,52px)] font-bold leading-[1.2] tracking-[-0.025em]">
          Talk to the team behind Canto
        </h1>
        <p className="max-w-180 text-[17px] leading-[1.65] text-graphite">
          Descanto is a small team and every message lands with someone who can actually act on it. Whether you're
          requesting early access, sizing a fleet of agent desktops, reporting a security issue, or just curious how
          hibernation works under the hood — drop a note below or email{" "}
          <a href="mailto:hello@descanto.com" className="text-ink underline">hello@descanto.com</a> directly.
        </p>
      </section>

      <section className="mx-auto max-w-[1440px] px-20 pb-14 max-lg:px-8">
        <div className="grid grid-cols-3 border-t border-hairline max-md:grid-cols-1">
          {channels.map(([title, body], i) => (
            <div key={title} className={`flex flex-col gap-2.5 pt-8 ${i > 0 ? "border-l border-hairline pl-8 max-md:border-l-0 max-md:pl-0" : "pr-8"}`}>
              <h2 className="font-display text-lg font-bold tracking-tight">{title}</h2>
              <p className="text-sm leading-relaxed text-graphite">{body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="hairline-t">
        <div className="mx-auto flex max-w-[1440px] items-start justify-between gap-16 px-20 pt-14 pb-22 max-lg:flex-col max-lg:gap-10 max-lg:px-8">
          <div className="flex w-100 shrink-0 flex-col gap-3 max-lg:w-auto">
            <h2 className="font-display text-[28px] font-bold tracking-tight">Send a message</h2>
            <p className="text-[14.5px] leading-relaxed text-graphite">
              Goes straight to our inbox — no ticket queue, no autoresponder. Include enough detail that we can answer in
              one round trip.
            </p>
            <div className="flex items-center gap-3 pt-1">
              <Button size="sm" variant="outline" href="https://github.com/descanto">GitHub</Button>
              <Button size="sm" variant="outline" href="mailto:hello@descanto.com">Email us</Button>
            </div>
            <address className="pt-3 text-[13px] not-italic leading-relaxed text-faint">
              DV CENTRAL HOLDINGS LTD (trading as Descanto)
              <br />
              71-75 Shelton Street, Covent Garden
              <br />
              London WC2H 9JQ, United Kingdom
            </address>
          </div>
          <div className="min-w-0 flex-1">
            <ContactForm />
          </div>
        </div>
      </section>
    </>
  );
}
