/**
 * Advice-only warnings that came out of the evidence review. These are not
 * rate effects — each is a measured quality/safety failure mode that the
 * timing model deliberately does not encode, so they are asserted on the copy
 * the user actually reads.
 */
import { lactoAdvice, readinessPH, waterHardnessFermentAdvice } from '../src/lib/lactoCalculations';

const advice = (opts: { temp?: number; bloaterProne?: boolean; veg?: string } = {}) =>
  lactoAdvice(
    'brine', 3.5, opts.temp ?? 22, 7, 'metric', opts.veg ?? 'Pickling cucumber',
    { min: 3.0, max: 5.0 }, 'whole', 'whole', undefined, false, opts.bloaterProne ?? true,
  ).join(' ');

describe('bloater (CO2) warning for cucumbers', () => {
  it('fires above 27 °C with the measured contrast', () => {
    const text = advice({ temp: 30 });
    expect(text).toContain('bloat');
    expect(text).toContain('24.5%');
    expect(text).toContain('48.0%');
    // It must read as damage, not as a speed penalty.
    expect(text).toContain('identical final acidity');
  });

  it('stays quiet at normal pickle temperatures', () => {
    expect(advice({ temp: 22 })).not.toContain('bloat');
  });

  it('only applies to cucumber-family vegetables', () => {
    expect(advice({ temp: 30, bloaterProne: false, veg: 'Green Cabbage' })).not.toContain('bloat');
  });
});

describe('cool-ferment readiness', () => {
  it('quotes a readiness pH for cool ferments, including a cellar', () => {
    [16, 12, 10].forEach((temp) => {
      const text = advice({ temp, bloaterProne: false });
      expect(`${temp}: ${text.includes('taste ready around pH')}`).toBe(`${temp}: true`);
      expect(text).toContain(String(readinessPH(temp).toFixed(1)));
    });
  });

  it('does not appear at or above the 22°C reference', () => {
    [22, 24, 28].forEach((temp) => {
      expect(`${temp}: ${advice({ temp, bloaterProne: false }).includes('taste ready around pH')}`).toBe(`${temp}: false`);
    });
  });
});

describe('advice hygiene', () => {
  it('never repeats a line — duplicated blocks have shipped before', () => {
    // Every method/temperature combination must produce each tip once.
    const combos = [
      lactoAdvice('brine', 3.5, 22, 7, 'metric', 'Cucumber', { min: 3, max: 5 }, 'whole', 'whole', undefined, true, true),
      lactoAdvice('dry', 2.0, 14, 20, 'metric', 'Cabbage', { min: 1.5, max: 3 }, 'whole', 'shredded', undefined, false, false),
      lactoAdvice('mash', 3.0, 30, 10, 'metric', 'Chilli', { min: 2.5, max: 5 }, 'grated', 'grated', { acidLimited: true, measuredEndPH: 4.3, ratio: 0.91, aceticTrap: true, unknown: false }, true, false),
    ];
    combos.forEach((tips) => {
      const dupes = tips.filter((line, i) => tips.indexOf(line) !== i);
      expect(dupes).toEqual([]);
    });
  });
});

describe('readiness pH (temperature-dependent)', () => {
  it('reproduces the two measured anchors exactly', () => {
    expect(readinessPH(4)).toBeCloseTo(4.97, 2);
    expect(readinessPH(20)).toBeCloseTo(4.41, 2);
  });

  it('interpolates between them, and colder means less sour', () => {
    const cool = readinessPH(10);
    expect(cool).toBeGreaterThan(4.41);
    expect(cool).toBeLessThan(4.97);
    expect(readinessPH(6)).toBeGreaterThan(readinessPH(14));
  });

  it('clamps rather than extrapolating beyond the measured range', () => {
    expect(readinessPH(0)).toBeCloseTo(4.97, 2);   // fridge
    expect(readinessPH(-5)).toBeCloseTo(4.97, 2);
    expect(readinessPH(30)).toBeCloseTo(4.41, 2);  // warm room
    expect(readinessPH(45)).toBeCloseTo(4.41, 2);
  });

  it('is a HIGHER pH than the warm-ferment stability target when cold', () => {
    // This is the whole point: a cold ferment tastes ready above pH 4.0.
    expect(readinessPH(4)).toBeGreaterThan(4.0);
    expect(readinessPH(8)).toBeGreaterThan(4.0);
  });

  it('quotes the temperature-adjusted figure in the advice', () => {
    const text = lactoAdvice('brine', 3.5, 12, 20, 'metric', 'Cucumber', { min: 3, max: 5 }, 'whole', 'whole').join(' ');
    expect(text).toContain('taste ready around pH');
    expect(text).toContain(readinessPH(12).toFixed(1));
  });
});

describe('metabisulfite (Campden) warning', () => {
  const water = waterHardnessFermentAdvice({ mgL: 120, classification: 'slightly hard', note: 'test' }).join(' ');

  it('gives the correct dechlorination dose, not the folklore one', () => {
    expect(water).toContain('1 tablet per 20 US gallons');
    expect(water).toContain('67–78 mg/L');
    expect(water).toContain('13–16×');
  });

  it('explains that chlorine itself is not the problem', () => {
    expect(water.toLowerCase()).toContain('chlorine');
    expect(water).toContain('stall a ferment the chlorine would not have');
  });
});
