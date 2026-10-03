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
          export default { async fetch() {
            try { return Response.json(await new ApiFootballProvider("test-key").getLiveMatches()); }
            catch (error) { return Response.json({ error: error.message }, { status: 500 }); }
          } };`,
        resolveDir: root, sourcefile: "test-worker.ts", loader: "ts",
      },
      tsconfig: root + "/tsconfig.json", bundle: true, format: "esm", platform: "neutral", write: false,
    });
    const outbound = vi.fn(async () => Response.json({ errors: [], response: [{
      fixture: { id: 42, status: { short: "2H", elapsed: 78 } },
      league: { id: 1, name: "Women's Super League" },
      teams: { home: { id: 2, name: "Arsenal Women" }, away: { id: 3, name: "Chelsea Women" } },
      goals: { home: 0, away: 1 },
      events: [{ type: "Card", detail: "Yellow-Red Card", time: { elapsed: 58 }, team: { id: 2 }, player: { id: 4, name: "Example player" } }],
    }] }));
    const runtime = new Miniflare(convertV4MiniflareOptions({
      modules: true, compatibilityDate: "2026-10-03", script: bundle.outputFiles[0].text, outboundService: outbound,
    }));
    try {
      const response = await runtime.dispatchFetch("https://test.example/");
      expect(response.status).toBe(200);
      expect(await response.json()).toMatchObject([{ home: { name: "Arsenal Women", redCards: 1 }, dismissals: [{ type: "second-yellow" }] }]);
      expect(outbound).toHaveBeenCalledTimes(1);
    } finally { await runtime.dispose(); }
  }, 15_000);
});
