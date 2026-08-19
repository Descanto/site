import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Reveal, Stagger, StaggerItem } from "@/components/motion";

const PAGE_TITLE = "Canto — instant-wake cloud desktops for agents | Descanto";
const PAGE_DESCRIPTION =
  "Canto gives computer-use agents a persistent Linux desktop that hibernates when idle and wakes in under a second. Honest, awake-time-only billing from $4.50/mo.";

function usePageMeta(title: string, description: string) {
  useEffect(() => {
    const prevTitle = document.title;
    document.title = title;
    const meta = document.querySelector('meta[name="description"]');
    const prevDescription = meta?.getAttribute("content") ?? "";
    meta?.setAttribute("content", description);
    return () => {
      document.title = prevTitle;
      meta?.setAttribute("content", prevDescription);
    };
  }, [title, description]);
}

function CopyIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 14 14" className="text-white/45">
      <rect x="4.5" y="4.5" width="8" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.3" fill="none" />
      <path
        d="M9.5 4.5V3a1.5 1.5 0 0 0-1.5-1.5H3A1.5 1.5 0 0 0 1.5 3v5A1.5 1.5 0 0 0 3 9.5h1.5"
        stroke="currentColor"
        strokeWidth="1.3"
        fill="none"
      />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 14 14" className="text-ok">
      <path d="M2.5 7.3L5.4 10.2L11.5 3.8" stroke="currentColor" strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CodeBlock({ title, code }: { title: string; code: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <div className="min-w-0 flex-1 overflow-hidden rounded-2xl border border-white/10 bg-surface">
      <div className="flex items-center justify-between border-b border-white/8 px-4.5 py-3">
        <div className="flex items-center gap-3">
          <div className="flex gap-1.5">
            {[0, 1, 2].map((i) => (
              <span key={i} className="size-2.5 rounded-full bg-white/16" />
            ))}
          </div>
          <span className="font-mono text-[11px] text-white/40">{title}</span>
        </div>
        <button
          type="button"
          className="flex cursor-pointer items-center gap-1.5 rounded-md px-1.5 py-1 text-[11px] text-white/45 hover:text-white/80"
          onClick={() => {
            navigator.clipboard.writeText(code);
            setCopied(true);
            setTimeout(() => setCopied(false), 1600);
          }}
        >
          {copied ? "Copied" : <CopyIcon />}
        </button>
      </div>
      <pre className="overflow-x-auto p-5 font-mono text-[12.5px] leading-[21px] text-white/80">{code}</pre>
    </div>
  );
}

const steps = [
  ["01", "Create", "Create a desktop in one API call — pick a tier, get back a live desktop id."],
  ["02", "Work", "Your agent works — a full Linux desktop, browser included, streamed live so you can watch."],
  ["03", "Hibernate", "Hibernate when idle — memory-snapshot preserved, wake in under a second, pay nothing while asleep."],
];

interface Tier {
  name: string;
  specs: string;
  monthly: string;
  hourly: string;
  highlight: boolean;
}

const tiers: Tier[] = [
  { name: "Small", specs: "2 vCPU · 4 GB RAM", monthly: "$4.50", hourly: "$0.00675", highlight: false },
  { name: "Default", specs: "4 vCPU · 8 GB RAM", monthly: "$9", hourly: "$0.0135", highlight: true },
  { name: "Large", specs: "8 vCPU · 16 GB RAM", monthly: "$18", hourly: "$0.027", highlight: false },
];

const sdkSnippet = `import { Canto } from "@descanto/vm-sdk";

const canto = new Canto({ apiKey }); // or CANTO_API_KEY env var

const d = await canto.desktops.create({ tier: "default", billingMode: "monthly" });

const { stdout } = await d.exec("whoami");

await d.hibernate(); // pay nothing while asleep`;

const mcpClaudeCode = `claude mcp add canto --env CANTO_API_KEY=canto_sk_... -- node /path/to/canto/mcp/dist/index.js`;

const mcpConfig = `{
  "mcpServers": {
    "canto": {
      "command": "node",
      "args": ["/path/to/canto/mcp/dist/index.js"],
      "env": {
        "CANTO_API_KEY": "canto_sk_..."
      }
    }
  }
}`;

