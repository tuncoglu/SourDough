import type { LiveSnapshot } from "../src/domain/match";
import type { NewDismissalEvent } from "../src/domain/dismissal";
import { ProviderError, type FootballProvider } from "../src/providers/football-provider";

export interface StateStorage {
  get<T>(key: string): Promise<T | undefined>;
  put<T>(key: string, value: T): Promise<void>;
  setAlarm(time: number): Promise<void>;
}
type StoredState = {
  revision?: string;
  snapshot: Omit<LiveSnapshot, "nextPollAt">;
  nextPollAt: number;
  quota: { day: string; used: number };
  failures: number;
  seen: Record<string, { at: number; ids: string[] }>;
};
const DAY = 86_400_000;

/** One globally named Durable Object owns this coordinator and its persisted budget. */
export class LiveCoordinator {
  private inFlight?: Promise<LiveSnapshot>;
  constructor(
    private storage: StateStorage,
    private provider: FootballProvider,
    private intervalMs: number,
    private dailyLimit: number,
    private now: () => number = Date.now,
    private onDismissal: (event: NewDismissalEvent) => void = () => {},
    private revision = "1",
  ) {}

  pollIfDue(): Promise<LiveSnapshot> {
    if (this.inFlight) return this.inFlight;
    this.inFlight = this.update().finally(() => { this.inFlight = undefined; });
    return this.inFlight;
  }

  private async update(): Promise<LiveSnapshot> {
    const now = this.now();
    const day = new Date(now).toISOString().slice(0, 10);
    const state = await this.storage.get<StoredState>("state") ?? {
      revision: this.revision,
      snapshot: { matches: [], provider: this.provider.name, lastSuccessfulPoll: null, lastAttemptAt: null, error: null, staleAfterMs: this.intervalMs + 90_000, pollIntervalMs: this.intervalMs },
      nextPollAt: 0, quota: { day, used: 0 }, failures: 0, seen: {},
    };
    state.snapshot.pollIntervalMs = this.intervalMs;
    state.snapshot.staleAfterMs = this.intervalMs + 90_000;
    if (state.revision !== this.revision) {
      state.revision = this.revision;
      // A repaired deployment can recover once from a failed snapshot. Keep its budget.
      if (state.snapshot.error) state.nextPollAt = now;
      await this.storage.put("state", state);
    }
    const snapshot = (): LiveSnapshot => ({ ...state.snapshot, nextPollAt: new Date(state.nextPollAt).toISOString() });
    if (state.nextPollAt > now) {
      // Repair a missing alarm after a restart without making an extra upstream request.
      await this.storage.setAlarm(state.nextPollAt);
      return snapshot();
    }
    if (state.quota.day !== day) state.quota = { day, used: 0 };
    if (state.quota.used >= this.dailyLimit) {
      state.snapshot.error = "Daily request budget reached; updates resume after midnight UTC.";
      state.nextPollAt = (Math.floor(now / DAY) + 1) * DAY + 1000;
      await this.storage.put("state", state);
      await this.storage.setAlarm(state.nextPollAt);
      return snapshot();
    }

    // Reserve durably BEFORE fetch. Alarm retries, visitors and redeploys share this budget.
    state.quota.used++;
    state.snapshot.lastAttemptAt = new Date(now).toISOString();
    state.nextPollAt = now + this.intervalMs;
    await this.storage.put("state", state);
    await this.storage.setAlarm(state.nextPollAt);
    const detected: NewDismissalEvent[] = [];
    try {
      const matches = await this.provider.getLiveMatches();
      const completed = this.now();
      for (const [id, seen] of Object.entries(state.seen)) if (completed - seen.at > DAY) delete state.seen[id];
      for (const match of matches) {
        const seen = state.seen[match.id] ?? { at: completed, ids: [] };
        const ids = new Set(seen.ids);
        for (const dismissal of match.dismissals) {
          if (ids.has(dismissal.id)) continue;
          ids.add(dismissal.id);
          detected.push({ matchId: match.id, dismissal, detectedAt: new Date(completed).toISOString() });
        }
        state.seen[match.id] = { at: completed, ids: [...ids] };
      }
      state.snapshot.matches = matches;
      state.snapshot.lastSuccessfulPoll = new Date(completed).toISOString();
      state.snapshot.error = null;
      state.failures = 0;
      state.nextPollAt = completed + this.intervalMs;
    } catch (error) {
      state.failures++;
      state.snapshot.error = error instanceof ProviderError ? error.message : "Football provider is temporarily unavailable.";
      state.nextPollAt = this.now() + Math.max(this.intervalMs * Math.min(4, 2 ** (state.failures - 1)), error instanceof ProviderError ? error.retryAfterMs ?? 0 : 0);
    }
    await this.storage.put("state", state);
    await this.storage.setAlarm(state.nextPollAt);
    // State persists before optional notification hooks, so retries cannot emit duplicates.
    for (const event of detected) { try { this.onDismissal(event); } catch { /* Observer must not break polling. */ } }
    return snapshot();
  }
}
