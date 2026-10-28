import { describe, expect, it } from 'vitest';
import { DEFAULT_LACTO_FORM, historyDraft, planFromForm } from '@sourdough/calc/lib/lactoForm';
import { FALLBACK_HARDNESS } from '@sourdough/calc/lib/hardnessUtils';
import { HISTORY_TUNING_WINDOW_MS, record } from './recorder';
import { loadHistory } from './store';

const env = { hourlyForecast: null, currentTemp: null, fermTempOverride: 21, hardness: FALLBACK_HARDNESS, unitSystem: 'metric' as const };
const draftFor = (over = {}) => {
  const f = { ...DEFAULT_LACTO_FORM, ...over };
  return historyDraft(f, planFromForm(f, env))!;
};
const t0 = new Date('2026-10-28T10:00:00Z');
const later = (ms: number) => new Date(t0.getTime() + ms);

describe('history recorder', () => {
  it('records the first ferment', () => {
    const r = record([], draftFor(), null, t0);
    expect(r.history).toHaveLength(1);
    expect(r.history[0]!.vegName).toBe('Green Cabbage');
  });

  it('replaces the entry for the same jar tuned a moment later', () => {
    const a = record([], draftFor(), null, t0);
    const b = record(a.history, draftFor({ saltPct: '2.5' }), a.last, later(60_000));
    expect(b.history).toHaveLength(1);
    expect(b.history[0]!.saltPct).toBe('2.5');
  });

  it('keeps both when it is a different vegetable, or long after', () => {
    const a = record([], draftFor(), null, t0);
    const carrots = record(a.history, draftFor({ vegId: 'carrot', saltPct: '2.0', vegWeight: '500' }), a.last, later(60_000));
    expect(carrots.history).toHaveLength(2);
    const long = record(a.history, draftFor({ saltPct: '2.5' }), a.last, later(HISTORY_TUNING_WINDOW_MS + 1000));
    expect(long.history).toHaveLength(2);
  });

  it('does not duplicate an identical ferment', () => {
    const a = record([], draftFor(), null, t0);
    const b = record(a.history, draftFor(), null, later(5 * 3600_000));
    expect(b.history).toHaveLength(1);
  });
});

describe('stored history', () => {
  it('loads nothing from storage that is missing or corrupt', () => {
    expect(loadHistory()).toEqual([]);
  });
});
