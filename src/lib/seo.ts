// Per-route metadata used by the build-time prerenderer (scripts/prerender.ts)
// to emit <title>, description, canonical, Open Graph tags, and JSON-LD.
// Keep in sync with the routes in src/routes.tsx.

export const SITE_URL = "https://descanto.com";
export const OG_IMAGE = `${SITE_URL}/og.png`;

export interface PageMeta {
  /** Route path, also the canonical path. */
  path: string;
  title: string;
  description: string;
  ogType: "website" | "article";
  /** ISO date for sitemap <lastmod>; pages without one use the build date. */
  lastmod?: string;
}

export const staticPages: PageMeta[] = [
  {
    path: "/",
    title: "Canto — instant-wake cloud desktops for agents",
    description:
      "Canto gives computer-use agents a persistent Linux desktop that hibernates when idle and wakes in under a second. Honest, awake-time-only billing from $6/mo.",
    ogType: "website",
  },
  {
    path: "/pricing",
    title: "Pricing — Canto",
    description:
      "Locked launch pricing for Canto cloud desktops: Small $6/mo, Default $12/mo, Large $24/mo — or hourly billing that meters awake time only. Hibernated desktops cost $0 compute.",
    ogType: "website",
  },
  {
    path: "/news",
    title: "News — Canto",
    description: "Launches, releases, and engineering notes from the team building Canto.",
    ogType: "website",
  },
  {
    path: "/about",
    title: "About — Canto",
    description:
      "Canto builds the computer agents work on: persistent cloud desktops in hardware-isolated microVMs that wake in half a second and never forget where they were.",
    ogType: "website",
  },
  {
    path: "/contact",
    title: "Contact — Canto",
    description:
      "Talk to the team behind Canto — early access, fleet sizing, security reports, or anything else. hello@descanto.com, GitHub, or the contact form.",
    ogType: "website",
  },
  {
    path: "/privacy",
    title: "Privacy policy — Canto",
    description:
      "What Descanto collects to run Canto, why, and what we never do with it. No tracking cookies, no selling data, your desktop contents are yours.",
    ogType: "article",
  },
  {
    path: "/terms",
    title: "Terms of service — Canto",
    description:
      "The terms governing Canto cloud desktops during early access: the service, your responsibilities, billing, your data, and liability.",
    ogType: "article",
  },
  {
    path: "/early-access",
    title: "Request early access — Canto",
    description:
      "Canto desktops are manually provisioned during early access. Tell us what you're building and we'll get you an API key as capacity opens up.",
    ogType: "website",
  },
];

/** JSON-LD for the homepage: the product and the organization behind it. */
export const homeJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "SoftwareApplication",
      "@id": `${SITE_URL}/#software`,
      name: "Canto",
      description:
        "Instant-wake, persistent Linux cloud desktops for computer-use agents. Desktops hibernate to $0 compute when idle and wake in under a second with tabs, processes, and logins intact. Driven by a REST API, TypeScript and Python SDKs, a CLI, and an MCP server.",
      url: SITE_URL,
      applicationCategory: "DeveloperApplication",
      operatingSystem: "Web, Linux",
      offers: [
        { "@type": "Offer", name: "Small (2 vCPU / 4 GB)", price: "6", priceCurrency: "USD", description: "$6/month or $0.009 per awake hour" },
        { "@type": "Offer", name: "Default (4 vCPU / 8 GB)", price: "12", priceCurrency: "USD", description: "$12/month or $0.018 per awake hour" },
        { "@type": "Offer", name: "Large (8 vCPU / 16 GB)", price: "24", priceCurrency: "USD", description: "$24/month or $0.036 per awake hour" },
      ],
      softwareHelp: { "@type": "CreativeWork", url: "https://docs.descanto.com" },
      publisher: { "@id": `${SITE_URL}/#org` },
    },
    {
      "@type": "Organization",
      "@id": `${SITE_URL}/#org`,
      name: "Descanto",
      url: SITE_URL,
      logo: `${SITE_URL}/og.png`,
      description: "Descanto builds Canto, the cloud desktop platform for computer-use agents.",
      email: "hello@descanto.com",
      contactPoint: {
        "@type": "ContactPoint",
        contactType: "customer support",
        email: "hello@descanto.com",
        url: `${SITE_URL}/contact`,
      },
      sameAs: [
        "https://github.com/descanto",
        "https://www.npmjs.com/package/@descanto/vm-sdk",
        "https://www.npmjs.com/package/@descanto/vm-cli",
        "https://www.npmjs.com/package/@descanto/vm-mcp",
      ],
    },
  ],
};
