import type { Dismissal, DismissalType } from "@/domain/dismissal";
import type { LiveMatch } from "@/domain/match";
import { ProviderError, type FootballProvider } from "./football-provider";

type RecordValue = Record<string, unknown>;
const object = (value: unknown): RecordValue => value !== null && typeof value === "object" && !Array.isArray(value) ? value as RecordValue : {};
const text = (value: unknown): string | undefined => typeof value === "string" && value.trim() ? value.trim() : undefined;
const id = (value: unknown): string | undefined => typeof value === "number" && Number.isSafeInteger(value) && value > 0 ? String(value) : typeof value === "string" && /^\d+$/.test(value) && Number(value) > 0 ? value : undefined;
const nonnegative = (value: unknown): number | undefined => typeof value === "number" && Number.isSafeInteger(value) && value >= 0 ? value : undefined;
const logo = (value: unknown): string | undefined => {
  const candidate = text(value);
  return candidate?.startsWith("https://") ? candidate : undefined;
};

const liveStatuses: Record<string, string> = { "1H": "First half", HT: "Half-time", "2H": "Second half", ET: "Extra time", BT: "Extra-time break", P: "Penalties", SUSP: "Suspended", INT: "Interrupted", LIVE: "Live" };

export function normalizeDismissals(rawEvents: unknown, matchId: string, teamIds: string[]): Dismissal[] {
  if (!Array.isArray(rawEvents)) return [];
  const unique = new Map<string, Dismissal>();
  for (const raw of rawEvents) {
    const event = object(raw);
    if (text(event.type) !== "Card") continue;
    const detail = text(event.detail);
    const type: DismissalType | undefined = detail === "Red Card" ? "straight-red" : detail === "Yellow-Red Card" ? "second-yellow" : undefined;
    if (!type) continue;
    const teamId = id(object(event.team).id);
    const minute = nonnegative(object(event.time).elapsed);
    if (!teamId || !teamIds.includes(teamId) || minute === undefined) continue;
    const addedTime = nonnegative(object(event.time).extra);
    const player = object(event.player);
    const playerId = id(player.id);
    const playerName = text(player.name);
    // API-Football supplies no event ID. This signature is independent of array order.
    const eventId = JSON.stringify([matchId, teamId, minute, addedTime ?? 0, type, playerId ?? playerName ?? "unknown"]);
    unique.set(eventId, { id: eventId, teamId, playerId, playerName, minute, addedTime, type });
  }
  return [...unique.values()].sort((a, b) => a.minute - b.minute || (a.addedTime ?? 0) - (b.addedTime ?? 0));
}

export function normalizeFixture(raw: unknown, now = new Date()): LiveMatch | null {
  const row = object(raw);
  const fixture = object(row.fixture);
  const matchId = id(fixture.id);
  const status = object(fixture.status);
  const short = text(status.short);
  const teams = object(row.teams);
  const home = object(teams.home);
  const away = object(teams.away);
  const homeId = id(home.id);
  const awayId = id(away.id);
  if (!matchId || !homeId || !awayId || homeId === awayId || !short || !Object.hasOwn(liveStatuses, short)) return null;
  const league = object(row.league);
  const goals = object(row.goals);
  const dismissals = normalizeDismissals(row.events, matchId, [homeId, awayId]);
  const kickoff = typeof fixture.timestamp === "number" ? fixture.timestamp * 1000 : Date.parse(text(fixture.date) ?? "");
  return {
    id: matchId,
    kickoffAt: Number.isFinite(kickoff) && kickoff > 0 && kickoff <= 8_640_000_000_000_000 ? new Date(kickoff).toISOString() : undefined,
    competition: { id: id(league.id) ?? "unknown", name: text(league.name) ?? "Competition unavailable", country: text(league.country), logo: logo(league.logo) },
    status: liveStatuses[short], minute: nonnegative(status.elapsed), addedTime: nonnegative(status.extra),
    home: { id: homeId, name: text(home.name) ?? "Home team", logo: logo(home.logo), score: nonnegative(goals.home) ?? null, redCards: dismissals.filter(d => d.teamId === homeId).length },
    away: { id: awayId, name: text(away.name) ?? "Away team", logo: logo(away.logo), score: nonnegative(goals.away) ?? null, redCards: dismissals.filter(d => d.teamId === awayId).length },
    dismissals, updatedAt: now.toISOString(),
  };
}

export class ApiFootballProvider implements FootballProvider {
  readonly name = "api-football";
  // Workers' native fetch requires its global receiver, so do not store it unbound.
  constructor(private key: string | undefined, private timeoutMs = 10_000, private request: typeof fetch = (input, init) => fetch(input, init)) {}

  async getLiveMatches(): Promise<LiveMatch[]> {
    if (!this.key?.trim()) throw new ProviderError("API_FOOTBALL_KEY is not configured", 120_000);
    let response: Response;
    try {
      // Include every covered competition, including women's football; no league/gender filter.
      response = await this.request("https://v3.football.api-sports.io/fixtures?live=all", {
        headers: { "x-apisports-key": this.key }, cache: "no-store", signal: AbortSignal.timeout(this.timeoutMs),
      });
    } catch (error) {
      if (error instanceof Error && (error.name === "TimeoutError" || error.name === "AbortError")) throw new ProviderError("API-Football timed out");
      throw new ProviderError("API-Football connection failed");
    }
    if (response.status === 429) {
      const retry = response.headers.get("retry-after");
      const seconds = retry ? Number(retry) : NaN;
      const delay = Number.isFinite(seconds) ? seconds * 1000 : retry ? Date.parse(retry) - Date.now() : 120_000;
      throw new ProviderError("API-Football rate limit reached", Number.isFinite(delay) ? Math.max(120_000, delay) : 120_000);
    }
    if (!response.ok) throw new ProviderError(`API-Football returned HTTP ${response.status}`);
    if (response.status === 204) return [];
    let raw: unknown;
    try { raw = await response.json(); } catch { throw new ProviderError("API-Football returned invalid JSON"); }
    const body = object(raw);
    const errors = body.errors;
    const hasErrors = Array.isArray(errors) ? errors.length > 0 : Object.keys(object(errors)).length > 0 || (typeof errors === "string" && errors.length > 0);
    if (hasErrors) {
      // Keep provider diagnostics in private Worker logs; never log credentials or fixtures.
      const diagnostic = JSON.stringify(errors).split(this.key).join("[redacted]").slice(0, 1000);
      console.warn(JSON.stringify({ type: "provider-error", status: response.status, errors: diagnostic,
        dailyLimit: response.headers.get("x-ratelimit-requests-limit"),
        dailyRemaining: response.headers.get("x-ratelimit-requests-remaining"),
        minuteLimit: response.headers.get("x-ratelimit-limit"),
        minuteRemaining: response.headers.get("x-ratelimit-remaining"),
      }));
      const quotaError = /rate|quota|limit|requests/i.test(JSON.stringify(errors));
      throw new ProviderError(quotaError ? "API-Football quota or rate limit reached" : "API-Football rejected the request", quotaError ? 900_000 : undefined);
    }
    if (!Array.isArray(body.response)) throw new ProviderError("API-Football returned a malformed response");
    const now = new Date();
    const matches = new Map<string, LiveMatch>();
    for (const rawFixture of body.response) {
      const match = normalizeFixture(rawFixture, now);
      if (match) matches.set(match.id, match);
    }
    // A completely broken nonempty feed must not wipe the last successful live state.
    if (body.response.length > 0 && matches.size === 0) throw new ProviderError("API-Football returned no valid live fixtures");
    return [...matches.values()];
  }
}
