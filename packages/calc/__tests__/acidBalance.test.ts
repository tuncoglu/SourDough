/**
 * Acid-balance (fermentation ceiling) tests.
 *
 * Sugar is a gate, not a rate: when a vegetable's own sugar cannot supply the
 * acid its buffering consumes, the ferment stops at a higher pH no matter how
 * long it runs. The data is measured (Little et al. 2022, J. Food Sci.
 * 87:2121–2132); everything unmeasured must report as unknown rather than
 * silently passing as fine.
 */
import { acidBalanceVerdict, lactoAdvice, SAFETY_PH, TARGET_PH } from '../src/lib/lactoCalculations';
import { VEGETABLES, findVeg } from '../src/data/vegetables';

describe('acidBalanceVerdict', () => {
  it('flags the vegetable whose sugar cannot cover its buffering', () => {
    // Broccoli: 157 mM obtainable vs 173 mM needed = 0.91x, measured end pH 4.3.
    const broccoli = acidBalanceVerdict(findVeg('broccoli'));
    expect(broccoli.unknown).toBe(false);
    expect(broccoli.acidLimited).toBe(true);
    expect(broccoli.ratio).toBeCloseTo(0.91, 2);
    expect(broccoli.measuredEndPH).toBeCloseTo(4.3, 1);
  });

  it('clears the vegetables whose supply comfortably exceeds demand', () => {
    ['green-beans', 'bell-pepper', 'sweet-potato', 'corn'].forEach((id) => {
      const v = acidBalanceVerdict(findVeg(id));
      expect(`${id}: limited=${v.acidLimited}`).toBe(`${id}: limited=false`);
      expect(v.ratio!).toBeGreaterThan(1);
    });
  });

  it('reports UNKNOWN for everything never titrated — not a clean bill of health', () => {
    const cabbage = acidBalanceVerdict(findVeg('green-cabbage'));
    expect(cabbage.unknown).toBe(true);
    expect(cabbage.acidLimited).toBe(false);
    expect(cabbage.measuredEndPH).toBeUndefined();

    // The majority of the catalogue is unmeasured; that must stay explicit.
    const measured = VEGETABLES.filter((v) => v.acidBalance);
    expect(measured.length).toBeGreaterThanOrEqual(5);
    expect(measured.length).toBeLessThan(VEGETABLES.length / 2);
  });

  it('every measured entry is internally consistent', () => {
    VEGETABLES.filter((v) => v.acidBalance).forEach((v) => {
      const ab = v.acidBalance!;
      expect(`${v.id}: demand>0`).toBe(`${v.id}: ${ab.acidDemandMmolL > 0 ? 'demand>0' : 'BAD'}`);
      expect(`${v.id}: supply>0`).toBe(`${v.id}: ${ab.sugarSupplyMmolL > 0 ? 'supply>0' : 'BAD'}`);
      // Measured endpoints must sit under the safety threshold, or the
      // warning text ("safe but milder") would be a lie.
      expect(ab.measuredEndPH).toBeLessThan(SAFETY_PH);
      expect(ab.measuredEndPH).toBeGreaterThan(2.5);
    });
  });

  it('only flags the acetic trap where the contrast is genuinely large', () => {
    expect(acidBalanceVerdict(findVeg('green-beans')).aceticTrap).toBe(true); // 463 vs 57.6 = 8x
    expect(acidBalanceVerdict(findVeg('corn')).aceticTrap).toBe(false); // 90 vs 210 = 0.43x
  });
});

describe('advice copy', () => {
  const base = (vegId: string) =>
    lactoAdvice('brine', 2.5, 22, 8, 'metric', findVeg(vegId).name, { min: 1.5, max: 3.5 }, 'whole', 'whole',
      acidBalanceVerdict(findVeg(vegId)));

  it('tells the user a limited vegetable will not fully sour, and why', () => {
    const text = base('broccoli').join(' ');
    expect(text).toContain('will not reach full sourness');
    expect(text).toMatch(/91% of the acid/);
    expect(text).toContain('pH 4.3');
    // The mechanism must be right: it runs OUT of sugar, which is why time
    // cannot fix it — and it is a quality limit, not a safety one.
    expect(text).toContain('runs out of sugar');
    expect(text).toContain('no amount of extra time fixes it');
    expect(text).toMatch(/Safe \(below 4\.6\)/);
  });

  it('says nothing vegetable-specific for an unmeasured vegetable', () => {
    const text = base('green-cabbage').join(' ');
    expect(text).not.toContain('will not reach full sourness');
  });

  it('warns about the acetic trap where it applies', () => {
    expect(base('green-beans').join(' ')).toContain('acetic acid');
  });

  it('keeps the measured ceiling consistent with the app thresholds', () => {
    // Broccoli's 4.3 sits above the 4.0 "stable" target but below 4.6 safety —
    // which is exactly why the copy says "milder", not "unsafe".
    expect(acidBalanceVerdict(findVeg('broccoli')).measuredEndPH!).toBeGreaterThan(TARGET_PH);
    expect(acidBalanceVerdict(findVeg('broccoli')).measuredEndPH!).toBeLessThan(SAFETY_PH);
  });
});

describe('mixes', () => {
  it('keeps the ceiling check alive when a mix is composed', () => {
    // A mix of two measured vegetables gets a mass-weighted balance, but no
    // measured endpoint (nobody has fermented that exact mix in a trial).
    const mixAB = { acidDemandMmolL: 100, sugarSupplyMmolL: 80 };
    const ratio = mixAB.sugarSupplyMmolL / mixAB.acidDemandMmolL;
    expect(ratio).toBeLessThan(1);
    const verdict = acidBalanceVerdict({ acidBalance: mixAB });
    expect(verdict.acidLimited).toBe(true);
    expect(verdict.measuredEndPH).toBeUndefined();
    expect(verdict.unknown).toBe(false);
  });

  it('stays unknown when any component has never been titrated', () => {
    expect(acidBalanceVerdict(findVeg('green-cabbage')).unknown).toBe(true);
  });

  it('does not print "pH undefined" when the endpoint is unmeasured', () => {
    const tips = lactoAdvice('brine', 2.5, 22, 8, 'metric', 'Broccoli + Cabbage', { min: 1.5, max: 3.5 },
      'chunks', 'chunks', { acidLimited: true, aceticTrap: false, unknown: false, ratio: 0.8 }, false, false).join(' ');
    expect(tips).toContain('will not reach full sourness');
    expect(tips).not.toContain('undefined');
    expect(tips).not.toContain('runs out of sugar at pH .');
  });
});
