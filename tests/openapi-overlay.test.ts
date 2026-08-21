import { describe, expect, test } from "bun:test";
import { overlaySpec } from "../functions/openapi.json";
import { operationSummaries } from "../functions/_openapi-overlay";

describe("overlaySpec", () => {
  test("pins the production server URL", () => {
    const spec = overlaySpec({ servers: [{ url: "/" }], paths: {} });
    expect(spec.servers).toEqual([{ url: "https://api.descanto.com", description: "Descanto production API" }]);
  });

  test("adds a summary to operations that lack one", () => {
    const spec = overlaySpec({
      paths: { "/v1/desktops": { get: { operationId: "listDesktops" } } },
    });
    expect(spec.paths!["/v1/desktops"].get.summary).toBe(operationSummaries.listDesktops);
  });

  test("never overwrites an upstream summary or description", () => {
    const spec = overlaySpec({
      paths: {
        "/v1/usage": { get: { operationId: "getUsage", summary: "Upstream summary" } },
        "/v1/me": { get: { operationId: "getMe", description: "Upstream description" } },
      },
    });
    expect(spec.paths!["/v1/usage"].get.summary).toBe("Upstream summary");
    expect(spec.paths!["/v1/me"].get.summary).toBeUndefined();
  });

  test("adds a default problem+json error response to every operation", () => {
    const spec = overlaySpec({
      components: { schemas: { ProblemJson: { type: "object" } } },
      paths: {
        "/v1/me": { get: { operationId: "getMe", responses: { "200": {}, "401": {} } } },
        "/v1/keys": { get: { operationId: "listApiKeys", responses: { "200": {}, default: { description: "upstream default" } } } },
      },
    });
    const added = spec.paths!["/v1/me"].get.responses!.default as { content: Record<string, { schema: { $ref: string } }> };
    expect(added.content["application/problem+json"].schema.$ref).toBe("#/components/schemas/ProblemJson");
    // never clobbers an upstream default
    expect((spec.paths!["/v1/keys"].get.responses!.default as { description: string }).description).toBe("upstream default");
  });

  test("skips default-error injection when ProblemJson is absent", () => {
    const spec = overlaySpec({ paths: { "/x": { get: { operationId: "getMe", responses: { "200": {} } } } } });
    expect(spec.paths!["/x"].get.responses!.default).toBeUndefined();
  });

  test("declares versioning, deprecation, and rate-limit policy in info", () => {
    const spec = overlaySpec({ info: { title: "Descanto API", description: "Base." }, paths: {} });
    const info = spec.info as Record<string, unknown>;
    expect(String(info.description)).toContain("Versioning and deprecation");
    expect(String(info.description)).toContain("Sunset");
    expect(String(info.description)).toContain("RateLimit");
    expect(info["x-versioning-policy"]).toContain("docs.descanto.com");
    expect((info.contact as { email: string }).email).toBe("hello@descanto.com");
  });

  test("ignores non-method keys like parameters", () => {
    const spec = overlaySpec({
      paths: { "/v1/desktops/{id}": { parameters: [{ name: "id" }] as never, get: { operationId: "getDesktop" } } },
    });
    expect(spec.paths!["/v1/desktops/{id}"].get.summary).toBe(operationSummaries.getDesktop);
  });
});

describe("live spec coverage", () => {
  test("every operation in the pinned overlay has a non-empty summary", () => {
    for (const [id, summary] of Object.entries(operationSummaries)) {
      expect(summary.length, id).toBeGreaterThan(10);
    }
  });
});
