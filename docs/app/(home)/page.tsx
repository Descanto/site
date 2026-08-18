import Link from "next/link";

const products = [
  {
    href: "/docs/canto",
    title: "Canto",
    description: "Instant-wake desktops for agents.",
  },
  {
    href: "/docs/botto",
    title: "Botto",
    description: "The open agent for your Mac.",
  },
];

export default function HomePage() {
  return (
    <div className="flex flex-col justify-center items-center text-center flex-1 gap-8 px-6 py-24">
      <div className="flex flex-col items-center gap-4">
        <h1 className="text-3xl font-bold">Descanto Docs</h1>
        <p className="max-w-xl text-fd-muted-foreground">
          Documentation for everything Descanto builds. Pick a product to get
          started.
        </p>
      </div>
      <div className="grid w-full max-w-2xl grid-cols-1 gap-4 sm:grid-cols-2">
        {products.map((product) => (
          <Link
            key={product.href}
            href={product.href}
            className="flex flex-col gap-1 rounded-xl border border-fd-border bg-fd-card p-6 text-left transition-colors hover:bg-fd-accent"
          >
            <span className="text-lg font-semibold">{product.title}</span>
            <span className="text-sm text-fd-muted-foreground">
              {product.description}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
