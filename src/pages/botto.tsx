import { Button } from "@/components/ui/button";
import { Mascot } from "@/components/mascot";
import { Reveal, Stagger, StaggerItem } from "@/components/motion";

const featureCards = [
  ["Every Bot has its own computer", "A persistent cloud desktop per Bot. It browses, clicks, and runs real software — never touching your machine. Watch it work, take over anytime."],
  ["Jobs and routines", "Each Bot owns a standing job with schedules and triggers. Work happens while you're away — with a plain-language preview of when and what."],
  ["The transcript is the audit log", "Every tool call, approval, and memory change is a durable event in the chat. Nothing happens off the record."],
  ["Your subscription, your keys", "Bots think with the AI subscription you already pay for. Credentials never leave your device — the cloud calls back to you."],
];

const jobs = ["Inbox Manager", "Release Notes", "Talent Scout", "Bug Reproduction", "Account Health", "Paid Media", "Chief of Staff"];

const sidebarBots = [
  { name: "Release Notes", status: "Working — drafting v2.3", accent: true, meta: "now" },
  { name: "Inbox Manager", status: "5 drafts parked for you", badge: "5" },
  { name: "Talent Scout", status: "3 intros drafted in your voice", meta: "2h" },
  { name: "Account Health", status: "Weekly report ready Friday", meta: "1d" },
];

