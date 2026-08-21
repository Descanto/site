import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Mark } from "./mark";
import { cn } from "@/lib/utils";
import { useTheme, type Theme } from "@/lib/theme";

function ThemeToggle() {
  const [theme, setTheme] = useTheme();
  const next: Record<Theme, Theme> = { system: "dark", dark: "light", light: "system" };
  const label = theme === "system" ? "System theme" : theme === "dark" ? "Dark theme" : "Light theme";
  return (
    <button
      type="button"
      aria-label={`${label} — click to switch`}
      title={label}
      onClick={() => setTheme(next[theme])}
      className="flex size-9 cursor-pointer items-center justify-center rounded-full text-graphite hover:text-ink"
    >
      {theme === "system" ? (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4">
          <circle cx="8" cy="8" r="6.3" />
          <path d="M8 1.7v12.6A6.3 6.3 0 0 0 8 1.7Z" fill="currentColor" stroke="none" />
        </svg>
      ) : theme === "dark" ? (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
          <path d="M13.7 9.6A6 6 0 0 1 6.4 2.3a6 6 0 1 0 7.3 7.3Z" />
        </svg>
      ) : (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round">
          <circle cx="8" cy="8" r="3.2" />
          <path d="M8 1.2v1.6M8 13.2v1.6M1.2 8h1.6M13.2 8h1.6M3.2 3.2l1.1 1.1M11.7 11.7l1.1 1.1M3.2 12.8l1.1-1.1M11.7 4.3l1.1-1.1" />
        </svg>
      )}
    </button>
  );
}

function Chevron({ open }: { open?: boolean }) {
  return (
    <svg width="10" height="6" viewBox="0 0 10 6" className={cn("transition-transform", open && "rotate-180")}>
      <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" />
    </svg>
  );
}

interface MenuEntry {
  to: string;
  title: string;
  description: string;
}

