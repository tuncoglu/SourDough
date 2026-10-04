import { describe, expect, it, vi } from "vitest";
import { build } from "esbuild";
import { Miniflare, convertV4MiniflareOptions } from "miniflare";
import { fileURLToPath } from "node:url";

describe("Cloudflare provider runtime", () => {
  it("calls native fetch with its global receiver and normalizes the bulk women's feed", async () => {
    const root = fileURLToPath(new URL("..", import.meta.url));
    const bundle = await build({
      stdin: {
        contents: `import { ApiFootballProvider } from "./src/providers/api-football";
          import { IddaaFixtureProvider, listedMatchIds } from "./src/providers/iddaa";
          export default { async fetch() {
            try {
              const matches = await new ApiFootballProvider("test-key").getLiveMatches();
              const fixtures = await new IddaaFixtureProvider().getFixtures();
              return Response.json({ matches, listed: listedMatchIds(matches, fixtures), fixtures });
            }
            catch (error) { return Response.json({ error: error.message }, { status: 500 }); }
          } };`,
        resolveDir: root, sourcefile: "test-worker.ts", loader: "ts",
      },
      tsconfig: root + "/tsconfig.json", bundle: true, format: "esm", platform: "neutral", write: false,
    });
    const outbound = vi.fn(async (request: Request) => {
      if (new URL(request.url).hostname === "sportsbookv2.iddaa.com") {
        expect(request.headers.get("x-apisports-key")).toBeNull();
        return Response.json({ isSuccess: true, data: { isdiff: false, events: [{ i: 1, sid: 1, hn: "Arsenal (K)", an: "Chelsea (K)", d: 1791108900, m: [{ odds: 1.2 }] }] } });
      }
      return Response.json({ errors: [], response: [{
      fixture: { id: 42, timestamp: 1791108900, status: { short: "2H", elapsed: 78 } },
      league: { id: 1, name: "Women's Super League" },
      teams: { home: { id: 2, name: "Arsenal Women" }, away: { id: 3, name: "Chelsea Women" } },
      goals: { home: 0, away: 1 },
      events: [{ type: "Card", detail: "Yellow-Red Card", time: { elapsed: 58 }, team: { id: 2 }, player: { id: 4, name: "Example player" } }],
    }] }); });
    const runtime = new Miniflare(convertV4MiniflareOptions({
      modules: true, compatibilityDate: "2026-10-03", script: bundle.outputFiles[0].text, outboundService: outbound,
    }));
    try {
      const response = await runtime.dispatchFetch("https://test.example/");
      expect(response.status).toBe(200);
      expect(await response.json()).toMatchObject({ matches: [{ home: { name: "Arsenal Women", redCards: 1 }, dismissals: [{ type: "second-yellow" }] }], listed: ["42"], fixtures: [{ id: "1", home: "Arsenal (K)", away: "Chelsea (K)" }] });
      expect(outbound).toHaveBeenCalledTimes(2);
    } finally { await runtime.dispose(); }
  }, 15_000);
});
