import { useState } from "react";
import { Button } from "@/components/ui/button";

interface Tier {
  name: string;
  tagline: string;
  specs: string;
  monthly: string;
  hourly: string;
  note: string;
  highlight: boolean;
}

// Locked launch prices — must match docs/content/docs/concepts/billing.mdx.
const tiers: Tier[] = [
  {
    name: "Small",
    tagline: "Light browsing and checks",
    specs: "2 vCPU · 4 GB RAM",
    monthly: "$6",
    hourly: "$0.009",
    note: "For watchers, pollers, and light browser work",
    highlight: false,
  },
  {
    name: "Default",
    tagline: "The agent workstation",
    specs: "4 vCPU · 8 GB RAM",
    monthly: "$12",
    hourly: "$0.018",
    note: "Full Linux desktop with browser — the tier most agents run on",
    highlight: true,
  },
  {
    name: "Large",
    tagline: "Builds and heavy work",
    specs: "8 vCPU · 16 GB RAM",
    monthly: "$24",
    hourly: "$0.036",
    note: "Compiles, Docker, and anything that eats cores",
    highlight: false,
  },
];

const guarantees = [
  ["metering", "Billed only while responsive", "Metering runs from guest-responsive to hibernate. Cold-host waits, snapshot writes, and uploads are on us — our slowness can never charge you."],
  ["hibernation", "Idle costs nothing", "Hibernated desktops keep their full state — memory included — and wake in half a second, at $0 compute while asleep."],
  ["billing-mode", "Chosen per desktop", "Pick monthly or hourly at creation, per desktop. Monthly commit saves ~9.5% vs on-demand for full-time usage."],
];

export function PricingPage() {
  const [billing, setBilling] = useState<"monthly" | "hourly">("monthly");

  return (
    <>
      <section className="flex flex-col items-center gap-4 px-20 pt-18 pb-12 text-center max-lg:px-8">
        <h1 className="font-display text-[56px] font-bold tracking-[-0.03em]">Pricing</h1>
        <p className="max-w-140 text-base leading-relaxed text-graphite">
          Locked launch pricing. Pick a tier, pick a billing mode — hourly bills only awake time, and hibernated desktops
          cost $0 compute.
        </p>
        <div className="mt-2 flex items-center gap-1 rounded-full border border-hairline bg-wash p-1">
          {(["monthly", "hourly"] as const).map((mode) => (
            <button
              key={mode}
              type="button"
              onClick={() => setBilling(mode)}
              className={
                billing === mode
                  ? "rounded-full bg-ink px-4 py-1.75 text-[13px] font-medium text-on-ink cursor-pointer"
                  : "rounded-full px-4 py-1.75 text-[13px] font-medium text-graphite hover:text-ink cursor-pointer"
              }
            >
              {mode === "monthly" ? "Monthly" : "Hourly"}
            </button>
          ))}
        </div>
      </section>

      <section className="mx-auto grid max-w-[1440px] grid-cols-3 gap-5 px-20 pb-10 max-lg:grid-cols-1 max-lg:px-8">
        {tiers.map((tier) => (
          <div
            key={tier.name}
            className={`flex flex-col gap-4 rounded-2xl p-8 ${tier.highlight ? "border border-strong bg-surface" : "border border-hairline"}`}
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="text-[15px] font-semibold">{tier.name}</div>
                <div className="text-[13px] text-faint">{tier.tagline}</div>
              </div>
              {tier.highlight && (
                <span className="rounded-full bg-ink px-3 py-1 text-[11px] font-semibold tracking-wider text-on-ink">DEFAULT</span>
              )}
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="font-display text-[44px] font-bold tracking-tight">
                {billing === "monthly" ? tier.monthly : tier.hourly}
              </span>
              <span className="text-sm text-faint">{billing === "monthly" ? "/mo" : "/h, awake only"}</span>
            </div>
            <div className="flex flex-col gap-2">
              <code className="font-mono text-[12.5px] text-graphite">{tier.specs}</code>
              <p className="text-[13.5px] text-graphite">{tier.note}</p>
            </div>
            <div className="pt-1.5">
              <Button
                size="sm"
                variant={tier.highlight ? "primary" : "outline"}
                href={`/early-access?tier=${tier.name.toLowerCase()}`}
              >
                Request the {tier.name.toLowerCase()} tier
              </Button>
            </div>
          </div>
        ))}
      </section>

      <section className="mx-auto max-w-[1440px] px-20 pb-22 max-lg:px-8">
        <div className="grid grid-cols-3 overflow-hidden rounded-2xl border border-hairline max-md:grid-cols-1">
          {guarantees.map(([tag, title, body], i) => (
            <div key={tag} className={`flex flex-col gap-2 p-6.5 ${i > 0 ? "border-l border-hairline max-md:border-l-0 max-md:border-t" : ""}`}>
              <span className="font-mono text-xs text-faint">{tag}</span>
              <h3 className="text-[14.5px] font-semibold">{title}</h3>
              <p className="text-[13.5px] leading-5 text-graphite">{body}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
