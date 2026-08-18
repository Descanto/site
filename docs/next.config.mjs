import { createMDX } from "fumadocs-mdx/next";
import { fileURLToPath } from "node:url";

const withMDX = createMDX();

/** @type {import('next').NextConfig} */
const config = {
  output: "export",
  reactStrictMode: true,
  images: {
    unoptimized: true,
  },
  // Don't auto-generate AGENTS.md/CLAUDE.md on dev boot.
  agentRules: false,
  // Scope Turbopack to this app; the parent repo has its own lockfile.
  turbopack: {
    root: fileURLToPath(new URL(".", import.meta.url)),
  },
};

export default withMDX(config);
