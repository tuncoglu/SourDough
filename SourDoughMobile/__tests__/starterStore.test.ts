/**
 * The feeding log's storage: marking a peak must change only that feeding,
 * and records written before the new fields existed must still load.
 */
const mem = new Map<string, string>();
jest.mock('@react-native-async-storage/async-storage', () => ({
  __esModule: true,
  default: {
    getItem: jest.fn(async (k: string) => mem.get(k) ?? null),
    setItem: jest.fn(async (k: string, v: string) => { mem.set(k, v); }),
    removeItem: jest.fn(async (k: string) => { mem.delete(k); }),
  },
}));

import { loadFeedings, logFeeding, markPeaked, getLastFeeding } from '../src/store/starterStore';
import type { StarterFeeding } from '../src/models/types';

const feed = (id: string, timestamp: string, over: Partial<StarterFeeding> = {}): StarterFeeding => ({
  id,
  timestamp,
  flourUsed: 'Generic: Bread Flour',
  flourGrams: 50,
  waterGrams: 50,
  ...over,
});

beforeEach(() => mem.clear());

describe('starter store', () => {
  it('marks only the feeding it is told to as peaked', async () => {
    await logFeeding(feed('a', '2026-10-20T08:00:00Z'));
    await logFeeding(feed('b', '2026-10-27T08:00:00Z'));
    await markPeaked('a', new Date('2026-10-20T15:12:00Z'));
    const list = await loadFeedings();
    expect(list.map((f) => f.id)).toEqual(['b', 'a']); // newest first
    expect(list.find((f) => f.id === 'a')!.peakedAt).toBe('2026-10-20T15:12:00.000Z');
    expect(list.find((f) => f.id === 'b')!.peakedAt).toBeUndefined();
  });

  it('does nothing for a feeding that is not in the log', async () => {
    await logFeeding(feed('a', '2026-10-20T08:00:00Z'));
    await markPeaked('missing');
    expect((await loadFeedings())[0].peakedAt).toBeUndefined();
  });

  it('keeps the feed size, kitchen and several flours on the record', async () => {
    await logFeeding(
      feed('a', '2026-10-20T08:00:00Z', {
        starterKeptGrams: 50,
        roomTempC: 20.5,
        flours: [{ label: 'White', grams: 30 }, { label: 'Rye', grams: 20 }],
      }),
    );
    const last = (await getLastFeeding())!;
    expect(last.starterKeptGrams).toBe(50);
    expect(last.roomTempC).toBe(20.5);
    expect(last.flours).toHaveLength(2);
  });

  it('still loads a record written before those fields existed', async () => {
    mem.set('sourdough_feedings', JSON.stringify([{ id: 'old', timestamp: '2026-01-01T08:00:00Z', flourUsed: 'Rye', flourGrams: 40, waterGrams: 40 }]));
    const list = await loadFeedings();
    expect(list).toHaveLength(1);
    expect(list[0].starterKeptGrams).toBeUndefined();
  });
});