export function BottoPage() {
  return (
    <>
      {/* Hero */}
      <Stagger className="flex flex-col items-center gap-5.5 px-10 pt-16 pb-12 text-center">
        <StaggerItem>
          <div className="flex items-center gap-2.5 rounded-full border border-white/14 bg-white/4 py-1.5 pl-1.5 pr-3.5 text-[13px]">
            <span className="rounded-full bg-white px-2.5 py-0.5 text-[11px] font-semibold tracking-wider text-ground">FREE</span>
            <span className="font-medium text-white/88">Botto is open source — read the launch post</span>
            <span className="text-white/45">→</span>
          </div>
        </StaggerItem>
        <StaggerItem>
          <h1 className="flex items-center gap-5 font-display text-[clamp(44px,5.3vw,76px)] font-medium tracking-[-0.03em]">
            Meet <Mascot size={58} /> Botto
          </h1>
        </StaggerItem>
        <StaggerItem>
          <p className="max-w-160 text-[17px] leading-relaxed text-white/60">
            AI teammates you can give real work to. Bots run on your machine and your accounts — hand off a task, close the
            lid, come back to finished work.
          </p>
        </StaggerItem>
        <StaggerItem>
          <div className="flex items-center gap-3 pt-1">
            <Button href="https://botto.descanto.com"> Download for macOS</Button>
            <Button variant="outline" href="https://github.com/descanto">View on GitHub</Button>
          </div>
        </StaggerItem>
      </Stagger>

      {/* App window */}
      <section className="mx-auto max-w-[1200px] px-10 pb-22 max-md:px-4">
        <Reveal>
        <div className="overflow-hidden rounded-2xl border border-white/10 bg-surface">
          <div className="flex gap-1.5 border-b border-white/8 px-4.5 py-3.5">
            {[0, 1, 2].map((i) => (
              <span key={i} className="size-2.75 rounded-full bg-white/16" />
            ))}
          </div>
          <div className="flex h-130 max-md:h-auto max-md:flex-col">
            <aside className="flex w-70 shrink-0 flex-col gap-1 border-r border-white/8 p-3 max-md:w-full max-md:border-r-0 max-md:border-b">
              {sidebarBots.map((bot) => (
                <div key={bot.name} className={`flex items-center gap-3 rounded-xl px-3 py-2.75 ${bot.accent ? "bg-white/7" : ""}`}>
                  <Mascot size={34} className={bot.accent ? "" : "opacity-70"} />
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-[13.5px] font-medium">{bot.name}</div>
                    <div className={`truncate text-xs ${bot.accent ? "text-accent-light" : "text-white/45"}`}>{bot.status}</div>
                  </div>
                  {bot.badge ? (
                    <span className="flex size-4.5 items-center justify-center rounded-full bg-accent text-[10px] font-semibold">{bot.badge}</span>
                  ) : (
                    <span className="text-[11px] text-white/35">{bot.meta}</span>
                  )}
                </div>
              ))}
            </aside>
            <div className="flex min-w-0 flex-1 flex-col">
              <div className="flex items-center justify-between border-b border-white/8 px-5.5 py-3.5">
                <div>
                  <div className="text-sm font-semibold">Release Notes</div>
                  <div className="text-xs text-accent-light">Working — on its own computer</div>
                </div>
                <span className="rounded-full border border-white/18 px-3.5 py-1.75 text-[12.5px] font-medium">Watch desktop</span>
              </div>
              <div className="flex flex-1 flex-col gap-3 p-5.5">
                <div className="max-w-110 self-end rounded-2xl rounded-br-sm bg-white px-4 py-2.5 text-[13.5px] leading-5 text-ground">
                  v2.3 ships tomorrow — draft the changelog from the merged PRs?
                </div>
                <div className="max-w-120 self-start rounded-2xl rounded-bl-sm bg-white/7 px-4 py-2.5 text-[13.5px] leading-5 text-white/88">
                  On it. Reading 24 merged PRs since v2.2 — I'll group by feature, fix, and breaking change, in your usual tone.
                </div>
                <div className="flex items-center gap-2 self-start rounded-xl border border-white/12 px-3.5 py-2">
                  <span className="size-2 rounded-full bg-ok" />
                  <code className="font-mono text-xs text-white/75">gh pr list --state merged</code>
                  <span className="text-xs text-white/40">ran on Bot's computer</span>
                </div>
                <div className="flex items-center gap-2.5 self-start pt-1">
                  <Mascot size={26} />
                  <span className="text-[13px] text-white/45">Drafting…</span>
                </div>
              </div>
              <div className="flex items-center gap-3 border-t border-white/8 px-5.5 py-3.5">
                <span className="flex-1 text-[13.5px] text-white/35">Message Release Notes</span>
                <span className="flex size-8 items-center justify-center rounded-full bg-accent">↑</span>
              </div>
            </div>
          </div>
        </div>
        </Reveal>
      </section>

      {/* Teammates band */}
      <section className="hairline-t bg-surface">
        <div className="mx-auto flex max-w-[1440px] items-center gap-16 px-20 py-18 max-lg:flex-col max-lg:px-8">
          <div className="flex flex-1 flex-col gap-3.5">
            <h2 className="font-display text-[40px] font-medium leading-12 tracking-tight">Message Bots like teammates</h2>
            <p className="max-w-130 text-base leading-relaxed text-white/60">
              Give tasks to Bots like you would a teammate. They take projects from start to end, keep context on how you
              work, and come back when your approval is needed.
            </p>
          </div>
          <Mascot size={180} className="shrink-0" />
        </div>
      </section>

      {/* Feature cards */}
      <section className="mx-auto flex max-w-[1440px] flex-col gap-8 px-20 py-22 max-lg:px-8">
        <div className="flex flex-col items-center gap-3 text-center">
          <h2 className="font-display text-4xl font-medium tracking-tight">Work with many Bots at once</h2>
          <p className="max-w-140 text-[15px] leading-relaxed text-white/55">
            Create a Bot, give it a job, and add another when the work grows — one on a project, one on your inbox, one on
            systems. They work in parallel, 24/7.
          </p>
        </div>
        <div className="grid grid-cols-4 gap-5 max-lg:grid-cols-2 max-sm:grid-cols-1">
          {featureCards.map(([title, body]) => (
            <div key={title} className="flex flex-col gap-2.5 rounded-2xl border border-white/10 bg-surface p-7">
              <h3 className="text-base font-semibold">{title}</h3>
              <p className="text-sm leading-relaxed text-white/55">{body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Jobs */}
      <section id="plugins" className="hairline-t">
        <div className="mx-auto flex max-w-[1440px] flex-col gap-6 px-20 py-22 max-lg:px-8">
          <h2 className="font-display text-4xl font-medium tracking-tight">Give each Bot a job</h2>
          <div className="flex flex-wrap gap-2.5">
            {jobs.map((job, i) => (
              <span
                key={job}
                className={
                  i === 0
                    ? "flex items-center gap-2 rounded-full bg-white px-4.5 py-2.25 text-sm font-medium text-ground"
                    : "rounded-full border border-white/18 px-4.5 py-2.25 text-sm text-white/80"
                }
              >
                {i === 0 && <span className="size-2 rounded-full bg-ok" />}
                {job}
              </span>
            ))}
          </div>
          <p className="max-w-140 text-[15px] leading-relaxed text-white/55">
            Clears overnight: archives noise, replies in your voice, and leaves a morning summary with anything that needs
            you parked for approval.
          </p>
        </div>
      </section>

      {/* Closer */}
      <section className="hairline-t">
        <div className="flex flex-col items-center gap-5 px-20 py-26 text-center max-lg:px-8">
          <h2 className="font-display text-5xl font-medium tracking-tight">Meet your first Bot</h2>
          <p className="text-base text-white/55">An AI teammate you can trust to get work done.</p>
          <div className="flex items-center gap-3 pt-1">
            <Button href="https://botto.descanto.com">Download for macOS</Button>
            <Button variant="outline" href="https://github.com/descanto">View on GitHub</Button>
          </div>
        </div>
      </section>
    </>
  );
}
