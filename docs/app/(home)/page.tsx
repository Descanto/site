import Link from "next/link";

const entries = [
  {
    href: "/docs/canto",
    title: "What is Canto",
    description: "Instant-wake, persistent Linux desktops for computer-use agents.",
  },
  {
    href: "/docs/canto/quickstart",
    title: "Quickstart",
    description: "Create, wake, exec, and hibernate your first desktop.",
  },
  {
    href: "/docs/canto/api/overview",
    title: "API reference",
    description: "Every route, every status code, straight from the contract.",
  },
  {
    href: "/docs/canto/mcp",
    title: "MCP server",
    description: "Drive desktops from Claude Code, Cursor, or any MCP client.",
  },
];

export default function HomePage() {
  return (
    <div className="flex flex-col justify-center items-center text-center flex-1 gap-8 px-6 py-24">
      <div className="flex flex-col items-center gap-4">
        <h1 className="text-3xl font-bold">Canto Docs</h1>
        <p className="max-w-xl text-fd-muted-foreground">
          Persistent cloud desktops for agents — always there, pay only when it
          thinks. Pick a starting point.
        </p>
      </div>
      <div className="grid w-full max-w-2xl grid-cols-1 gap-4 sm:grid-cols-2">
        {entries.map((entry) => (
          <Link
            key={entry.href}
            href={entry.href}
            className="flex flex-col gap-1 rounded-xl border border-fd-border bg-fd-card p-6 text-left transition-colors hover:bg-fd-accent"
          >
            <span className="text-lg font-semibold">{entry.title}</span>
            <span className="text-sm text-fd-muted-foreground">
              {entry.description}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
