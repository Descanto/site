import { Button } from "@/components/ui/button";

const tiers = [
  {
    name: "Small",
    tagline: "0.5× — light browsing and checks",
    price: "$12",
    specs: "2 vCPU · 4 GB RAM · 40 GB disk",
    note: "Awake-hours draw from the org pool at 0.5×",
    cta: "Create a Small desktop",
    highlight: false,
  },
  {
    name: "Default",
    tagline: "1× — the agent workstation",
    price: "$24",
    specs: "4 vCPU · 8 GB RAM · 80 GB disk",
    note: "Chromium, VS Code, Docker, and CLI toolbelt preinstalled",
    cta: "Create a desktop",
    highlight: true,
  },
  {
    name: "Large",
    tagline: "2× — builds, Docker, heavy work",
    price: "$48",
    specs: "8 vCPU · 16 GB RAM · 128 GB disk",
    note: "Awake-hours draw from the org pool at 2×",
    cta: "Create a Large desktop",
    highlight: false,
  },
];

const guarantees = [
  ["metering", "Billed only while responsive", "Cold-host waits, snapshot writes, and uploads are on us. Our slowness can never charge you."],
  ["overage", "Opt-in, never surprise", "Pool exhausted? Desktops get a 5-minute courtesy drain, then hibernate. They never bill past your cap unless you say so."],
  ["hibernation", "Idle costs nothing extra", "Hibernated desktops keep their full state and wake in half a second — without burning awake-hours."],
];

export function PricingPage() {
  return (
    <>
      <section className="flex flex-col items-center gap-4 px-20 pt-18 pb-12 text-center max-lg:px-8">
        <h1 className="font-display text-[56px] font-medium tracking-[-0.03em]">Canto pricing</h1>
        <p className="max-w-140 text-base leading-relaxed text-white/60">
          Per-desktop subscription plus included awake-hours, pooled across your org. Overage is opt-in — we never convert
          auto-wake into surprise spend.
        </p>
      </section>

      <section className="mx-auto grid max-w-[1440px] grid-cols-3 gap-5 px-20 pb-10 max-lg:grid-cols-1 max-lg:px-8">
        {tiers.map((tier) => (
          <div
            key={tier.name}
            className={`flex flex-col gap-4 rounded-2xl p-8 ${tier.highlight ? "border border-white/22 bg-surface" : "border border-white/10"}`}
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="text-[15px] font-semibold">{tier.name}</div>
                <div className="text-[13px] text-white/45">{tier.tagline}</div>
              </div>
              {tier.highlight && (
                <span className="rounded-full bg-white px-3 py-1 text-[11px] font-semibold tracking-wider text-ground">MOST COMMON</span>
              )}
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="font-display text-[44px] font-medium tracking-tight">{tier.price}</span>
              <span className="text-sm text-white/45">/ desktop / month</span>
            </div>
            <div className="flex flex-col gap-2">
              <code className="font-mono text-[12.5px] text-white/65">{tier.specs}</code>
              <p className="text-[13.5px] text-white/60">{tier.note}</p>
            </div>
            <div className="pt-1.5">
              <Button size="sm" variant={tier.highlight ? "primary" : "outline"} href="mailto:hello@descanto.com?subject=Canto%20early%20access">
                {tier.cta}
              </Button>
            </div>
          </div>
        ))}
      </section>

      <section className="mx-auto max-w-[1440px] px-20 pb-22 max-lg:px-8">
        <div className="grid grid-cols-3 overflow-hidden rounded-2xl border border-white/10 max-md:grid-cols-1">
          {guarantees.map(([tag, title, body], i) => (
            <div key={tag} className={`flex flex-col gap-2 p-6.5 ${i > 0 ? "border-l border-white/10 max-md:border-l-0 max-md:border-t" : ""}`}>
              <span className="font-mono text-xs text-white/45">{tag}</span>
              <h3 className="text-[14.5px] font-semibold">{title}</h3>
              <p className="text-[13.5px] leading-5 text-white/55">{body}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