function DropdownPanel({ primary, secondary }: { primary: MenuEntry[]; secondary: MenuEntry[] }) {
  return (
    <div className="absolute left-0 top-full pt-2 w-90 z-50">
      <motion.div
        className="origin-top-left rounded-2xl border border-hairline bg-elevated p-2 shadow-2xl shadow-black/10 dark:shadow-black/50"
        initial={{ opacity: 0, y: -6, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -6, scale: 0.98 }}
        transition={{ duration: 0.18, ease: "easeOut" }}
      >
        {primary.map((e) =>
          e.to.startsWith("http") ? (
            <a key={e.title} href={e.to} className="block rounded-xl px-4 py-3.5 hover:bg-wash">
              <div className="text-[16px] font-medium text-ink">{e.title}</div>
              <div className="mt-0.5 text-[13.5px] leading-5 text-graphite">{e.description}</div>
            </a>
          ) : (
            <Link key={e.title} to={e.to} className="block rounded-xl px-4 py-3.5 hover:bg-wash">
              <div className="text-[16px] font-medium text-ink">{e.title}</div>
              <div className="mt-0.5 text-[13.5px] leading-5 text-graphite">{e.description}</div>
            </Link>
          ),
        )}
        {secondary.length > 0 && (
          <div className="mt-1 border-t border-hairline px-4 pt-2 pb-1">
            {secondary.map((e) => (
              <a key={e.title} href={e.to} className="flex items-center justify-between py-1.5 text-sm text-graphite hover:text-ink">
                {e.title}
                <span className="text-faint">↗</span>
              </a>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}

const developer: MenuEntry[] = [
  { to: "https://docs.descanto.com", title: "Docs", description: "Quickstart, concepts, and the full API reference." },
  { to: "https://docs.descanto.com/sdk/typescript", title: "TypeScript SDK", description: "@descanto/vm-sdk — the ergonomic client." },
  { to: "https://docs.descanto.com/mcp", title: "MCP server", description: "Drive desktops from Claude Code, Cursor, or any MCP client." },
];
const developerSecondary: MenuEntry[] = [
  { to: "https://github.com/descanto", title: "GitHub", description: "" },
  { to: "https://github.com/descanto", title: "Changelog", description: "" },
  { to: "https://github.com/descanto", title: "Status", description: "" },
];
const company: MenuEntry[] = [
  { to: "/about", title: "About", description: "What Descanto is building, and why." },
  { to: "/news", title: "News", description: "Launches, releases, and engineering notes." },
  { to: "/contact", title: "Contact", description: "hello@descanto.com — the repo is the front door." },
];

function NavDropdown({ label, primary, secondary = [] }: { label: string; primary: MenuEntry[]; secondary?: MenuEntry[] }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative" onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
      <button className="flex items-center gap-1.5 py-2 text-[15px] text-ink hover:text-ink cursor-pointer">
        {label}
        <span className="text-graphite">
          <Chevron open={open} />
        </span>
      </button>
      <AnimatePresence>{open && <DropdownPanel primary={primary} secondary={secondary} />}</AnimatePresence>
    </div>
  );
}

const mobileLinks: { label: string; to: string }[] = [
  { label: "Pricing", to: "/pricing" },
  { label: "Docs", to: "https://docs.descanto.com" },
  { label: "News", to: "/news" },
  { label: "About", to: "/about" },
  { label: "GitHub", to: "https://github.com/descanto" },
];

function MobileMenu({ onClose }: { onClose: () => void }) {
  return (
    <motion.div
      className="absolute inset-x-0 top-full z-50 flex h-[calc(100dvh-4.5rem)] flex-col overflow-y-auto bg-ground px-8 pb-10 md:hidden"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.18, ease: "easeOut" }}
    >
      <div className="flex flex-col">
        {mobileLinks.map((l) =>
          l.to.startsWith("http") ? (
            <a key={l.label} href={l.to} className="border-b border-hairline py-4.5 font-display text-2xl font-bold" onClick={onClose}>
              {l.label}
            </a>
          ) : (
            <Link key={l.label} to={l.to} className="border-b border-hairline py-4.5 font-display text-2xl font-bold" onClick={onClose}>
              {l.label}
            </Link>
          ),
        )}
      </div>
      <div className="mt-auto flex flex-col gap-3 pt-10">
        <a
          href="/early-access"
          className="rounded-full bg-ink py-3.5 text-center text-[15px] font-medium text-on-ink"
          onClick={onClose}
        >
          Request access
        </a>
        <a href="mailto:hello@descanto.com" className="rounded-full border border-strong py-3.5 text-center text-[15px] font-medium" onClick={onClose}>
          Contact sales
        </a>
      </div>
    </motion.div>
  );
}

export function Nav() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  useEffect(() => setMobileOpen(false), [location.pathname]);
  return (
    <header className="sticky top-0 z-40 bg-ground/90 backdrop-blur">
      <nav className="mx-auto flex h-18 max-w-[1440px] items-center gap-10 px-8 max-md:gap-4 max-md:px-5">
        <Link to="/" className="flex shrink-0 items-center gap-2.5">
          <Mark size={24} />
          <span className="font-display text-lg font-bold tracking-tight">descanto</span>
        </Link>
        <div className="flex flex-1 items-center gap-8 max-md:hidden">
          <NavDropdown label="Developer" primary={developer} secondary={developerSecondary} />
          <NavDropdown label="Company" primary={company} />
          <NavLink to="/pricing" className="text-[15px] text-ink hover:text-ink">
            Pricing
          </NavLink>
          <a href="https://docs.descanto.com" className="text-[15px] text-ink hover:text-ink">
            Docs
          </a>
          <NavLink to="/news" className="text-[15px] text-ink hover:text-ink">
            News
          </NavLink>
        </div>
        <div className="ml-auto flex shrink-0 items-center gap-3">
          <ThemeToggle />
          <a href="mailto:hello@descanto.com" className="rounded-full border border-strong px-5 py-2.5 text-[15px] font-medium max-md:hidden">
            Contact sales
          </a>
          <a
            href="/early-access"
            className="flex items-stretch overflow-hidden rounded-full bg-ink text-on-ink"
          >
            <span className="px-5 py-2.5 text-[15px] font-medium max-md:px-4.5 max-md:text-sm">Request access</span>
          </a>
          <button
            type="button"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            className="hidden size-10 cursor-pointer flex-col items-center justify-center gap-1.5 max-md:flex"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setMobileOpen((v) => !v);
            }}
          >
            <motion.span className="h-0.5 w-5.5 rounded-full bg-ink" animate={mobileOpen ? { rotate: 45, y: 4 } : { rotate: 0, y: 0 }} />
            <motion.span className="h-0.5 w-5.5 rounded-full bg-ink" animate={mobileOpen ? { rotate: -45, y: -4 } : { rotate: 0, y: 0 }} />
          </button>
        </div>
      </nav>
      <AnimatePresence>{mobileOpen && <MobileMenu onClose={() => setMobileOpen(false)} />}</AnimatePresence>
    </header>
  );
}
