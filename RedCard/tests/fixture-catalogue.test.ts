import { describe, expect, it, vi } from "vitest";
import { IddaaFixtureProvider, IDDAA_FIXTURES_URL, listedMatchIds, normalizeIddaaFixtures, type ListedFixture } from "@/providers/iddaa";
import { normalizeFixture } from "@/providers/api-football";
import { mockMatches } from "@/providers/mock-football";
import { FixtureCatalogue } from "../worker/fixture-catalogue";
import type { StateStorage } from "../worker/coordinator";

const kickoffAt = "2026-10-04T10:15:00.000Z";
const event = { i: 3180657, sid: 1, hn: "Twente (K)", an: "FC Utrecht (K)", d: Date.parse(kickoffAt) / 1000, m: [{ odds: "must not be retained" }] };
const payload = (events: unknown[] = [event]) => ({ isSuccess: true, data: { isdiff: false, events } });
const match = (id = "1", home = "Twente W", away = "Utrecht W") => ({ ...mockMatches()[0], id, kickoffAt, competition: { id: "99", name: "Eredivisie Women" }, home: { ...mockMatches()[0].home, name: home }, away: { ...mockMatches()[0].away, name: away } });
const fixture: ListedFixture = { id: "3180657", home: event.hn, away: event.an, kickoffAt };

describe("İddaa fixture identities", () => {
  it("extracts only football identity, excluding markets and other sports", () => {
    expect(normalizeIddaaFixtures(payload([event, { ...event, i: 2, sid: 2 }, null]))).toEqual([fixture]);
  });
  it("requires a full successful catalogue, and does not silently accept broken data", () => {
    expect(() => normalizeIddaaFixtures({ ...payload(), isSuccess: false })).toThrow();
    expect(() => normalizeIddaaFixtures({ isSuccess: true, data: { isdiff: true, events: [event] } })).toThrow();
    expect(() => normalizeIddaaFixtures(payload([{ ...event, d: 1e99 }]))).toThrow();
    expect(normalizeIddaaFixtures(payload([]))).toEqual([]);
  });
  it("matches women's suffixes and club prefixes while retaining gender and age", () => {
    expect(listedMatchIds([match()], [fixture])).toEqual(["1"]);
    const men = { ...match("men", "Twente", "Utrecht"), competition: { id: "2", name: "Eredivisie" } };
    expect(listedMatchIds([men, match("youth", "Twente U19 W", "Utrecht U19 W")], [fixture])).toEqual([]);
    expect(listedMatchIds([match("unmarked", "Twente", "Utrecht")], [fixture])).toEqual(["unmarked"]);
  });
  it("normalizes Turkish diacritics but preserves reserve-team and kickoff identity", () => {
    const senior = { ...match("tr", "Besiktas", "Fenerbahce"), competition: { id: "203", name: "Süper Lig" } };
    const listed = { ...fixture, home: "Beşiktaş", away: "Fenerbahçe" };
    expect(listedMatchIds([senior], [listed])).toEqual(["tr"]);
    expect(listedMatchIds([{ ...senior, home: { ...senior.home, name: "Besiktas B" } }], [listed])).toEqual([]);
    expect(listedMatchIds([{ ...senior, kickoffAt: "2026-10-05T10:15:00.000Z" }], [listed])).toEqual([]);
    expect(listedMatchIds([{ ...senior, kickoffAt: undefined }], [listed])).toEqual([]);
    const reserves = { ...senior, home: { ...senior.home, name: "Besiktas II" } };
    expect(listedMatchIds([reserves], [{ ...listed, home: "Beşiktaş B" }])).toEqual(["tr"]);
    expect(listedMatchIds([{ ...reserves, home: { ...reserves.home, name: "Besiktas U21" } }], [{ ...listed, home: "Beşiktaş B" }])).toEqual([]);
  });
  it("rejects reversed teams, duplicate candidates and duplicate live identities", () => {
    expect(listedMatchIds([match()], [{ ...fixture, home: fixture.away, away: fixture.home }])).toEqual([]);
    expect(listedMatchIds([match()], [fixture, { ...fixture, id: "other" }])).toEqual([]);
    expect(listedMatchIds([match("one"), match("two")], [fixture])).toEqual([]);
  });
  it("retains the football provider's actual kickoff without inventing missing dates", () => {
    const raw = { fixture: { id: 1, timestamp: Date.parse(kickoffAt) / 1000, status: { short: "1H" } }, teams: { home: { id: 1, name: "Twente W" }, away: { id: 2, name: "Utrecht W" } } };
    expect(normalizeFixture(raw)?.kickoffAt).toBe(kickoffAt);
    expect(normalizeFixture({ ...raw, fixture: { ...raw.fixture, timestamp: undefined } })?.kickoffAt).toBeUndefined();
    expect(normalizeFixture({ ...raw, fixture: { ...raw.fixture, timestamp: 1e99 } })?.kickoffAt).toBeUndefined();
  });
  it("makes one unauthenticated programme request and fails closed on HTTP errors", async () => {
    const request = vi.fn<typeof fetch>().mockResolvedValueOnce(Response.json(payload())).mockResolvedValueOnce(new Response(null, { status: 429 }));
    const provider = new IddaaFixtureProvider(request);
    await expect(provider.getFixtures()).resolves.toEqual([fixture]);
    expect(request).toHaveBeenCalledWith(IDDAA_FIXTURES_URL, expect.objectContaining({ cache: "no-store" }));
    expect(request.mock.calls[0][1]).not.toHaveProperty("headers");
    await expect(provider.getFixtures()).rejects.toThrow();
  });
});

