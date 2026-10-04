import type { FixtureListing, LiveMatch } from "../src/domain/match";
import { IddaaFixtureProvider, listedMatchIds, type ListedFixture } from "../src/providers/iddaa";
import type { StateStorage } from "./coordinator";

const REFRESH_MS = 5 * 60_000;
const MAX_AGE_MS = 10 * 60_000;
type CatalogueState = { fixtures: ListedFixture[]; updatedAt: number | null; nextAttemptAt: number; failures: number; error: string | null };

/** Separate persistent cache: catalogue failures never spend football quota or erase matches. */
export class FixtureCatalogue {
  private inFlight?: Promise<CatalogueState>;
  constructor(private storage: StateStorage, private provider: Pick<IddaaFixtureProvider, "getFixtures"> = new IddaaFixtureProvider(), private now: () => number = Date.now) {}

  async getListing(matches: LiveMatch[]): Promise<FixtureListing> {
    this.inFlight ??= this.refresh().finally(() => { this.inFlight = undefined; });
    const state = await this.inFlight;
    const available = state.updatedAt !== null && this.now() - state.updatedAt < MAX_AGE_MS;
    return {
      source: "iddaa", country: "Turkey", available,
      updatedAt: state.updatedAt === null ? null : new Date(state.updatedAt).toISOString(),
      expiresAt: state.updatedAt === null ? null : new Date(state.updatedAt + MAX_AGE_MS).toISOString(),
      error: state.error,
      listedMatchIds: available ? listedMatchIds(matches, state.fixtures) : [],
      fixtureCount: available ? state.fixtures.length : 0,
    };
  }

  private async refresh(): Promise<CatalogueState> {
    const now = this.now();
    const state = await this.storage.get<CatalogueState>("iddaa-catalogue") ?? { fixtures: [], updatedAt: null, nextAttemptAt: 0, failures: 0, error: null };
    if (state.nextAttemptAt > now) return state;
    // Reserve the next attempt before fetch so a restart cannot cause a request storm.
    state.nextAttemptAt = now + REFRESH_MS;
    await this.storage.put("iddaa-catalogue", state);
    try {
      state.fixtures = await this.provider.getFixtures();
      state.updatedAt = this.now();
      state.failures = 0;
      state.error = null;
      state.nextAttemptAt = this.now() + REFRESH_MS;
    } catch {
      state.failures++;
      state.error = "İddaa fixture listings are temporarily unavailable.";
      state.nextAttemptAt = this.now() + REFRESH_MS * Math.min(6, 2 ** (state.failures - 1));
    }
    await this.storage.put("iddaa-catalogue", state);
    return state;
  }
}