const positioning = [
  ["Snapshot-native", "Every desktop hibernates as a full memory snapshot — state intact, compute at zero while it sleeps."],
  ["Org-scoped API", "Every by-id route is org-scoped end to end — a key only ever sees its own org's desktops."],
  ["Honest operation handles", "Waking, hibernating, and destroying return an operation you can poll — no guessing at state."],
];

export function CantoPage() {
  usePageMeta(PAGE_TITLE, PAGE_DESCRIPTION);
  const [billing, setBilling] = useState<"monthly" | "hourly">("monthly");
  const [tab, setTab] = useState<"sdk" | "mcp">("sdk");

  return (
    <>
      {/* Hero */}
      <Stagger className="flex flex-col items-center gap-6 px-10 pt-20 pb-16 text-center">
        <StaggerItem>
          <div className="flex items-center gap-2.5 rounded-full border border-white/14 bg-white/4 py-1.5 pl-1.5 pr-3.5 text-[13px]">
            <span className="rounded-full bg-white px-2.5 py-0.5 text-[11px] font-semibold tracking-wider text-ground">
              EARLY ACCESS
            </span>
            <span className="font-medium text-white/88">Manually provisioned this milestone</span>
          </div>
        </StaggerItem>
        <StaggerItem>
          <h1 className="font-display text-[clamp(40px,4.8vw,68px)] font-medium leading-[1.09] tracking-[-0.03em]">
            Canto
            <br />
            <span className="text-white/45">instant-wake desktops for agents.</span>
          </h1>
        </StaggerItem>
        <StaggerItem>
          <p className="max-w-140 text-[18px] leading-relaxed text-white/75">
            Always there. Pay only when it thinks.
          </p>
        </StaggerItem>
        <StaggerItem>
          <p className="max-w-150 text-[15px] leading-relaxed text-white/55">
            Persistent cloud desktops for computer-use agents — a full Linux workstation that hibernates the instant it's
            idle and resumes exactly where it left off.
          </p>
        </StaggerItem>
        <StaggerItem>
          <div className="flex items-center gap-3 pt-1.5">
            <Button href="mailto:hello@descanto.com?subject=Canto%20early%20access">Request access</Button>
            <Button variant="outline" href="#quickstart">Read the docs</Button>
          </div>
        </StaggerItem>
      </Stagger>

      {/* How it works */}
      <section className="hairline-t">
        <div className="mx-auto flex max-w-[1440px] flex-col gap-9 px-20 py-22 max-lg:px-8">
          <div className="flex flex-col gap-2.5">
            <h2 className="font-display text-4xl font-medium tracking-tight">How it works</h2>
            <p className="text-[15px] text-white/55">One API call to wake, work, and hibernate — nothing to manage in between.</p>
          </div>
          <div className="grid grid-cols-3 overflow-hidden rounded-2xl border border-white/10 max-md:grid-cols-1">
            {steps.map(([tag, title, body], i) => (
              <Reveal key={tag} delay={i * 0.12}>
                <div className={`flex h-full flex-col gap-2.5 p-7 ${i > 0 ? "border-l border-white/10 max-md:border-l-0 max-md:border-t" : ""}`}>
                  <span className="font-mono text-xs font-medium text-white/45">{tag}</span>
                  <h3 className="font-display text-[19px] font-semibold tracking-tight">{title}</h3>
                  <p className="text-sm leading-relaxed text-white/55">{body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="hairline-t">
        <Reveal className="mx-auto flex max-w-[1440px] flex-col gap-9 px-20 py-22 max-lg:px-8">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div className="flex flex-col gap-2.5">
              <div className="flex items-center gap-2.5">
                <h2 className="font-display text-4xl font-medium tracking-tight">Pricing</h2>
                <span className="rounded-full border border-white/22 px-2.5 py-0.5 text-[11px] font-semibold tracking-wider text-white/75">
                  Early access — manually provisioned
                </span>
              </div>
              <p className="max-w-130 text-[15px] text-white/55">Locked launch pricing. Pick a tier, pick a billing mode.</p>
            </div>
            <div className="flex items-center gap-1 rounded-full border border-white/12 bg-white/4 p-1">
              {(["monthly", "hourly"] as const).map((mode) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => setBilling(mode)}
                  className={
                    billing === mode
                      ? "rounded-full bg-white px-4 py-1.75 text-[13px] font-medium text-ground cursor-pointer"
                      : "rounded-full px-4 py-1.75 text-[13px] font-medium text-white/60 hover:text-white cursor-pointer"
                  }
                >
                  {mode === "monthly" ? "Monthly" : "Hourly"}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-5 max-lg:grid-cols-1">
            {tiers.map((tier) => (
              <div
                key={tier.name}
                className={`flex flex-col gap-4 rounded-2xl p-8 ${tier.highlight ? "border border-white/22 bg-surface" : "border border-white/10"}`}
              >
                <div className="flex items-center justify-between">
                  <div className="text-[15px] font-semibold">{tier.name}</div>
                  {tier.highlight && (
                    <span className="rounded-full bg-white px-3 py-1 text-[11px] font-semibold tracking-wider text-ground">DEFAULT</span>
                  )}
                </div>
                <div className="flex items-baseline gap-1.5">
                  <span className="font-display text-[44px] font-medium tracking-tight">
                    {billing === "monthly" ? tier.monthly : tier.hourly}
                  </span>
                  <span className="text-sm text-white/45">{billing === "monthly" ? "/mo" : "/h, awake only"}</span>
                </div>
                <code className="font-mono text-[12.5px] text-white/65">{tier.specs}</code>
                <div className="pt-1.5">
                  <Button
                    size="sm"
                    variant={tier.highlight ? "primary" : "outline"}
                    href="mailto:hello@descanto.com?subject=Canto%20early%20access"
                  >
                    Request the {tier.name.toLowerCase()} tier
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <p className="max-w-180 text-[13.5px] leading-relaxed text-white/50">
            Monthly commit saves ~9.5% vs on-demand. Hourly bills only awake time — hibernated desktops cost $0 compute.
          </p>
        </Reveal>
      </section>

      {/* Quickstart */}
      <section id="quickstart" className="hairline-t">
        <div className="mx-auto flex max-w-[1440px] flex-col gap-8 px-20 py-22 max-lg:px-8">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div className="flex flex-col gap-2.5">
              <h2 className="font-display text-4xl font-medium tracking-tight">Quickstart</h2>
              <p className="max-w-130 text-[15px] text-white/55">Drive desktops from code or straight from an MCP-compatible agent.</p>
            </div>
            <div className="flex items-center gap-2">
              {(["sdk", "mcp"] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTab(t)}
                  className={
                    tab === t
                      ? "rounded-full bg-white px-4.5 py-2.25 text-sm font-medium text-ground cursor-pointer"
                      : "rounded-full border border-white/18 px-4.5 py-2.25 text-sm text-white/80 cursor-pointer hover:text-white"
                  }
                >
                  {t === "sdk" ? "TypeScript SDK" : "MCP server"}
                </button>
              ))}
            </div>
          </div>

          {tab === "sdk" ? (
            <CodeBlock title="typescript · @descanto/vm-sdk" code={sdkSnippet} />
          ) : (
            <div className="flex flex-col gap-5">
              <CodeBlock title="bash · claude mcp add" code={mcpClaudeCode} />
              <CodeBlock title="json · claude_desktop_config.json" code={mcpConfig} />
            </div>
          )}
        </div>
      </section>

      {/* Positioning strip */}
      <section className="hairline-t">
        <div className="mx-auto flex max-w-[1440px] flex-col gap-6 px-20 py-16 max-lg:px-8">
          <span className="text-xs font-semibold tracking-widest text-white/40">BUILT FOR AGENTS</span>
          <div className="grid grid-cols-3 gap-8 max-md:grid-cols-1">
            {positioning.map(([title, body]) => (
              <div key={title} className="flex items-start gap-2.5">
                <span className="mt-1 shrink-0"><CheckIcon /></span>
                <div className="flex flex-col gap-1">
                  <h3 className="text-[14.5px] font-semibold">{title}</h3>
                  <p className="text-[13.5px] leading-5 text-white/55">{body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Closer */}
      <section className="hairline-t">
        <div className="flex flex-col items-center gap-5 px-20 py-26 text-center max-lg:px-8">
          <h2 className="font-display text-5xl font-medium tracking-tight">Give your agent a computer</h2>
          <p className="text-base text-white/55">Always there. Pay only when it thinks.</p>
          <div className="flex items-center gap-3 pt-1">
            <Button variant="outline" href="#quickstart">Read the docs</Button>
            <Button href="mailto:hello@descanto.com?subject=Canto%20early%20access">Request access</Button>
          </div>
        </div>
      </section>
    </>
  );
}
