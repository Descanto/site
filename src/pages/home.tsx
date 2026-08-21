import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Reveal, Stagger, StaggerItem } from "@/components/motion";

const PAGE_TITLE = "Descanto — instant-wake cloud desktops for agents";
const PAGE_DESCRIPTION =
  "Descanto gives computer-use agents a persistent Linux desktop that hibernates when idle and wakes in under a second. Honest, awake-time-only billing from $6/mo.";

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
    <svg width="13" height="13" viewBox="0 0 14 14" className="text-faint">
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
    <div className="min-w-0 flex-1 overflow-hidden rounded-2xl border border-hairline bg-surface">
      <div className="flex items-center justify-between border-b border-hairline px-4.5 py-3">
        <div className="flex items-center gap-3">
          <div className="flex gap-1.5">
            {[0, 1, 2].map((i) => (
              <span key={i} className="size-2.5 rounded-full bg-strong" />
            ))}
          </div>
          <span className="font-mono text-[11px] text-faint">{title}</span>
        </div>
        <button
          type="button"
          className="flex cursor-pointer items-center gap-1.5 rounded-md px-1.5 py-1 text-[11px] text-faint hover:text-graphite"
          onClick={() => {
            navigator.clipboard.writeText(code);
            setCopied(true);
            setTimeout(() => setCopied(false), 1600);
          }}
        >
          {copied ? "Copied" : <CopyIcon />}
        </button>
      </div>
      <pre className="overflow-x-auto p-5 font-mono text-[12.5px] leading-[21px] text-graphite">{code}</pre>
    </div>
  );
}

const steps = [
  ["01", "Create", "Create a desktop in one API call — pick a tier, get back a live desktop id."],
  ["02", "Work", "Your agent works — a full Linux desktop, browser included, streamed live so you can watch or take over."],
  ["03", "Hibernate", "Hibernate when idle — memory-snapshot preserved, wake in under a second, pay nothing while asleep."],
];

const sdkSnippet = `import { Canto } from "@descanto/sdk";

const canto = new Canto({ apiKey }); // or CANTO_API_KEY env var

const d = await canto.desktops.create({ tier: "default", billingMode: "monthly" });

const { stdout } = await d.exec("whoami");

await d.hibernate(); // pay nothing while asleep`;

const mcpClaudeCode = `claude mcp add descanto --env CANTO_API_KEY=canto_sk_... -- npx -y @descanto/mcp`;

const mcpConfig = `{
  "mcpServers": {
    "descanto": {
      "command": "npx",
      "args": ["-y", "@descanto/mcp"],
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

export function HomePage() {
  usePageMeta(PAGE_TITLE, PAGE_DESCRIPTION);
  const reduced = useReducedMotion();
  const [tab, setTab] = useState<"sdk" | "mcp">("sdk");

  return (
    <>
      {/* Hero */}
      <Stagger className="flex flex-col items-center gap-6 px-10 pt-22 pb-16 text-center">
        <StaggerItem>
          <div className="flex items-center gap-2.5 rounded-full border border-hairline bg-wash py-1.5 pl-1.5 pr-3.5 text-[13px]">
            <span className="rounded-full bg-ink px-2.5 py-0.5 text-[11px] font-semibold tracking-wider text-on-ink">
              EARLY ACCESS
            </span>
            <span className="font-medium text-ink">Manually provisioned this milestone</span>
          </div>
        </StaggerItem>
        <StaggerItem>
          <h1 className="font-display text-[clamp(40px,5vw,72px)] font-bold leading-[1.08] tracking-[-0.03em]">
            Every agent
            <br />
            <span className="text-faint">needs a computer.</span>
          </h1>
        </StaggerItem>
        <motion.div
          className="h-0.5 w-75 origin-left rounded-full bg-ink"
          initial={reduced ? false : { scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ delay: 0.45, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        />
        <StaggerItem>
          <p className="max-w-155 text-[17px] leading-relaxed text-graphite">
            Descanto gives computer-use agents a persistent Linux desktop that hibernates the instant it's idle and resumes
            exactly where it left off — tabs, processes, and logins intact. Always there. Pay only when it thinks.
          </p>
        </StaggerItem>
        <StaggerItem>
          <div className="flex items-center gap-3 pt-1.5">
            <Button href="/early-access">Request access</Button>
            <Button variant="outline" href="https://docs.descanto.com">Read the docs</Button>
          </div>
        </StaggerItem>
      </Stagger>

      {/* Terminal showcase */}
      <Reveal>
        <section className="mx-auto max-w-200 px-10 pb-18 max-lg:px-6">
          <CodeBlock
            title="desktop: release-bot · awake"
            code={`$ descanto wake release-bot
woke in 0.5s — 14 tabs, 3 processes, logins intact

