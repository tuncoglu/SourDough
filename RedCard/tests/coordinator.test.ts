import { describe, expect, it, vi } from "vitest";
import { LiveCoordinator, type StateStorage } from "../worker/coordinator";
import { ProviderError } from "../src/providers/football-provider";
import { mockMatches } from "../src/providers/mock-football";

class MemoryStorage implements StateStorage {
  values = new Map<string, unknown>();
  alarm = 0;
  async get<T>(key: string): Promise<T | undefined> { return structuredClone(this.values.get(key)) as T | undefined; }
  async put<T>(key: string, value: T): Promise<void> { this.values.set(key, structuredClone(value)); }
  async setAlarm(time: number): Promise<void> { this.alarm = time; }
}
const interval = 1_200_000;
function setup(limit = 85) {
  const storage = new MemoryStorage();
  let now = Date.UTC(2026, 9, 3, 12);
  const getLiveMatches = vi.fn().mockResolvedValue(mockMatches());
  const notify = vi.fn();
  const provider = { name: "test", getLiveMatches };
  const create = () => new LiveCoordinator(storage, provider, interval, limit, () => now, notify);
  return { storage, getLiveMatches, notify, create, advance: (ms = interval) => { now += ms; } };
}

describe("shared durable polling and quota", () => {
  it("collapses concurrent visits to one call and reuses state through restarts", async () => {
    const s = setup();
    const worker = s.create();
    const results = await Promise.all(Array.from({ length: 50 }, () => worker.pollIfDue()));
    expect(s.getLiveMatches).toHaveBeenCalledTimes(1);
    expect(results[0].matches).toHaveLength(7);
    await s.create().pollIfDue();
    expect(s.getLiveMatches).toHaveBeenCalledTimes(1);
    s.advance();
    await s.create().pollIfDue();
    expect(s.getLiveMatches).toHaveBeenCalledTimes(2);
  });
  it("persists the reservation before fetch, so interrupted work cannot bypass its budget", async () => {
    const s = setup();
    s.getLiveMatches.mockImplementationOnce(async () => {
      const stored = await s.storage.get<{ quota: { used: number }; nextPollAt: number }>("state");
      expect(stored?.quota.used).toBe(1);
      expect(stored?.nextPollAt).toBe(s.storage.alarm);
      expect(s.storage.alarm).toBeGreaterThan(Date.UTC(2026, 9, 3, 12));
      return [];
    });
    await s.create().pollIfDue();
  });
  it("caps requests across restarts and resets at midnight UTC", async () => {
    const s = setup(2);
    await s.create().pollIfDue();
    s.advance();
    await s.create().pollIfDue();
    s.advance();
    const capped = await s.create().pollIfDue();
    expect(s.getLiveMatches).toHaveBeenCalledTimes(2);
    expect(capped.error).toContain("budget reached");
    expect(capped.matches).toHaveLength(7);
    s.advance(86_400_000);
    expect((await s.create().pollIfDue()).error).toBeNull();
    expect(s.getLiveMatches).toHaveBeenCalledTimes(3);
  });
  it("preserves the last good snapshot and backs off on provider failure", async () => {
    const s = setup();
    const first = await s.create().pollIfDue();
    s.advance();
    s.getLiveMatches.mockRejectedValueOnce(new ProviderError("Rate limit reached", interval * 3));
    const failed = await s.create().pollIfDue();
    expect(failed.matches).toEqual(first.matches);
    expect(failed.lastSuccessfulPoll).toBe(first.lastSuccessfulPoll);
    expect(failed.error).toBe("Rate limit reached");
    s.advance();
    await s.create().pollIfDue();
    expect(s.getLiveMatches).toHaveBeenCalledTimes(2);
  });
  it("deduplicates notifications after restarts and temporarily omitted events", async () => {
    const s = setup();
    await s.create().pollIfDue();
    const count = s.notify.mock.calls.length;
    expect(count).toBe(8);
    s.advance();
    s.getLiveMatches.mockResolvedValueOnce([]);
    await s.create().pollIfDue();
    s.advance();
    await s.create().pollIfDue();
    expect(s.notify).toHaveBeenCalledTimes(count);
  });
});
