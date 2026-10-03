import { describe, expect, it, vi } from "vitest";
import { ApiFootballProvider, normalizeDismissals, normalizeFixture } from "@/providers/api-football";

const event = (detail: string) => ({ type: "Card", detail, time: { elapsed: 68, extra: null }, team: { id: 42 }, player: { id: 100, name: "Player Name" } });
const fixture = { fixture: { id: 12, status: { short: "2H", elapsed: 72 } }, league: { id: 39, name: "Premier League", logo: null }, teams: { home: { id: 42, name: "Arsenal" }, away: { id: 49, name: "Chelsea" } }, goals: { home: 1, away: null }, events: [event("Red Card")] };

describe("provider normalisation", () => {
  it.each([["Red Card", "straight-red"], ["Yellow-Red Card", "second-yellow"]])("maps %s to %s", (detail, type) => {
    expect(normalizeDismissals([event(detail)], "12", ["42", "49"])[0].type).toBe(type);
  });
  it("ignores yellows, unknown teams, invalid times and malformed events", () => {
    const events = [event("Yellow Card"), null, {}, "broken", { ...event("Red Card"), team: null }, { ...event("Red Card"), time: { elapsed: -1 } }, { ...event("Red Card"), team: { id: 999 } }];
    expect(normalizeDismissals(events, "12", ["42", "49"])).toEqual([]);
    expect(normalizeDismissals(null, "12", ["42"])).toEqual([]);
  });
  it("allows a missing player and added time; deduplicates events", () => {
    const partial = { ...event("Red Card"), player: null, time: { elapsed: 90, extra: 3 } };
    const result = normalizeDismissals([partial, partial], "12", ["42"]);
    expect(result).toHaveLength(1);
    expect(result[0]).toMatchObject({ playerName: undefined, minute: 90, addedTime: 3 });
  });
  it("normalises scores/counts and rejects malformed or finished fixtures", () => {
    expect(normalizeFixture(fixture)).toMatchObject({ home: { score: 1, redCards: 1 }, away: { score: null, redCards: 0 }, competition: { logo: undefined }, status: "Second half" });
    expect(normalizeFixture(null)).toBeNull();
    expect(normalizeFixture({ ...fixture, fixture: { id: 12, status: { short: "FT" } } })).toBeNull();
  });
  it("uses stable IDs when events reorder", () => {
    const second = { ...event("Yellow-Red Card"), player: { id: 101 } };
    const a = normalizeDismissals([event("Red Card"), second], "12", ["42"]);
    const b = normalizeDismissals([second, event("Red Card")], "12", ["42"]);
    expect(new Set(a.map(e => e.id))).toEqual(new Set(b.map(e => e.id)));
  });
});

describe("API-Football transport", () => {
  it("includes women's competitions in the same bulk feed as men's matches", async () => {
    const women = {
      ...fixture,
      fixture: { ...fixture.fixture, id: 13 },
      league: { id: 1001, name: "Women's Super League", country: "England" },
      teams: { home: { id: 1002, name: "Arsenal Women" }, away: { id: 1003, name: "Chelsea Women" } },
      events: [{ ...event("Yellow-Red Card"), team: { id: 1002 } }],
    };
    const request = vi.fn<typeof fetch>().mockResolvedValue(Response.json({ errors: [], response: [fixture, women] }));
    const result = await new ApiFootballProvider("test-key", 1000, request).getLiveMatches();
    expect(result).toHaveLength(2);
    expect(result[1]).toMatchObject({ competition: { name: "Women's Super League" }, home: { name: "Arsenal Women", redCards: 1 }, dismissals: [{ type: "second-yellow" }] });
    expect(request).toHaveBeenCalledTimes(1);
  });
  it("uses one bulk server request including events", async () => {
    const request = vi.fn<typeof fetch>().mockResolvedValue(Response.json({ errors: [], response: [fixture] }));
    const result = await new ApiFootballProvider("test-key", 1000, request).getLiveMatches();
    expect(result).toHaveLength(1);
    expect(request).toHaveBeenCalledTimes(1);
    expect(request).toHaveBeenCalledWith("https://v3.football.api-sports.io/fixtures?live=all", expect.objectContaining({ cache: "no-store", headers: { "x-apisports-key": "test-key" } }));
  });
  it("handles a no-content response as an empty live feed", async () => {
    const request = vi.fn<typeof fetch>().mockResolvedValue(new Response(null, { status: 204 }));
    await expect(new ApiFootballProvider("key", 1000, request).getLiveMatches()).resolves.toEqual([]);
  });
  it("does not make a request without credentials", async () => {
    const request = vi.fn<typeof fetch>();
    await expect(new ApiFootballProvider(undefined, 1000, request).getLiveMatches()).rejects.toThrow("not configured");
    expect(request).not.toHaveBeenCalled();
  });
  it("handles rate limits including provider errors inside HTTP 200", async () => {
    const request = vi.fn<typeof fetch>().mockResolvedValueOnce(new Response(null, { status: 429, headers: { "Retry-After": "300" } })).mockResolvedValueOnce(Response.json({ errors: { requests: "Daily quota reached" }, response: [] }));
    const provider = new ApiFootballProvider("key", 1000, request);
    await expect(provider.getLiveMatches()).rejects.toMatchObject({ retryAfterMs: 300_000 });
    await expect(provider.getLiveMatches()).rejects.toMatchObject({ retryAfterMs: 900_000 });
  });
  it("handles timeout and malformed payloads without treating them as empty live state", async () => {
    const request = vi.fn<typeof fetch>().mockRejectedValueOnce(new DOMException("timeout", "TimeoutError")).mockResolvedValueOnce(Response.json({ response: null })).mockResolvedValueOnce(Response.json({ response: [null] })).mockResolvedValueOnce(Response.json({ response: [] }));
    const provider = new ApiFootballProvider("key", 1000, request);
    await expect(provider.getLiveMatches()).rejects.toThrow("timed out");
    await expect(provider.getLiveMatches()).rejects.toThrow("malformed response");
    await expect(provider.getLiveMatches()).rejects.toThrow("no valid live fixtures");
    await expect(provider.getLiveMatches()).resolves.toEqual([]);
  });
});