$ descanto fork release-bot --count 20
20 forks in 4.5s · ~1.4 MB marginal RAM each`}
          />
        </section>
      </Reveal>

      {/* How it works */}
      <section className="hairline-t">
        <div className="mx-auto flex max-w-[1440px] flex-col gap-9 px-20 py-22 max-lg:px-8">
          <div className="flex flex-col gap-2.5">
            <h2 className="font-display text-4xl font-bold tracking-tight">How it works</h2>
            <p className="text-[15px] text-graphite">One API call to wake, work, and hibernate — nothing to manage in between.</p>
          </div>
          <div className="grid grid-cols-3 overflow-hidden rounded-2xl border border-hairline max-md:grid-cols-1">
            {steps.map(([tag, title, body], i) => (
              <Reveal key={tag} delay={i * 0.12}>
                <div className={`flex h-full flex-col gap-2.5 p-7 ${i > 0 ? "border-l border-hairline max-md:border-l-0 max-md:border-t" : ""}`}>
                  <span className="font-mono text-xs font-medium text-faint">{tag}</span>
                  <h3 className="font-display text-[19px] font-bold tracking-tight">{title}</h3>
                  <p className="text-sm leading-relaxed text-graphite">{body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Stats band */}
      <section className="hairline-t">
        <div className="mx-auto grid max-w-[1440px] grid-cols-3 px-20 py-22 max-md:grid-cols-1 max-md:gap-10 max-md:px-8">
          {[
            ["0.5s", "warm wake, live state intact"],
            ["20×", "forks from one desktop, ~225ms each"],
            ["$0", "compute while hibernated"],
          ].map(([stat, label], i) => (
            <div key={stat} className={i > 0 ? "border-l border-hairline max-md:border-l-0" : ""}>
              <Reveal delay={i * 0.12} className="flex flex-col items-center gap-2.5">
                <span className="font-display text-[64px] font-bold tracking-tight">{stat}</span>
                <span className="text-[13px] text-graphite">{label}</span>
              </Reveal>
            </div>
          ))}
        </div>
      </section>

      {/* Quickstart */}
      <section id="quickstart" className="hairline-t">
        <div className="mx-auto flex max-w-[1440px] flex-col gap-8 px-20 py-22 max-lg:px-8">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div className="flex flex-col gap-2.5">
              <h2 className="font-display text-4xl font-bold tracking-tight">Quickstart</h2>
              <p className="max-w-130 text-[15px] text-graphite">Drive desktops from code or straight from an MCP-compatible agent.</p>
            </div>
            <div className="flex items-center gap-2">
              {(["sdk", "mcp"] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTab(t)}
                  className={
                    tab === t
                      ? "rounded-full bg-ink px-4.5 py-2.25 text-sm font-medium text-on-ink cursor-pointer"
                      : "rounded-full border border-strong px-4.5 py-2.25 text-sm text-graphite cursor-pointer hover:text-ink"
                  }
                >
                  {t === "sdk" ? "TypeScript SDK" : "MCP server"}
                </button>
              ))}
            </div>
          </div>

          {tab === "sdk" ? (
            <CodeBlock title="typescript · @descanto/sdk" code={sdkSnippet} />
          ) : (
            <div className="flex flex-col gap-5">
              <CodeBlock title="bash · claude mcp add" code={mcpClaudeCode} />
              <CodeBlock title="json · claude_desktop_config.json" code={mcpConfig} />
            </div>
          )}
        </div>
      </section>

      {/* Principles */}
      <section className="hairline-t">
        <Reveal className="mx-auto flex max-w-[1440px] flex-col gap-8 px-20 py-24 max-lg:px-8">
          <div className="flex items-baseline justify-between">
            <h2 className="font-display text-[32px] font-bold tracking-tight">How we build</h2>
            <a href="https://docs.descanto.com" className="text-[13px] font-medium text-graphite hover:text-ink">
              Read the docs →
            </a>
          </div>
          <div className="grid grid-cols-3 overflow-hidden rounded-2xl border border-hairline max-md:grid-cols-1">
            {[
              ["honest-metering", "Our slowness never bills you", "Descanto meters only while your desktop responds. Cold starts, snapshots, and uploads are on us — and overage is opt-in, never a surprise."],
              ["snapshot-native", "State is the product", "Every hibernate captures a full memory snapshot. Restore any generation, fork a running machine, and never lose where an agent left off."],
              ["hard-isolation", "MicroVM boundaries", "Every desktop is its own Firecracker microVM — hardware-virtualized isolation, not a shared container pretending to be a computer."],
            ].map(([tag, title, body], i) => (
              <div key={tag} className={`flex flex-col gap-3 p-7 ${i > 0 ? "border-l border-hairline max-md:border-l-0 max-md:border-t" : ""}`}>
                <span className="font-mono text-xs font-medium text-faint">{tag}</span>
                <h3 className="font-display text-[19px] font-bold tracking-tight">{title}</h3>
                <p className="text-sm leading-relaxed text-graphite">{body}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      {/* Positioning strip */}
      <section className="hairline-t">
        <div className="mx-auto flex max-w-[1440px] flex-col gap-6 px-20 py-16 max-lg:px-8">
          <span className="text-xs font-semibold tracking-widest text-faint">BUILT FOR AGENTS</span>
          <div className="grid grid-cols-3 gap-8 max-md:grid-cols-1">
            {positioning.map(([title, body]) => (
              <div key={title} className="flex items-start gap-2.5">
                <span className="mt-1 shrink-0"><CheckIcon /></span>
                <div className="flex flex-col gap-1">
                  <h3 className="text-[14.5px] font-semibold">{title}</h3>
                  <p className="text-[13.5px] leading-5 text-graphite">{body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Closer */}
      <section className="hairline-t">
        <div className="flex flex-col items-center gap-5 px-20 py-26 text-center max-lg:px-8">
          <h2 className="font-display text-5xl font-bold tracking-tight">Give your agent a computer</h2>
          <p className="text-base text-graphite">Always there. Pay only when it thinks.</p>
          <div className="flex items-center gap-3 pt-1">
            <Button variant="outline" href="https://docs.descanto.com">Read the docs</Button>
            <Button href="/early-access">Request access</Button>
          </div>
          <Link to="/pricing" className="pt-1 text-[13px] font-medium text-graphite hover:text-ink">
            See pricing →
          </Link>
        </div>
      </section>
    </>
  );
}
