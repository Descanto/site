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
