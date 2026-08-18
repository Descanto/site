import { source } from "@/lib/source";
import { createFromSource } from "fumadocs-core/search/server";

// `output: "export"` pre-renders this GET handler to a static JSON asset at
// build time (no server function runs on Cloudflare Pages) -- this is
// Fumadocs' "static search" pattern: `staticGET` bakes an Orama index, and
// components/search.tsx's `staticClient()` fetches + queries it fully
// client-side. There is no live API route in the deployed output.
export const revalidate = false;

export const { staticGET: GET } = createFromSource(source, {
  language: "english",
});
