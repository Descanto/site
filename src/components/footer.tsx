import { Link } from "react-router-dom";
import { Mascot } from "./mascot";

const columns: { heading: string; links: { label: string; to: string }[] }[] = [
  {
    heading: "Botto",
    links: [
      { label: "Download", to: "https://botto.descanto.com" },
      { label: "Web app", to: "https://botto.descanto.com" },
      { label: "Plugins", to: "/botto#plugins" },
      { label: "Changelog", to: "https://github.com/descanto" },
    ],
  },
  {
    heading: "Canto",
    links: [
      { label: "Early access", to: "/canto" },
      { label: "API docs", to: "https://docs.descanto.com/docs/canto" },
      { label: "Pricing", to: "/canto#pricing" },
      { label: "Status", to: "https://github.com/descanto" },
    ],
  },
  {
    heading: "Developers",
    links: [
      { label: "Docs", to: "https://docs.descanto.com" },
      { label: "GitHub", to: "https://github.com/descanto" },
      { label: "Self-hosting", to: "https://github.com/descanto" },
      { label: "Security", to: "https://github.com/descanto" },
    ],
  },
  {
    heading: "Company",
    links: [
      { label: "About", to: "/about" },
      { label: "News", to: "/news" },
      { label: "Privacy", to: "/privacy" },
      { label: "Terms", to: "/terms" },
    ],
  },
];

function FooterLink({ label, to }: { label: string; to: string }) {
  const cls = "text-[13px] text-white/60 hover:text-white";
  return to.startsWith("http") ? (
    <a href={to} className={cls}>{label}</a>
  ) : (
    <Link to={to} className={cls}>{label}</Link>
  );
}

export function Footer() {
  return (
    <footer className="hairline-t">
      <div className="mx-auto flex max-w-[1440px] justify-between px-20 pt-18 pb-14 max-lg:flex-col max-lg:gap-12 max-lg:px-8">
        <div className="flex w-75 flex-col gap-3.5">
          <div className="flex items-center gap-2.5">
            <Mascot size={22} />
            <span className="font-display font-semibold tracking-tight">descanto</span>
          </div>
          <p className="text-[13px] leading-5 text-white/55">
            Agents that work like people.
            <br />
            Computers built for agents.
          </p>
          <p className="text-xs text-white/35">© 2026 Descanto</p>
        </div>
        <div className="flex gap-18 max-md:grid max-md:grid-cols-2 max-md:gap-10">
          {columns.map((col) => (
            <div key={col.heading} className="flex flex-col gap-3">
              <span className="text-xs font-semibold tracking-widest text-white/40 uppercase">{col.heading}</span>
              {col.links.map((l) => (
                <FooterLink key={l.label} {...l} />
              ))}
            </div>
          ))}
        </div>
      </div>
    </footer>
  );
}
