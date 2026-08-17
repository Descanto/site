import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/motion";

const INSTALL = "$ pip install canto && canto desktops create";

function CopyCommand() {
  return (
    <button
      className="flex cursor-pointer items-center gap-3.5 rounded-xl border border-white/12 bg-surface px-5 py-3 font-mono text-sm text-white/85 hover:border-white/25"
      onClick={() => navigator.clipboard.writeText(INSTALL.slice(2))}
    >
      {INSTALL}
      <svg width="14" height="14" viewBox="0 0 14 14" className="text-white/50">
        <rect x="4.5" y="4.5" width="8" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.3" fill="none" />
        <path d="M9.5 4.5V3a1.5 1.5 0 0 0-1.5-1.5H3A1.5 1.5 0 0 0 1.5 3v5A1.5 1.5 0 0 0 3 9.5h1.5" stroke="currentColor" strokeWidth="1.3" fill="none" />
      </svg>
    </button>
  );
}

function Cli({ children }: { children: string }) {
  return (
    <div className="min-w-0 flex-1 overflow-hidden rounded-2xl border border-white/10 bg-surface">
      <div className="flex items-center justify-between border-b border-white/8 px-4.5 py-3">
        <div className="flex gap-1.5">
          {[0, 1, 2].map((i) => (
            <span key={i} className="size-2.5 rounded-full bg-white/16" />
          ))}
        </div>
        <span className="font-mono text-[11px] text-white/40">canto-cli</span>
      </div>
      <pre className="overflow-x-auto p-5.5 font-mono text-[13px] leading-[22px] text-white/80">{children}</pre>
    </div>
  );
}

function Checklist({ items }: { items: string[] }) {
  return (
    <ul className="flex flex-col gap-2.25 pt-1">
      {items.map((item) => (
        <li key={item} className="flex items-center gap-2.5 text-sm text-white/80">
          <span className="text-white/45">✓</span> {item}
        </li>
      ))}
    </ul>
  );
}

const grid = [
  ["Streaming", "Unlimited viewers on one encode. Watch your agent work in real time."],
  ["Human takeover", "One control session with clean handoff. Grab the mouse when it gets stuck."],
  ["Snapshot history", "Generations every hour, kept for days. Rewind an agent that broke something."],
  ["MicroVM isolation", "Firecracker, jailer, and network namespaces per desktop. No dev-mode escape hatch exists."],
  ["Honest metering", "Billing runs only while your desktop responds. Our slowness never charges you."],
  ["Agent workstation image", "Ubuntu with Chromium, VS Code, Docker, and the CLI toolbelt agents actually use."],
  ["No surprise spend", "Overage is opt-in. Exhausted hours drain gracefully to hibernate — never to a bill."],
  ["Org pooling", "Awake-hours are shared across your org, weighted by desktop size."],
  ["API, CLI, and MCP", "Drive desktops from code, the terminal, or straight from your agent harness."],
];

