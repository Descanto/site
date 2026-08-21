// GET /openapi.json — publish the Canto API's OpenAPI spec at the marketing
// apex, where agents look for it. Fetches the live spec from
// api.descanto.com, pins the production server URL, and overlays
// per-operation summaries (see _openapi-overlay.ts) so every operation is
// self-describing for LLM function-calling. Edge-cached for an hour.

import { operationSummaries } from "./_openapi-overlay";

const UPSTREAM = "https://api.descanto.com/v1/openapi.json";
const HTTP_METHODS = new Set(["get", "post", "put", "patch", "delete", "head", "options"]);

type Spec = {
  servers?: unknown;
  paths?: Record<string, Record<string, { operationId?: string; summary?: string; description?: string }>>;
};

export function overlaySpec(spec: Spec): Spec {
  spec.servers = [{ url: "https://api.descanto.com", description: "Canto production API" }];
  for (const methods of Object.values(spec.paths ?? {})) {
    for (const [method, op] of Object.entries(methods)) {
      if (!HTTP_METHODS.has(method) || typeof op !== "object" || op === null) continue;
      const summary = op.operationId && operationSummaries[op.operationId];
      if (summary && !op.summary && !op.description) op.summary = summary;
    }
  }
  return spec;
}

export const onRequestGet = async (): Promise<Response> => {
  const upstream = await fetch(UPSTREAM, { cf: { cacheTtl: 3600, cacheEverything: true } } as RequestInit);
  if (!upstream.ok) {
    return new Response(
      JSON.stringify({
        error: {
          code: "upstream_unavailable",
          message: "The OpenAPI spec is temporarily unavailable.",
          hint: "Retry shortly, or fetch it directly from https://api.descanto.com/v1/openapi.json",
        },
      }),
      { status: 502, headers: { "Content-Type": "application/json" } },
    );
  }
  const spec = overlaySpec((await upstream.json()) as Spec);
  return new Response(JSON.stringify(spec), {
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "public, max-age=3600",
      "Access-Control-Allow-Origin": "*",
    },
  });
};
