import { ApiFootballProvider } from "../src/providers/api-football";
import { hasDismissals } from "../src/domain/match";
import { LiveCoordinator } from "./coordinator";
import { FixtureCatalogue } from "./fixture-catalogue";

interface Env {
  API_FOOTBALL_KEY?: string;
  LIVE_STATE: DurableObjectNamespace;
  POLL_INTERVAL_SECONDS?: string;
  DAILY_REQUEST_LIMIT?: string;
}
const headers = { "Cache-Control": "no-store", "X-Robots-Tag": "noindex, nofollow", "X-Content-Type-Options": "nosniff" };
function setting(value: string | undefined, fallback: number, min: number, max: number): number {
  const n = Number(value);
  return Number.isSafeInteger(n) && n >= min && n <= max ? n : fallback;
}

export class RedCardState {
  private coordinator: LiveCoordinator;
  private catalogue: FixtureCatalogue;
  constructor(ctx: DurableObjectState, env: Env) {
    this.catalogue = new FixtureCatalogue(ctx.storage);
    this.coordinator = new LiveCoordinator(ctx.storage, new ApiFootballProvider(env.API_FOOTBALL_KEY),
      setting(env.POLL_INTERVAL_SECONDS, 1200, 20, 3600) * 1000,
      setting(env.DAILY_REQUEST_LIMIT, 85, 1, 7000), Date.now,
      event => console.info(JSON.stringify({ type: "new-dismissal", matchId: event.matchId, eventId: event.dismissal.id, detectedAt: event.detectedAt })),
      "provider-diagnostics-v3",
    );
  }
  async alarm(): Promise<void> { await this.coordinator.pollIfDue(); }
  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url);
    if (request.method !== "GET") return Response.json({ error: "Method not allowed" }, { status: 405, headers: { ...headers, Allow: "GET" } });
    if (!/^\/api\/(live|health|matches\/[^/]+)$/.test(url.pathname)) return Response.json({ error: "Not found" }, { status: 404, headers });
    const snapshot = await this.coordinator.pollIfDue();
    if (url.pathname === "/api/health") return Response.json({ status: snapshot.error ? "degraded" : "ok", provider: snapshot.provider, lastSuccessfulPoll: snapshot.lastSuccessfulPoll, nextPollAt: snapshot.nextPollAt, pollIntervalMs: snapshot.pollIntervalMs, error: snapshot.error }, { status: snapshot.error ? 503 : 200, headers });
    if (url.pathname.startsWith("/api/matches/")) {
      const match = snapshot.matches.find(match => match.id === decodeURIComponent(url.pathname.slice(13)));
      return Response.json(match ?? { error: "Match not found" }, { status: match ? 200 : 404, headers });
    }
    const iddaa = await this.catalogue.getListing(snapshot.matches);
    return Response.json({ ...snapshot, iddaa, matches: url.searchParams.get("red") === "true" ? snapshot.matches.filter(hasDismissals) : snapshot.matches }, { headers });
  }
}

export default {
  fetch(request: Request, env: Env): Promise<Response> {
    const id = env.LIVE_STATE.idFromName("shared-live-matches");
    return env.LIVE_STATE.get(id).fetch(request);
  },
};
