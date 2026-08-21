import { Inter } from "next/font/google";
import { Provider } from "@/components/provider";
import type { ReactNode } from "react";
import { docsJsonLd } from "@/lib/jsonld";
import "./global.css";

const inter = Inter({
  subsets: ["latin"],
});

export const metadata = {
  metadataBase: new URL("https://docs.descanto.com"),
  title: {
    template: "%s | Descanto Docs",
    default: "Descanto Docs",
  },
  description: "Documentation for Descanto: instant-wake, persistent Linux desktops for computer-use agents.",
  icons: {
    icon: "/favicon.svg",
  },
  openGraph: {
    type: "website",
    siteName: "Descanto Docs",
    images: ["https://descanto.com/og.png"],
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={inter.className} suppressHydrationWarning>
      <body className="flex flex-col min-h-screen">
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: JSON.stringify(docsJsonLd) }}
        />
        <Provider>{children}</Provider>
      </body>
    </html>
  );
}
