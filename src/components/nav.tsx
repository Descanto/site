import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Mascot } from "./mascot";
import { cn } from "@/lib/utils";

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
        className="origin-top-left rounded-2xl bg-[#141416] p-2 shadow-2xl shadow-black/50"
        initial={{ opacity: 0, y: -6, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -6, scale: 0.98 }}
        transition={{ duration: 0.18, ease: "easeOut" }}
      >
        {primary.map((e) => (
          <Link key={e.title} to={e.to} className="block rounded-xl px-4 py-3.5 hover:bg-white/6">
            <div className="text-[16px] font-medium text-white">{e.title}</div>
            <div className="mt-0.5 text-[13.5px] leading-5 text-white/55">{e.description}</div>
          </Link>
        ))}
        {secondary.length > 0 && (
          <div className="mt-1 border-t border-white/8 px-4 pt-2 pb-1">
            {secondary.map((e) => (
              <Link key={e.title} to={e.to} className="flex items-center justify-between py-1.5 text-sm text-white/65 hover:text-white">
                {e.title}
                <span className="text-white/30">↗</span>
              </Link>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}

const products: MenuEntry[] = [
  { to: "/botto", title: "Botto", description: "A team of AI teammates with their own computers." },
  { to: "/canto", title: "Canto", description: "Persistent cloud desktops with instant wake." },
];
const productsSecondary: MenuEntry[] = [
  { to: "https://botto.descanto.com", title: "Botto on the web", description: "" },
  { to: "/canto#api", title: "Canto API docs", description: "" },
];
const developer: MenuEntry[] = [
  { to: "https://github.com/descanto", title: "Documentation", description: "Set up Botto, self-host, and build on the Canto API." },
  { to: "https://github.com/descanto", title: "GitHub", description: "Botto is MIT-licensed — star, fork, or contribute." },
  { to: "/plugins", title: "Plugin marketplace", description: "Browse plugins for every Bot, or build and list your own." },
];
const developerSecondary: MenuEntry[] = [
  { to: "https://github.com/descanto", title: "Changelog", description: "" },
  { to: "https://github.com/descanto", title: "Status", description: "" },
  { to: "https://github.com/descanto", title: "Security", description: "" },
];
const company: MenuEntry[] = [
  { to: "/about", title: "About", description: "What Descanto is building, and why." },
  { to: "/news", title: "News", description: "Launches, releases, and engineering notes." },
  { to: "/about#contact", title: "Contact", description: "hello@descanto.com — the repo is the front door." },
];

function NavDropdown({ label, primary, secondary = [] }: { label: string; primary: MenuEntry[]; secondary?: MenuEntry[] }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative" onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
      <button className="flex items-center gap-1.5 py-2 text-[15px] text-white/85 hover:text-white cursor-pointer">
        {label}
        <span className="text-white/55">
          <Chevron open={open} />
        </span>
      </button>
      <AnimatePresence>{open && <DropdownPanel primary={primary} secondary={secondary} />}</AnimatePresence>
    </div>
  );
}

const mobileLinks: { label: string; to: string }[] = [
  { label: "Botto", to: "/botto" },
  { label: "Canto", to: "/canto" },
  { label: "Pricing", to: "/canto/pricing" },
  { label: "News", to: "/news" },
  { label: "About", to: "/about" },
  { label: "Open source", to: "https://github.com/descanto" },
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
            <a key={l.label} href={l.to} className="border-b border-white/8 py-4.5 font-display text-2xl font-medium" onClick={onClose}>
              {l.label}
            </a>
          ) : (
            <Link key={l.label} to={l.to} className="border-b border-white/8 py-4.5 font-display text-2xl font-medium" onClick={onClose}>
              {l.label}
            </Link>
          ),
        )}
      </div>
      <div className="mt-auto flex flex-col gap-3 pt-10">
        <a href="https://botto.descanto.com" className="rounded-full bg-white py-3.5 text-center text-[15px] font-medium text-ground" onClick={onClose}>
          Download Botto
        </a>
        <a href="mailto:hello@descanto.com" className="rounded-full border border-white/28 py-3.5 text-center text-[15px] font-medium" onClick={onClose}>
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
          <Mascot size={24} />
          <span className="font-display text-lg font-semibold tracking-tight">descanto</span>
        </Link>
        <div className="flex flex-1 items-center gap-8 max-md:hidden">
          <NavDropdown label="Products" primary={products} secondary={productsSecondary} />
          <NavDropdown label="Developer" primary={developer} secondary={developerSecondary} />
          <NavDropdown label="Company" primary={company} />
          <a href="https://github.com/descanto" className="text-[15px] text-white/85 hover:text-white">
            Open source
          </a>
          <NavLink to="/news" className="text-[15px] text-white/85 hover:text-white">
            News
          </NavLink>
        </div>
        <div className="ml-auto flex shrink-0 items-center gap-3">
          <a href="mailto:hello@descanto.com" className="rounded-full border border-white/28 px-5 py-2.5 text-[15px] font-medium max-md:hidden">
            Contact sales
          </a>
          <a href="https://botto.descanto.com" className="flex items-stretch overflow-hidden rounded-full bg-white text-ground">
            <span className="py-2.5 pl-5 pr-2 text-[15px] font-medium max-md:px-4.5 max-md:text-sm">Download Botto</span>
            <span className="my-2 w-px bg-ground/15 max-md:hidden" />
            <span className="flex items-center py-2.5 pl-2.5 pr-3.5 max-md:hidden">
              <Chevron />
            </span>
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
            <motion.span className="h-0.5 w-5.5 rounded-full bg-white" animate={mobileOpen ? { rotate: 45, y: 4 } : { rotate: 0, y: 0 }} />
            <motion.span className="h-0.5 w-5.5 rounded-full bg-white" animate={mobileOpen ? { rotate: -45, y: -4 } : { rotate: 0, y: 0 }} />
          </button>
        </div>
      </nav>
      <AnimatePresence>{mobileOpen && <MobileMenu onClose={() => setMobileOpen(false)} />}</AnimatePresence>
    </header>
  );
}
