import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import fallbackCatalog from "@/content/plugin-catalog.json";

const CATALOG_ORIGIN = "https://catalog.botto.descanto.com";
const CATALOG_URL = `${CATALOG_ORIGIN}/catalog.json`;

interface CatalogMcp {
  transport: "stdio" | "http";
  auth?: "none" | "oauth" | "env";
  requiredEnv?: string[];
}

interface CatalogPlugin {
  id: string;
  name: string;
  description: string;
  icon?: string;
  categories: string[];
  featured?: boolean;
  source: string;
  path: string;
  mcp?: Record<string, CatalogMcp>;
  skills?: string[];
}

function authLabel(plugin: CatalogPlugin): string {
  const auths = Object.values(plugin.mcp ?? {}).map((m) => m.auth ?? "none");
  if (auths.includes("oauth")) return "Sign in to connect";
  if (auths.includes("env")) return "API key";
  return "No setup";
}

function PluginCard({ plugin }: { plugin: CatalogPlugin }) {
  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-surface p-5 transition-colors hover:border-white/22">
      <div className="flex items-start justify-between gap-3">
        <div className="flex size-10 items-center justify-center overflow-hidden rounded-xl bg-white/90 p-1.5">
          {plugin.icon ? (
            <img
              src={`${CATALOG_ORIGIN}${plugin.icon}`}
              alt=""
              className="size-full object-contain"
              loading="lazy"
              onError={(e) => {
                const el = e.currentTarget;
                el.replaceWith(Object.assign(document.createElement("span"), {
                  textContent: plugin.name.charAt(0),
                  className: "font-display text-lg font-semibold text-black/70",
                }));
              }}
            />
          ) : (
            <span className="font-display text-lg font-semibold text-black/70">{plugin.name.charAt(0)}</span>
          )}
        </div>
        <span className="rounded-full border border-white/10 px-2.5 py-1 text-[11px] text-white/45">{authLabel(plugin)}</span>
      </div>
      <div>
        <h3 className="font-display text-[16px] font-semibold tracking-tight">{plugin.name}</h3>
        <p className="mt-1 text-[13.5px] leading-relaxed text-white/55">{plugin.description}</p>
      </div>
      <div className="mt-auto flex items-center justify-between pt-1">
        <span className="text-[12px] text-white/35">{plugin.categories[0]}</span>
        <a
          className="text-[13px] font-medium text-accent-light hover:text-white"
          href={`https://github.com/Descanto/botto/tree/main/${plugin.path}`}
          target="_blank"
          rel="noreferrer"
        >
          View source ↗
        </a>
      </div>
    </div>
  );
}

export function PluginsPage() {
  const [plugins, setPlugins] = useState<CatalogPlugin[]>(
    (fallbackCatalog as unknown as { plugins: CatalogPlugin[] }).plugins,
  );
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string | null>(null);

  useEffect(() => {
    fetch(CATALOG_URL)
      .then((response) => (response.ok ? response.json() : null))
      .then((data: { plugins?: CatalogPlugin[] } | null) => {
        if (data?.plugins?.length) setPlugins(data.plugins);
      })
      .catch(() => {});
  }, []);

  const categories = useMemo(
    () => [...new Set(plugins.flatMap((p) => p.categories))].sort((a, b) => a.localeCompare(b)),
    [plugins],
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return plugins.filter((p) =>
      (!category || p.categories.includes(category))
      && (!q || `${p.name} ${p.description} ${p.categories.join(" ")}`.toLowerCase().includes(q)),
    );
  }, [plugins, query, category]);

  const featured = filtered.filter((p) => p.featured);
  const sections = category
    ? [[category, filtered] as const]
    : categories
        .map((c) => [c, filtered.filter((p) => p.categories[0] === c)] as const)
        .filter(([, list]) => list.length > 0);

  return (
    <>
      <section className="mx-auto flex max-w-[1440px] flex-col gap-6 px-20 pt-22 pb-10 max-lg:px-8">
        <span className="text-xs font-semibold tracking-widest text-white/40">PLUGIN MARKETPLACE</span>
        <h1 className="max-w-250 font-display text-[clamp(34px,3.6vw,52px)] font-medium leading-[1.2] tracking-[-0.025em]">
          Give every Bot a new tool.
        </h1>
        <p className="max-w-180 text-[17px] leading-[1.65] text-white/60">
          Plugins connect your Bots to the services you already use — email, calendars, docs, CRMs, search. Every plugin
          is open source in the Botto repo, and anyone can contribute one.
        </p>
        <div className="flex items-center gap-3">
          <Button href="https://github.com/Descanto/botto/tree/main/plugins">Build a plugin</Button>
          <Button variant="outline" href="https://github.com/Descanto/botto">GitHub</Button>
        </div>
      </section>

      <section className="mx-auto max-w-[1440px] px-20 pb-24 max-lg:px-8">
        <div className="mb-8 flex flex-wrap items-center gap-2">
          <input
            className="mr-auto w-72 rounded-xl border border-white/12 bg-surface px-4 py-2.5 text-[14px] text-white placeholder:text-white/35 focus:border-white/30 focus:outline-none max-md:w-full"
            placeholder="Search plugins"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button
            className={`cursor-pointer rounded-full border px-3.5 py-1.5 text-[13px] ${category === null ? "border-white/40 text-white" : "border-white/12 text-white/55 hover:text-white"}`}
            onClick={() => setCategory(null)}
          >
            All
          </button>
          {categories.map((c) => (
            <button
              key={c}
              className={`cursor-pointer rounded-full border px-3.5 py-1.5 text-[13px] ${category === c ? "border-white/40 text-white" : "border-white/12 text-white/55 hover:text-white"}`}
              onClick={() => setCategory(category === c ? null : c)}
            >
              {c}
            </button>
          ))}
        </div>

        {featured.length > 0 && !category && !query && (
          <div className="mb-12">
            <h2 className="mb-4 text-xs font-semibold tracking-widest text-white/40">FEATURED</h2>
            <div className="grid grid-cols-4 gap-4 max-xl:grid-cols-3 max-lg:grid-cols-2 max-sm:grid-cols-1">
              {featured.map((p) => <PluginCard key={p.id} plugin={p} />)}
            </div>
          </div>
        )}

        {sections.map(([title, list]) => (
          <div key={title} className="mb-12">
            <h2 className="mb-4 text-xs font-semibold tracking-widest text-white/40">{title.toUpperCase()}</h2>
            <div className="grid grid-cols-4 gap-4 max-xl:grid-cols-3 max-lg:grid-cols-2 max-sm:grid-cols-1">
              {list.map((p) => <PluginCard key={p.id} plugin={p} />)}
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <p className="py-16 text-center text-white/45">No plugins match “{query}”.</p>
        )}
      </section>
    </>
  );
}
