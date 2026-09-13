/**
 * Ferment-history bookkeeping.
 *
 * History has no save button, so the rules that keep it useful are the whole
 * feature: merge repeat calculations of the same jar, drop anything older than
 * a year, and never grow past the cap.
 */
import {
  addFerment,
  fermentSignature,
  fermentSummary,
  pruneFerments,
  FERMENT_HISTORY_CAP,
  FERMENT_RETENTION_DAYS,
} from '../src/lib/fermentHistory';
import { FermentHistoryEntry } from '../src/models/types';

const NOW = new Date('2026-09-13T12:00:00Z');

function entry(overrides: Partial<FermentHistoryEntry> = {}): FermentHistoryEntry {
  return {
    id: `e${Math.random().toString(36).slice(2, 8)}`,
    createdAt: NOW.toISOString(),
    presetName: 'Hot Sauce / Pepper Mash',
    presetEmoji: '🌶️',
    method: 'mash',
    vegName: 'Jalapeño',
    fermentType: 'hot-sauce',
    vegId: 'jalapeno',
    vegWeight: '300',
    waterAmount: '0',
    saltPct: '3',
    saltType: 'rock-salt',
    prepSize: 'grated',
    useStarter: false,
    vegMix: [],
    results: { saltGrams: 9, estimatedDays: 10, tempC: 22 },
    signature: 'sig-a',
    ...overrides,
  };
}

const daysAgo = (n: number) => new Date(NOW.getTime() - n * 86400000).toISOString();

describe('fermentSignature', () => {
  const base = {
    fermentType: 'hot-sauce', method: 'mash', vegId: 'jalapeno', vegWeight: '300',
    waterAmount: '0', saltPct: '3', saltType: 'rock-salt', prepSize: 'grated',
    useStarter: false, vegMix: [],
  };

  it('is stable for the same ferment', () => {
    expect(fermentSignature(base)).toBe(fermentSignature({ ...base }));
  });

  it('is order-independent for a mixed jar', () => {
    const a = fermentSignature({ ...base, vegMix: [{ vegId: 'carrot', grams: '100' }, { vegId: 'onion', grams: '50' }] });
    const b = fermentSignature({ ...base, vegMix: [{ vegId: 'onion', grams: '50' }, { vegId: 'carrot', grams: '100' }] });
    expect(a).toBe(b);
  });

  it('changes when anything that defines the ferment changes', () => {
    const baseSig = fermentSignature(base);
    expect(fermentSignature({ ...base, saltPct: '4' })).not.toBe(baseSig);
    expect(fermentSignature({ ...base, prepSize: 'whole' })).not.toBe(baseSig);
    expect(fermentSignature({ ...base, useStarter: true })).not.toBe(baseSig);
    expect(fermentSignature({ ...base, vegWeight: '400' })).not.toBe(baseSig);
  });
});

describe('pruneFerments (12-month rotation)', () => {
  it('keeps entries inside the window and drops older ones', () => {
    const kept = entry({ createdAt: daysAgo(FERMENT_RETENTION_DAYS - 1) });
    const dropped = entry({ createdAt: daysAgo(FERMENT_RETENTION_DAYS + 1) });
    const result = pruneFerments([kept, dropped], NOW);
    expect(result.map((e) => e.id)).toEqual([kept.id]);
  });

  it('keeps an entry from exactly a year ago', () => {
    const edge = entry({ createdAt: daysAgo(FERMENT_RETENTION_DAYS) });
    expect(pruneFerments([edge], NOW)).toHaveLength(1);
  });

  it('drops unreadable dates rather than showing a broken row', () => {
    expect(pruneFerments([entry({ createdAt: 'not-a-date' })], NOW)).toHaveLength(0);
  });
});

describe('addFerment', () => {
  it('puts the newest first', () => {
    const older = entry({ signature: 'a' });
    const newer = entry({ signature: 'b' });
    expect(addFerment([older], newer, NOW).map((e) => e.signature)).toEqual(['b', 'a']);
  });

  it('merges a repeat calculation of the SAME ferment instead of duplicating', () => {
    // Pressing Calculate twice, or recalculating as the weather changes, is
    // not a second ferment.
    const first = entry({ signature: 'same', results: { saltGrams: 9, estimatedDays: 10, tempC: 22 } });
    const again = entry({ signature: 'same', results: { saltGrams: 9, estimatedDays: 22, tempC: 16.3 } });
    const result = addFerment([first], again, NOW);
    expect(result).toHaveLength(1);
    expect(result[0].results.estimatedDays).toBe(22);
    expect(result[0].results.tempC).toBe(16.3);
  });

  it('keeps a genuine repeat made later, once something else is on top', () => {
    const first = entry({ signature: 'same' });
    const other = entry({ signature: 'other' });
    const remade = entry({ signature: 'same' });
    // other is newest, so re-making the first recipe is a new event
    expect(addFerment([other, first], remade, NOW)).toHaveLength(3);
  });

  it('never exceeds the cap', () => {
    let list: FermentHistoryEntry[] = [];
    for (let i = 0; i < FERMENT_HISTORY_CAP + 25; i++) {
      list = addFerment(list, entry({ signature: `s${i}` }), NOW);
    }
    expect(list).toHaveLength(FERMENT_HISTORY_CAP);
    // The newest survive; the oldest are trimmed.
    expect(list[0].signature).toBe(`s${FERMENT_HISTORY_CAP + 24}`);
  });

  it('rotates out old entries as new ones arrive', () => {
    const stale = entry({ signature: 'stale', createdAt: daysAgo(FERMENT_RETENTION_DAYS + 30) });
    const fresh = entry({ signature: 'fresh' });
    expect(addFerment([stale], fresh, NOW).map((e) => e.signature)).toEqual(['fresh']);
  });
});

describe('fermentSummary', () => {
  it('reads as a one-line description of what was made', () => {
    expect(fermentSummary(entry())).toBe('300 g Jalapeño · 3% salt');
    expect(fermentSummary(entry({ useStarter: true }))).toContain('starter');
  });
});
