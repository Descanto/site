// JSON-LD emitted on every docs page from app/layout.tsx. Mirrors the
// Organization identity published on descanto.com (src/lib/seo.ts there).

export const docsJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": "https://docs.descanto.com/#site",
      name: "Descanto Docs",
      url: "https://docs.descanto.com",
      description:
        "Developer documentation for Descanto: instant-wake, persistent Linux cloud desktops for computer-use agents. REST API, TypeScript and Python SDKs, CLI, and MCP server.",
      publisher: { "@id": "https://descanto.com/#org" },
      about: { "@id": "https://descanto.com/#software" },
    },
    {
      "@type": "SoftwareApplication",
      "@id": "https://descanto.com/#software",
      name: "Descanto",
      url: "https://descanto.com",
      applicationCategory: "DeveloperApplication",
      operatingSystem: "Web, Linux",
      description:
        "Instant-wake, persistent Linux cloud desktops for computer-use agents. Desktops hibernate to $0 compute when idle and wake in under a second.",
      softwareHelp: { "@type": "CreativeWork", url: "https://docs.descanto.com" },
      publisher: { "@id": "https://descanto.com/#org" },
    },
    {
      "@type": "Organization",
      "@id": "https://descanto.com/#org",
      name: "Descanto",
      legalName: "DV CENTRAL HOLDINGS LTD",
      url: "https://descanto.com",
      logo: "https://descanto.com/og.png",
      email: "hello@descanto.com",
      contactPoint: {
        "@type": "ContactPoint",
        contactType: "customer support",
        email: "hello@descanto.com",
        url: "https://descanto.com/contact",
      },
      address: {
        "@type": "PostalAddress",
        streetAddress: "71-75 Shelton Street, Covent Garden",
        addressLocality: "London",
        postalCode: "WC2H 9JQ",
        addressCountry: "GB",
      },
      sameAs: [
        "https://github.com/descanto",
        "https://www.npmjs.com/package/@descanto/sdk",
        "https://www.npmjs.com/package/@descanto/cli",
        "https://www.npmjs.com/package/@descanto/mcp",
      ],
    },
  ],
};
