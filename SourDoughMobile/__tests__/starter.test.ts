/**
 * Starter-culture tests.
 *
 * A starter acts on the LAG phase — the slow, risky start while the
 * spontaneous flora establishes itself — so it is modelled additively (a
 * fixed saving in days), not as a percentage. Measured: pH below 4.0 within
 * 24 h with a starter against ~3 days spontaneous (Müller et al. 2018,
 * Food Microbiol. 76:473). The endpoint evidence is mixed, so the saving is
 * capped and never dominates the estimate.
 */
import {
  estimateFermentTiming,
  temperatureTimeFactor,
  STARTER_LAG_SAVING_DAYS,
  STARTER_MAX_SHARE,
  lactoAdvice,
} from '../src/lib/lactoCalculations';

const RECIPE = { typicalDays: 10 };

describe('starter culture', () => {
  it('is neutral when no starter is used — the documented duration stands', () => {
    const plain = estimateFermentTiming(22, RECIPE);
    expect(plain.days).toBe(10);
    expect(plain.factors.map((f) => f.id)).not.toContain('starter');
  });

  it('saves a fixed number of days rather than a fixed percentage', () => {
    // Both are long enough that the 33% share cap does not bind.
    const short = estimateFermentTiming(22, { typicalDays: 7, starter: true });
    const long = estimateFermentTiming(22, { typicalDays: 20, starter: true });

    expect(7 - short.days).toBeCloseTo(STARTER_LAG_SAVING_DAYS, 1);
    expect(20 - long.days).toBeCloseTo(STARTER_LAG_SAVING_DAYS, 1);
    // A proportional model would have saved ~5 days on the 20-day ferment.
    expect(20 - long.days).toBeLessThan(3);
  });

  it('scales the saving with temperature, because the lag is a growth process', () => {
    const warm = estimateFermentTiming(22, { ...RECIPE, starter: true });
    const cool = estimateFermentTiming(14, { ...RECIPE, starter: true });
    const warmSaving = 10 - warm.days;
    const coolSaving = (10 * temperatureTimeFactor(14)) - cool.days;
    expect(coolSaving).toBeGreaterThan(warmSaving);
  });

  it('never accounts for more than a third of the estimate', () => {
    // A very short ferment cannot be halved by adding a starter.
    const tiny = estimateFermentTiming(22, { typicalDays: 2, starter: true });
    expect(tiny.days).toBeGreaterThanOrEqual(2 * (1 - STARTER_MAX_SHARE) - 0.11);
    expect(tiny.days).toBeGreaterThanOrEqual(1);
  });

  it('reports itself as a day delta, not a multiplier', () => {
    const timing = estimateFermentTiming(22, { ...RECIPE, starter: true });
    const starter = timing.factors.find((f) => f.id === 'starter');
    expect(starter).toBeDefined();
    expect(starter!.daysDelta).toBeLessThan(0);
    expect(starter!.factor).toBe(1); // must not double-count in the product
    expect(starter!.detail).toContain('lag phase');
  });

  it('composes correctly with a cold kitchen (additive on top of multiplicative)', () => {
    const cold = estimateFermentTiming(14, { ...RECIPE, starter: true });
    const coldNoStarter = estimateFermentTiming(14, RECIPE);
    // Saving must be exactly the additive term, applied after the temperature scaling.
    expect(coldNoStarter.days - cold.days).toBeCloseTo(
      Math.min(STARTER_LAG_SAVING_DAYS * temperatureTimeFactor(14), 10 * STARTER_MAX_SHARE),
      1,
    );
  });

  it('tells the user the endpoint evidence is mixed', () => {
    const tips = lactoAdvice('dry', 2.0, 22, 8, 'metric', 'Cabbage', { min: 1.5, max: 3.0 }, 'shredded', 'shredded', undefined, true);
    const text = tips.join(' ');
    expect(text).toContain('Starter culture');
    expect(text).toContain('faster start');
    expect(text).toContain('mixed');
    // No starter, no starter advice.
    const plain = lactoAdvice('dry', 2.0, 22, 8, 'metric', 'Cabbage', { min: 1.5, max: 3.0 }, 'shredded', 'shredded', undefined, false);
    expect(plain.join(' ')).not.toContain('Starter culture');
  });
});
