import { useState, type FormEvent } from "react";

type Status = "idle" | "sending" | "sent" | "error";

const inputCls =
  "w-full rounded-xl border border-strong bg-elevated px-4 py-3 text-[15px] text-ink placeholder:text-faint focus:border-ink focus:outline-none";

export function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form)) as Record<string, string>;
    setStatus("sending");
    setError("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const body = (await res.json().catch(() => null)) as { error?: string } | null;
        throw new Error(body?.error ?? "Something went wrong");
      }
      setStatus("sent");
      form.reset();
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Something went wrong");
    }
  }

  if (status === "sent") {
    return (
      <div className="flex flex-col gap-2 rounded-2xl border border-hairline bg-surface p-8">
        <h3 className="font-display text-lg font-bold tracking-tight">Message sent</h3>
        <p className="text-sm text-graphite">Thanks — we read everything and reply fast during early access.</p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="flex w-full flex-col gap-4">
      <div className="grid grid-cols-2 gap-4 max-md:grid-cols-1">
        <input name="name" required placeholder="Your name" autoComplete="name" className={inputCls} />
        <input name="email" required type="email" placeholder="you@company.com" autoComplete="email" className={inputCls} />
      </div>
      {/* Honeypot — hidden from humans, dropped server-side when filled */}
      <input name="company" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />
      <textarea
        name="message"
        required
        maxLength={5000}
        rows={5}
        placeholder="What are you building? How many desktops do you need?"
        className={`${inputCls} resize-y`}
      />
      <div className="flex items-center gap-4">
        <button
          type="submit"
          disabled={status === "sending"}
          className="cursor-pointer rounded-full bg-ink px-6 py-3 text-[15px] font-medium text-on-ink hover:bg-ink/90 disabled:opacity-60"
        >
          {status === "sending" ? "Sending…" : "Send message"}
        </button>
        {status === "error" && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}
      </div>
    </form>
  );
}
