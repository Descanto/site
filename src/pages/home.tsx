import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Mascot } from "@/components/mascot";
import { Reveal, Stagger, StaggerItem } from "@/components/motion";

function Terminal({ title, children }: { title: string; children: string }) {
  return (
    <div className="flex flex-col overflow-hidden rounded-xl border border-white/10 bg-[#181C24]">
      <div className="flex items-center justify-between border-b border-white/8 px-4 py-3">
        <div className="flex gap-1.5">
          {[0, 1, 2].map((i) => (
            <span key={i} className="size-2.5 rounded-full bg-white/18" />
          ))}
        </div>
        <span className="font-mono text-[11px] text-white/45">{title}</span>
      </div>
      <pre className="overflow-x-auto p-4.5 font-mono text-[12.5px] leading-[21px] text-white/78">{children}</pre>
    </div>
  );
}

export function HomePage() {
  const reduced = useReducedMotion();
  return (
    <>
      {/* Hero */}
      <Stagger className="flex flex-col items-center gap-6 px-10 pt-22 pb-16 text-center">
        <StaggerItem>
          <Link
            to="/canto"
            className="flex items-center gap-2.5 rounded-full border border-white/14 bg-white/4 py-1.5 pl-1.5 pr-3 text-[13px]"
          >
            <span className="rounded-full bg-white px-2.5 py-0.5 text-[11px] font-semibold tracking-wider text-ground">NEW</span>
            <span className="font-medium text-white/88">Canto early access — persistent computers for agents</span>
            <span className="text-white/45">→</span>
          </Link>
        </StaggerItem>
        <StaggerItem>
          <h1 className="font-display text-[clamp(40px,5vw,72px)] font-medium leading-[1.08] tracking-[-0.03em]">
            Agents that work like people.
            <br />
            <span className="text-white/45">Computers built for agents.</span>
          </h1>
        </StaggerItem>
        <motion.div
          className="h-0.5 w-75 origin-left rounded-full bg-gradient-to-r from-[#4D7CFE] via-[#B85CF0] to-[#F0885C]"
          initial={reduced ? false : { scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ delay: 0.45, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        />
        <StaggerItem>
          <p className="max-w-155 text-[17px] leading-relaxed text-white/60">
            Descanto builds Botto, your own team of AI teammates, and Canto, the instant-wake cloud desktops they work on.
          </p>
        </StaggerItem>
        <StaggerItem>
          <div className="flex items-center gap-3 pt-1.5">
            <Button href="https://botto.descanto.com">Download Botto →</Button>
            <Button variant="outline" href="/canto">Join the Canto waitlist</Button>
          </div>
        </StaggerItem>
      </Stagger>

      {/* Product mosaic */}
      <Reveal>
      <section className="mx-auto grid max-w-[1440px] grid-cols-2 px-10 pb-18 max-lg:grid-cols-1 max-lg:gap-4 max-lg:px-6">
        <Link
          to="/botto"
          className="group flex flex-col gap-4 rounded-l-2xl border border-white/10 bg-surface p-7 max-lg:rounded-2xl"
        >
          <div className="flex items-start justify-between">
            <div>
              <h2 className="font-display text-2xl font-semibold tracking-tight">Botto</h2>
              <p className="mt-1.5 max-w-85 text-sm leading-relaxed text-white/62">
                Your Bots, one quiet place. AI teammates with jobs and memory — on your machine, your accounts.
              </p>
            </div>
            <span className="text-[13px] font-medium group-hover:underline">Explore →</span>
          </div>
          <div className="mt-auto flex flex-col gap-2.5 rounded-xl border border-white/10 bg-elevated p-4">
            <div className="flex items-center gap-2.5">
              <Mascot size={26} />
              <div>
                <div className="text-[13px] font-semibold">Inbox Manager</div>
                <div className="text-[11px] text-accent-light">Working — drafting replies</div>
              </div>
            </div>
            <div className="self-end rounded-2xl rounded-br-sm bg-white px-3.5 py-2 text-[13px] text-ground">
              Clear my inbox before Monday — park anything that needs me.
            </div>
            <div className="self-start rounded-2xl rounded-bl-sm bg-white/7 px-3.5 py-2 text-[13px] text-white/88">
              Done — 31 archived, 6 replied in your voice. 5 drafts parked for your approval.
            </div>
          </div>
        </Link>
        <Link
          to="/canto"
          className="group flex flex-col gap-4 rounded-r-2xl border border-l-0 border-white/10 bg-[#101319] p-7 max-lg:rounded-2xl max-lg:border-l"
        >
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2.5">
                <h2 className="font-display text-2xl font-semibold tracking-tight">Canto</h2>
                <span className="rounded-full border border-white/22 px-2.5 py-0.5 text-[11px] font-semibold tracking-wider text-white/75">
                  EARLY ACCESS
                </span>
              </div>
              <p className="mt-1.5 max-w-85 text-sm leading-relaxed text-white/62">
                Persistent cloud computers for AI agents. Instant wake — tabs, processes, and logins survive hibernation.
              </p>
            </div>
            <span className="text-[13px] font-medium group-hover:underline">Explore →</span>
          </div>
          <div className="mt-auto">
            <Terminal title="desktop: release-bot · awake">{`$ canto wake release-bot
woke in 0.5s — 14 tabs, 3 processes, logins intact

$ canto fork release-bot --count 20
20 forks in 4.5s · ~1.4 MB marginal RAM each`}</Terminal>
          </div>
        </Link>
      </section>
      </Reveal>

      {/* Developer split */}
      <section className="hairline-t">
        <Reveal className="mx-auto flex max-w-[1440px] items-center gap-20 px-20 py-24 max-lg:flex-col max-lg:gap-10 max-lg:px-8">
          <div className="flex w-120 shrink-0 flex-col gap-4 max-lg:w-auto">
            <span className="text-xs font-semibold tracking-widest text-white/40">FOR DEVELOPERS</span>
            <h2 className="font-display text-[40px] font-medium leading-12 tracking-tight">
              Every agent
              <br />
              <span className="text-white/45">needs a computer.</span>
            </h2>
            <p className="text-[15px] leading-relaxed text-white/60">
              Give any agent a persistent desktop through one API. Wake in under a second, fork it twenty ways, hand the
              mouse to a human when it gets stuck. Botto is customer zero.
            </p>
            <div className="flex gap-3 pt-2">
              <Button size="sm" href="/canto">Get early access</Button>
              <Button size="sm" variant="outline" href="https://github.com/descanto">Read docs</Button>
            </div>
          </div>
          <div className="min-w-0 flex-1">
            <Terminal title="python · canto-sdk">{`from canto import Client

canto = Client()
desktop = canto.desktops.wake("release-bot")

desktop.run("gh pr checkout 412")
fork = desktop.fork(ttl="1h")

stream = desktop.stream()   # watch it work
stream.take_over()          # grab the mouse`}</Terminal>
          </div>
        </Reveal>
      </section>

      {/* Stats band */}
      <section className="hairline-t">
        <div className="mx-auto grid max-w-[1440px] grid-cols-3 px-20 py-22 max-md:grid-cols-1 max-md:gap-10 max-md:px-8">
          {[
            ["0.5s", "warm wake, live state intact"],
            ["20×", "forks from one desktop, ~225ms each"],
            ["0", "credentials that ever leave your machine"],
          ].map(([stat, label], i) => (
            <div key={stat} className={i > 0 ? "border-l border-white/10 max-md:border-l-0" : ""}>
              <Reveal delay={i * 0.12} className="flex flex-col items-center gap-2.5">
                <span className="font-display text-[64px] font-medium tracking-tight">{stat}</span>
                <span className="text-[13px] text-white/50">{label}</span>
              </Reveal>
            </div>
          ))}
        </div>
      </section>

      {/* Principles */}
      <section className="hairline-t">
        <Reveal className="mx-auto flex max-w-[1440px] flex-col gap-8 px-20 py-24 max-lg:px-8">
          <div className="flex items-baseline justify-between">
            <h2 className="font-display text-[32px] font-medium tracking-tight">How we build</h2>
            <a href="https://github.com/descanto" className="text-[13px] font-medium text-white/55 hover:text-white">
              Read the docs →
            </a>
          </div>
          <div className="grid grid-cols-3 overflow-hidden rounded-2xl border border-white/10 max-md:grid-cols-1">
            {[
              ["local-first", "Your accounts stay yours", "Bots run against your existing AI subscriptions. No API keys to buy, no credentials copied to the cloud, and everything works without an account."],
              ["honest-metering", "Our slowness never bills you", "Canto meters only while your desktop responds. Cold starts, snapshots, and uploads are on us — and overage is opt-in, never a surprise."],
              ["open-source", "Fork the whole thing", "Botto is MIT-licensed, daemon to desktop. Self-host every piece, or bring your own infrastructure and skip ours entirely."],
            ].map(([tag, title, body], i) => (
              <div key={tag} className={`flex flex-col gap-3 p-7 ${i > 0 ? "border-l border-white/10 max-md:border-l-0 max-md:border-t" : ""}`}>
                <span className="font-mono text-xs font-medium text-white/45">{tag}</span>
                <h3 className="font-display text-[19px] font-semibold tracking-tight">{title}</h3>
                <p className="text-sm leading-relaxed text-white/55">{body}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      {/* Closer */}
      <section className="hairline-t">
        <Reveal className="mx-auto flex max-w-[1440px] flex-col items-center gap-10 px-20 py-24 max-lg:px-8">
          <div className="flex flex-col items-center gap-3.5">
            <Mascot size={56} />
            <h2 className="font-display text-4xl font-medium tracking-tight">Choose how to start</h2>
          </div>
          <div className="grid w-full grid-cols-2 gap-6 max-md:grid-cols-1">
            <div className="flex flex-col gap-4.5 rounded-2xl bg-surface p-9">
              <h3 className="font-display text-[22px] font-semibold tracking-tight">Hire your first Bot</h3>
              <p className="text-sm text-white/55">Download Botto for macOS and hand off your first task in minutes:</p>
              <ul className="flex flex-col gap-2.5">
                {["Works with your existing AI subscription", "Every Bot gets its own cloud computer", "Jobs and routines run while you're away", "Reach your Bots from anywhere"].map((f) => (
                  <li key={f} className="flex items-center gap-2.5 text-sm text-white/85">
                    <span className="text-ok">✓</span> {f}
                  </li>
                ))}
              </ul>
              <div className="pt-2">
                <Button size="sm" href="https://botto.descanto.com">Download for macOS</Button>
              </div>
            </div>
            <div className="flex flex-col gap-4.5 rounded-2xl border border-white/10 p-9">
              <h3 className="font-display text-[22px] font-semibold tracking-tight">Give your agents desktops</h3>
              <p className="text-sm text-white/55">Build on Canto's API for persistent, forkable machines:</p>
              <ul className="flex flex-col gap-2.5">
                {["Wake in under a second, state intact", "Fork for parallel runs, promote keepers", "Watch every session, take over anytime", "MicroVM isolation on every desktop"].map((f) => (
                  <li key={f} className="flex items-center gap-2.5 text-sm text-white/85">
                    <span className="text-ok">✓</span> {f}
                  </li>
                ))}
              </ul>
              <div className="pt-2">
                <Button size="sm" variant="outline" href="/canto">Join the waitlist</Button>
              </div>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  );
}