export function CantoPage() {
  return (
    <>
      {/* Hero */}
      <section className="flex flex-col items-center gap-6 px-10 pt-18 pb-14 text-center">
        <div className="flex items-center gap-2.5 rounded-full border border-white/14 bg-white/4 py-1.5 pl-1.5 pr-3.5 text-[13px]">
          <span className="rounded-full bg-white px-2.5 py-0.5 text-[11px] font-semibold tracking-wider text-ground">NEW</span>
          <span className="font-medium text-white/88">Early access open — now powering every Botto desktop</span>
          <span className="text-white/45">→</span>
        </div>
        <h1 className="font-display text-[clamp(40px,4.8vw,68px)] font-medium leading-[1.09] tracking-[-0.03em]">
          Give your agent
          <br />
          <span className="text-white/45">a computer.</span>
        </h1>
        <p className="max-w-150 text-[17px] leading-relaxed text-white/60">
          Persistent cloud desktops for computer-use agents. Instant wake with live state — tabs, processes, and logins
          survive hibernation.
        </p>
        <CopyCommand />
        <div className="flex items-center gap-6 text-[13px] font-medium text-white/65">
          <a href="https://github.com/descanto" className="hover:text-white">Read docs ↗</a>
          <a href="/canto/pricing" className="hover:text-white">Pricing ↗</a>
          <a href="https://github.com/descanto" className="hover:text-white">Changelog ↗</a>
        </div>
      </section>

      {/* Instant wake */}
      <section className="hairline-t">
        <Reveal className="mx-auto flex max-w-[1440px] items-center gap-18 px-20 py-22 max-lg:flex-col max-lg:px-8">
          <div className="flex w-105 shrink-0 flex-col gap-3.5 max-lg:w-auto">
            <h2 className="font-display text-3xl font-medium tracking-tight">Instant wake</h2>
            <p className="text-[15px] leading-relaxed text-white/60">
              Desktops hibernate when idle and resume exactly where they left off.
            </p>
            <Checklist items={["Warm wake in ~0.5s, host-cold in ~1.2s", "Tabs, processes, and logins intact", "Any host can wake any desktop"]} />
          </div>
          <Cli>{`$ canto wake research-agent
● waking gen 41 … done in 0.5s

  chromium    14 tabs restored
  vs code     workspace open
  session     logged in, cookies live

$ canto status
research-agent   awake    0.5s ago`}</Cli>
        </Reveal>
      </section>

      {/* Fork and rewind */}
      <section>
        <Reveal className="mx-auto flex max-w-[1440px] items-center gap-18 px-20 py-22 max-lg:flex-col-reverse max-lg:px-8">
          <Cli>{`$ canto fork research-agent --count 20
● 20 ephemeral forks in 4.5s
  ~1.4 MB marginal RAM per clone

$ canto promote fork-07
● fork-07 → full desktop, history kept

$ canto restore research-agent --gen 40
● branched from gen 40 — nothing destroyed`}</Cli>
          <div className="flex w-105 shrink-0 flex-col gap-3.5 max-lg:w-auto">
            <h2 className="font-display text-3xl font-medium tracking-tight">Fork and rewind</h2>
            <p className="text-[15px] leading-relaxed text-white/60">
              Spin twenty copies of one machine for parallel runs, keep the best, rewind the rest.
            </p>
            <Checklist items={["~225ms per fork, copy-on-write memory", "Promote a fork to a full desktop in place", "Restore branches history — never destroys"]} />
          </div>
        </Reveal>
      </section>

      {/* Grid */}
      <section id="api" className="hairline-t">
        <div className="mx-auto flex max-w-[1440px] flex-col gap-9 px-20 py-22 max-lg:px-8">
          <div className="flex flex-col gap-2.5">
            <h2 className="font-display text-4xl font-medium tracking-tight">Everything an agent's computer needs</h2>
            <p className="text-[15px] text-white/55">
              One platform for the entire desktop lifecycle — wake, work, watch, and bill honestly.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-x-12 gap-y-9 max-lg:grid-cols-2 max-sm:grid-cols-1">
            {grid.map(([title, body]) => (
              <div key={title} className="flex flex-col gap-1.5">
                <h3 className="text-[14.5px] font-semibold">{title}</h3>
                <p className="text-[13.5px] leading-5 text-white/55">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Closer */}
      <section className="hairline-t">
        <div className="flex flex-col items-center gap-5 px-20 py-26 text-center max-lg:px-8">
          <h2 className="font-display text-5xl font-medium tracking-tight">Give your agent a computer</h2>
          <p className="text-base text-white/55">Join early access and wake your first desktop today.</p>
          <CopyCommand />
          <div className="flex items-center gap-3 pt-1">
            <Button variant="outline" href="https://github.com/descanto">Read docs</Button>
            <Button href="mailto:hello@descanto.com?subject=Canto%20early%20access">Join early access</Button>
          </div>
        </div>
      </section>
    </>
  );
}