class MemoryStorage implements StateStorage {
  data = new Map<string, unknown>();
  async get<T>(key: string) { return structuredClone(this.data.get(key)) as T | undefined; }
  async put<T>(key: string, value: T) { this.data.set(key, structuredClone(value)); }
  async setAlarm() { throw new Error("Catalogue must not change the football alarm"); }
}

describe("shared fixture catalogue cache", () => {
  it("shares calls across visitors and restarts, then refreshes after five minutes", async () => {
    let now = Date.parse(kickoffAt);
    const storage = new MemoryStorage();
    const getFixtures = vi.fn(async () => [fixture]);
    const create = () => new FixtureCatalogue(storage, { getFixtures }, () => now);
    const catalogue = create();
    const listings = await Promise.all(Array.from({ length: 50 }, () => catalogue.getListing([match()])));
    expect(getFixtures).toHaveBeenCalledTimes(1);
    expect(listings[0]).toMatchObject({ available: true, listedMatchIds: ["1"], fixtureCount: 1 });
    await create().getListing([match()]);
    expect(getFixtures).toHaveBeenCalledTimes(1);
    now += 5 * 60_000;
    await create().getListing([match()]);
    expect(getFixtures).toHaveBeenCalledTimes(2);
    expect(storage.data.has("state")).toBe(false);
  });
  it("retains recent listings on failure, expires them, backs off and recovers", async () => {
    let now = Date.parse(kickoffAt);
    const getFixtures = vi.fn(async () => [fixture]);
    const catalogue = new FixtureCatalogue(new MemoryStorage(), { getFixtures }, () => now);
    await catalogue.getListing([match()]);
    getFixtures.mockRejectedValue(new Error("source down"));
    now += 5 * 60_000;
    expect(await catalogue.getListing([match()])).toMatchObject({ available: true, listedMatchIds: ["1"], error: expect.any(String) });
    now += 5 * 60_000;
    expect(await catalogue.getListing([match()])).toMatchObject({ available: false, listedMatchIds: [] });
    now += 5 * 60_000;
    await catalogue.getListing([match()]);
    expect(getFixtures).toHaveBeenCalledTimes(3);
    getFixtures.mockResolvedValue([fixture]);
    now += 5 * 60_000;
    expect(await catalogue.getListing([match()])).toMatchObject({ available: true, error: null });
  });
  it("does not report zero fixtures as a successful response when the source never loaded", async () => {
    const catalogue = new FixtureCatalogue(new MemoryStorage(), { getFixtures: async () => { throw new Error("unavailable"); } });
    expect(await catalogue.getListing([match()])).toMatchObject({ available: false, updatedAt: null, listedMatchIds: [], error: expect.any(String) });
  });
});
