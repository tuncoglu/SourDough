import { buildLazySteps, lazyBakeSummary, lazyProofHours, formatHours } from '../src/lib/lazyMethod';

describe('lazy sourdough method', () => {
  it('is six steps in a fixed order', () => {
    const steps = buildLazySteps('cocotte', 6, 'metric');
    expect(steps.map((s) => s.key)).toEqual(['mix', 'rise', 'shape', 'proof', 'bake', 'cool']);
  });

  it('never asks for the work the lazy method skips', () => {
    for (const vessel of ['cocotte', 'tin'] as const) {
      const text = buildLazySteps(vessel, 6, 'metric').map((s) => `${s.title} ${s.body}`).join(' ').toLowerCase();
      expect(text).not.toMatch(/autolyse|knead|bench rest|pre-shape|score|lame|banneton/);
    }
  });

  it('derives the rise and proof durations from the bulk estimate', () => {
    const steps = buildLazySteps('tin', 7.2, 'metric');
    expect(steps.find((s) => s.key === 'rise')!.duration).toBe('about 7 h');
    expect(lazyProofHours(7.2)).toBe(4.5);
    expect(steps.find((s) => s.key === 'proof')!.duration).toBe('about 4.5 h, or overnight');
  });

  it('falls back to words when there is no estimate yet', () => {
    const steps = buildLazySteps('tin', null, 'metric');
    expect(steps.find((s) => s.key === 'rise')!.duration).toBe('several hours');
  });

  it('gives each vessel a real oven temperature in the user units', () => {
    const cocotte = buildLazySteps('cocotte', 6, 'metric').find((s) => s.key === 'bake')!;
    const tin = buildLazySteps('tin', 6, 'imperial').find((s) => s.key === 'bake')!;
    expect(cocotte.body).toContain('240');
    expect(cocotte.body).toMatch(/lid on/);
    expect(tin.body).toContain('428');
    expect(tin.body).not.toMatch(/lid/);
    expect(lazyBakeSummary('tin', 'metric')).toContain('220');
  });

  it('rounds to half hours and never shows zero', () => {
    expect(formatHours(0.1)).toBe('0.5 h');
    expect(formatHours(5.74)).toBe('5.5 h');
    expect(formatHours(5.76)).toBe('6 h');
  });
});
