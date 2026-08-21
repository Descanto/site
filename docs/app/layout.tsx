import { Inter } from "next/font/google";
import { Provider } from "@/components/provider";
import type { ReactNode } from "react";
import "./global.css";

const inter = Inter({
  subsets: ["latin"],
});

export const metadata = {
  title: {
    template: "%s | Descanto Docs",
    default: "Descanto Docs",
  },
  description: "Documentation for Descanto: instant-wake, persistent Linux desktops for computer-use agents.",
  icons: {
    icon: "/favicon.svg",
  },
};

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={inter.className} suppressHydrationWarning>
      <body className="flex flex-col min-h-screen">
        <Provider>{children}</Provider>
      </body>
    </html>
  );
}
