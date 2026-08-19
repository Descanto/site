import { Link } from "react-router-dom";
import { Mark } from "./mark";

const columns: { heading: string; links: { label: string; to: string }[] }[] = [
  {
    heading: "Product",
    links: [
      { label: "Early access", to: "mailto:hello@descanto.com?subject=Canto%20early%20access" },
      { label: "Pricing", to: "/pricing" },
      { label: "Quickstart", to: "https://docs.descanto.com/docs/canto/quickstart" },
      { label: "Status", to: "https://github.com/descanto" },
    ],
  },
  {
    heading: "Developers",
    links: [
      { label: "Docs", to: "https://docs.descanto.com/docs/canto" },
      { label: "API reference", to: "https://docs.descanto.com/docs/canto/api/overview" },
      { label: "TypeScript SDK", to: "https://docs.descanto.com/docs/canto/sdk/typescript" },
      { label: "MCP server", to: "https://docs.descanto.com/docs/canto/mcp" },
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
  const cls = "text-[13px] text-graphite hover:text-ink";
  return to.startsWith("/") ? (
    <Link to={to} className={cls}>{label}</Link>
  ) : (
    <a href={to} className={cls}>{label}</a>
  );
}

export function Footer() {
  return (
    <footer className="hairline-t">
      <div className="mx-auto flex max-w-[1440px] justify-between px-20 pt-18 pb-14 max-lg:flex-col max-lg:gap-12 max-lg:px-8">
        <div className="flex w-75 flex-col gap-3.5">
          <div className="flex items-center gap-2.5">
            <Mark size={22} />
            <span className="font-display font-bold tracking-tight">canto</span>
          </div>
          <p className="text-[13px] leading-5 text-graphite">
            Instant-wake cloud desktops for agents.
            <br />
            Always there. Pay only when it thinks.
          </p>
          <p className="text-xs text-faint">© 2026 Descanto</p>
        </div>
        <div className="flex gap-18 max-md:grid max-md:grid-cols-2 max-md:gap-10">
          {columns.map((col) => (
            <div key={col.heading} className="flex flex-col gap-3">
              <span className="text-xs font-semibold tracking-widest text-faint uppercase">{col.heading}</span>
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
