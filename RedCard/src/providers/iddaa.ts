import type { LiveMatch } from "../domain/match";

// The public programme feed used by iddaa.com. Only fixture identity is retained.
export const IDDAA_FIXTURES_URL = "https://sportsbookv2.iddaa.com/sportsbook/events?st=1&type=0&version=0&live=true";
export type ListedFixture = { id: string; home: string; away: string; kickoffAt: string };
const object = (value: unknown): Record<string, unknown> => value !== null && typeof value === "object" && !Array.isArray(value) ? value as Record<string, unknown> : {};

export function normalizeIddaaFixtures(raw: unknown): ListedFixture[] {
  const body = object(raw);
  const data = object(body.data);
  // A diff needs its original version; never mistake deletions/changes for a full list.
  if (body.isSuccess !== true || data.isdiff !== false || !Array.isArray(data.events)) throw new Error("Invalid fixture catalogue");
  const fixtures = new Map<string, ListedFixture>();
  for (const rawEvent of data.events) {
    const row = object(rawEvent);
    if (row.sid !== 1) continue;
    if (typeof row.i !== "number" || !Number.isSafeInteger(row.i) || row.i <= 0 || typeof row.d !== "number" || !Number.isSafeInteger(row.d) || row.d <= 0 || row.d > 8_640_000_000_000) continue;
    if (typeof row.hn !== "string" || !row.hn.trim() || typeof row.an !== "string" || !row.an.trim()) continue;
    fixtures.set(String(row.i), { id: String(row.i), home: row.hn.trim(), away: row.an.trim(), kickoffAt: new Date(row.d * 1000).toISOString() });
  }
  if (data.events.length && !fixtures.size) throw new Error("No valid football fixtures");
  return [...fixtures.values()];
}

export class IddaaFixtureProvider {
  constructor(private request: typeof fetch = (input, init) => fetch(input, init)) {}
  async getFixtures(): Promise<ListedFixture[]> {
    const response = await this.request(IDDAA_FIXTURES_URL, { cache: "no-store", signal: AbortSignal.timeout(8000) });
    if (!response.ok) throw new Error("Fixture catalogue unavailable");
    return normalizeIddaaFixtures(await response.json());
  }
}

function teamKey(name: string, women = false): string {
  const normalized = name.toLowerCase().replace(/ı/g, "i").replace(/ø/g, "o").replace(/ł/g, "l").replace(/æ/g, "ae").replace(/ß/g, "ss")
    .normalize("NFKD").replace(/\p{M}/gu, "")
    .replace(/\(k\)|\b(?:women|woman|ladies|w|kvinner)\b/g, " women ")
    .replace(/\bu[- ]?(\d{2})\b/g, "u$1").replace(/[^\p{L}\p{N}]+/gu, " ").trim();
  const tokens = normalized.split(/\s+/).filter(token => !["fc", "cf", "afc", "sc", "fk", "bk", "sk", "cd", "ud", "gd", "sd", "ssd", "fbc", "ac", "as", "calcio", "club"].includes(token));
  const womenTeam = women || tokens.includes("women");
  const identity = tokens.filter(token => token !== "women").map(token => token === "ii" || token === "b" ? "reserve2" : token === "iii" || token === "c" ? "reserve3" : token);
  if (!identity.length) return "";
  if (womenTeam) identity.push("women");
  return identity.join(" ");
}

/** Both ordered teams and kickoff must agree; ambiguous identities are excluded. */
export function listedMatchIds(matches: LiveMatch[], fixtures: ListedFixture[]): string[] {
  const index = new Map<string, ListedFixture[]>();
  for (const fixture of fixtures) {
    const home = teamKey(fixture.home), away = teamKey(fixture.away);
    if (!home || !away) continue;
    const key = JSON.stringify([home, away]);
    index.set(key, [...(index.get(key) ?? []), fixture]);
  }
  const proposals = new Map<string, string[]>();
  for (const match of matches) {
    const kickoff = Date.parse(match.kickoffAt ?? "");
    if (!Number.isFinite(kickoff)) continue;
    const women = /\b(women|feminine|feminin|femenina|femminile|female|frauen|kvinner)\b/i.test(match.competition.name);
    const home = teamKey(match.home.name, women), away = teamKey(match.away.name, women);
    if (!home || !away) continue;
    const key = JSON.stringify([home, away]);
    const candidates = (index.get(key) ?? []).filter(fixture => Math.abs(Date.parse(fixture.kickoffAt) - kickoff) <= 5 * 60_000);
    if (candidates.length !== 1) continue;
    const fixtureId = candidates[0].id;
    proposals.set(fixtureId, [...(proposals.get(fixtureId) ?? []), match.id]);
  }
  // Avoid assigning the same catalogue fixture to two different live fixtures.
  return [...proposals.values()].filter(ids => ids.length === 1).map(ids => ids[0]);
}
