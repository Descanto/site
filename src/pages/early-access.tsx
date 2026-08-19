import { useState, type FormEvent } from "react";
import { useSearchParams } from "react-router-dom";

type Status = "idle" | "sending" | "sent" | "error";

const inputCls =
  "w-full rounded-xl border border-strong bg-elevated px-4 py-3 text-[15px] text-ink placeholder:text-faint focus:border-ink focus:outline-none";

const tiers = [
  { value: "small", label: "Small — 2 vCPU · 4 GB" },
  { value: "default", label: "Default — 4 vCPU · 8 GB" },
  { value: "large", label: "Large — 8 vCPU · 16 GB" },
  { value: "unsure", label: "Not sure yet" },
] as const;

export function EarlyAccessPage() {
  const [params] = useSearchParams();
  const preselect = params.get("tier") ?? "default";
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget)) as Record<string, string>;
    setStatus("sending");
    setError("");
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const body = (await res.json().catch(() => null)) as { error?: string } | null;
        throw new Error(body?.error ?? "Something went wrong");
      }
      setStatus("sent");
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Something went wrong");
    }
  }

  return (
    <section className="mx-auto flex max-w-160 flex-col gap-8 px-8 pt-20 pb-24">
      <div className="flex flex-col gap-4">
        <span className="text-xs font-semibold tracking-widest text-faint">EARLY ACCESS</span>
        <h1 className="font-display text-[clamp(34px,4vw,52px)] font-bold leading-[1.12] tracking-[-0.025em]">
          Request access to Canto
        </h1>
        <p className="text-[16px] leading-relaxed text-graphite">
          Desktops are manually provisioned this milestone, so we onboard in small batches. Tell us what you're building
          and we'll get you an API key as capacity opens up.
        </p>
      </div>

      {status === "sent" ? (
        <div className="flex flex-col gap-2 rounded-2xl border border-hairline bg-surface p-8">
          <h2 className="font-display text-lg font-bold tracking-tight">You're on the list</h2>
          <p className="text-sm leading-relaxed text-graphite">
            We'll email you when your desktops are ready — usually within a few days during early access.
          </p>
        </div>
      ) : (
        <form onSubmit={onSubmit} className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-4 max-md:grid-cols-1">
            <input name="name" placeholder="Your name" autoComplete="name" className={inputCls} />
            <input name="email" required type="email" placeholder="you@company.com" autoComplete="email" className={inputCls} />
          </div>
          {/* Honeypot — hidden from humans, dropped server-side when filled */}
          <input name="company" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />
          <select name="tier" defaultValue={tiers.some((t) => t.value === preselect) ? preselect : "default"} className={inputCls}>
            {tiers.map((t) => (
              <option key={t.value} value={t.value}>{t.label}</option>
            ))}
          </select>
          <textarea
            name="useCase"
            rows={4}
            maxLength={2000}
            placeholder="What will your agents do with their desktops? (optional, but it moves you up the list)"
            className={`${inputCls} resize-y`}
          />
          <div className="flex items-center gap-4">
            <button
              type="submit"
              disabled={status === "sending"}
              className="cursor-pointer rounded-full bg-ink px-6 py-3 text-[15px] font-medium text-on-ink hover:bg-ink/90 disabled:opacity-60"
            >
              {status === "sending" ? "Requesting…" : "Request access"}
            </button>
            {status === "error" && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}
          </div>
        </form>
      )}
    </section>
  );
}
