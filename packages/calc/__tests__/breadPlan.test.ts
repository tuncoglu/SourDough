import { addFlour, DEFAULT_BREAD_FORM, earliestChoice, planBread, removeFlour, setFlourGrams, whenLabel, type BreadEnv, type BreadForm } from '../src/lib/breadPlan';
import { FALLBACK_HARDNESS } from '../src/lib/hardnessUtils';
import { clockTime } from '../src/lib/starterFormat';
import { addFeeding, deleteFeeding, fridgeStateIn, markPeakedIn, starterStateFrom } from '../src/lib/starterLog';
import type { StarterFeeding } from '../src/models/types';

const NOW = new Date(2026, 9, 28, 17, 30); // Wed 28 Oct 2026, 17:30 local
const feeding = (over: Partial<StarterFeeding> = {}): StarterFeeding => ({
  id: 'f1',
  timestamp: new Date(NOW.getTime() - 3 * 3600_000).toISOString(),
  flourUsed: 'Generic: Bread Flour',
  flourGrams: 50,
  waterGrams: 50,
  starterKeptGrams: 50,
  roomTempC: 20,
  ...over,
});
const env = (over: Partial<BreadEnv> = {}, feedings: StarterFeeding[] = []): BreadEnv => ({
  now: NOW,
  roomTempC: 20,
  hardness: FALLBACK_HARDNESS,
  unitSystem: 'metric',
  starter: starterStateFrom(feedings, 20, NOW),
  mixedAt: null,
  ...over,
});

describe('weights and the rise', () => {
  it('the default loaf: 500 g flour, 375 g water, 100 g starter, from the fridge', () => {
    const p = planBread(DEFAULT_BREAD_FORM, env());
    expect(p.flourGrams).toBe(500);
    expect(p.waterGrams).toBe(375);
    expect(p.starterGrams).toBe(100);
    expect(p.fed).toBe(false);
    expect(p.chosen?.estimate?.bulkHours).toBeGreaterThan(5);
    expect(p.chosen?.starterTempC).toBe(4);
    expect(p.steps.map((s) => s.key)).toEqual(['mix', 'rise', 'shape', 'proof', 'bake', 'cool']);
  });

  it('a warmer kitchen shortens the rise', () => {
    const cool = planBread(DEFAULT_BREAD_FORM, env({ roomTempC: 18 })).chosen!.estimate!.bulkHours;
    const warm = planBread(DEFAULT_BREAD_FORM, env({ roomTempC: 26 })).chosen!.estimate!.bulkHours;
    expect(warm).toBeLessThan(cool);
  });

  it('gives nothing to estimate without flour', () => {
    const p = planBread({ ...DEFAULT_BREAD_FORM, flours: [{ key: 'a', label: 'Generic: Bread Flour', grams: '' }] }, env());
    expect(p.chosen).toBeNull();
    expect(p.schedule).toBeNull();
  });

  it('a fed-first starter rises sooner than one straight from the fridge', () => {
    const p = planBread(DEFAULT_BREAD_FORM, env());
    expect(p.fedCase!.estimate!.bulkHours).toBeLessThan(p.fridgeCase!.estimate!.bulkHours);
  });
});

describe('the water', () => {
  it('is at room temperature, at the tap temperature when known, and at what the person typed above all', () => {
    expect(planBread(DEFAULT_BREAD_FORM, env()).waterTempC).toBe(20);
    expect(planBread(DEFAULT_BREAD_FORM, env({ tapTempC: 11.5 })).waterTempC).toBe(11.5);
    expect(planBread({ ...DEFAULT_BREAD_FORM, waterTempOverride: '30' }, env({ tapTempC: 11.5 })).waterTempC).toBe(30);
  });

  it('colder tap water lengthens the rise', () => {
    const room = planBread(DEFAULT_BREAD_FORM, env()).chosen!.estimate!.bulkHours;
    const cold = planBread(DEFAULT_BREAD_FORM, env({ tapTempC: 8 })).chosen!.estimate!.bulkHours;
    expect(cold).toBeGreaterThanOrEqual(room);
  });
});

describe('the starter choice', () => {
  it('fed first adds a Feed step and a feed lead time', () => {
    const p = planBread({ ...DEFAULT_BREAD_FORM, starterMode: 'fed', modeChosen: true }, env());
    expect(p.fed).toBe(true);
    expect(p.steps[0]!.key).toBe('feed');
    expect(p.timeToPeak).toBeGreaterThan(5);
    expect(p.schedule!.plan!.feedAt).toBeDefined();
  });

  it('a feeding made for this loaf switches to fed-first, unless the person chose', () => {
    const feedings = [feeding()];
    expect(planBread(DEFAULT_BREAD_FORM, env({}, feedings)).mode).toBe('fed');
    expect(planBread({ ...DEFAULT_BREAD_FORM, starterMode: 'fridge', modeChosen: true }, env({}, feedings)).mode).toBe('fridge');
  });

  it('a jar already in the fridge does not count as fed for this loaf', () => {
    const f = feeding({ fridgeAt: new Date(NOW.getTime() - 3600_000).toISOString() });
    expect(planBread(DEFAULT_BREAD_FORM, env({}, [f])).mode).toBe('fridge');
  });

  it('feed amounts leave the dough its starter and keep 50 g', () => {
    const p = planBread(DEFAULT_BREAD_FORM, env());
    expect(p.feedAmounts.keptGrams).toBe(50);
    expect(p.feedAmounts.totalGrams).toBe(150);
  });

  it('a bigger feed peaks later', () => {
    const r1 = planBread({ ...DEFAULT_BREAD_FORM, feedRatio: 1 }, env()).timeToPeak!;
    const r5 = planBread({ ...DEFAULT_BREAD_FORM, feedRatio: 5 }, env()).timeToPeak!;
    expect(r5).toBeGreaterThan(r1 * 2);
  });
});

describe('the schedule', () => {
  const readyBy = (over: Partial<BreadForm> = {}): BreadForm => ({ ...DEFAULT_BREAD_FORM, planMode: 'readyBy', readyDay: 2, readyTime: '09:00', ...over });

  it('works back from ready to slice, an hour after it comes out of the oven', () => {
    const p = planBread(readyBy(), env());
    const plan = p.schedule!.plan!;
    const ready = plan.steps.find((s) => s.key === 'cool')!.at.getTime() + 3600_000;
    expect(new Date(ready).getHours()).toBe(9);
    expect(p.schedule!.tooEarly).toBe(false);
    expect(p.stepWhen.mix).toBeDefined();
    expect(p.stepWhen.bake).toContain('heat the oven at');
  });

  it('says so when the time needs a start that has passed, and offers the earliest', () => {
    const p = planBread(readyBy({ readyDay: 0, readyTime: '20:00' }), env());
    expect(p.schedule!.tooEarly).toBe(true);
    expect(p.schedule!.earliest!.getTime()).toBeGreaterThan(NOW.getTime());
    expect(p.stepWhen).toEqual({});
    const pick = earliestChoice(p.schedule!.earliest!, NOW);
    expect(pick.time).toMatch(/^\d\d:\d\d$/);
  });

  it('the earliest it offers is a time that works', () => {
    const early = planBread(readyBy({ readyDay: 0, readyTime: '20:00' }), env()).schedule!.earliest!;
    const pick = earliestChoice(early, NOW);
    const ok = planBread(readyBy({ readyDay: pick.day, readyTime: pick.time }), env());
    expect(ok.schedule!.tooEarly).toBe(false);
  });

  it('asks for a time it can read', () => {
    const p = planBread(readyBy({ readyTime: 'soon' }), env());
    expect(p.readyTimeValid).toBe(false);
    expect(p.schedule!.plan).toBeNull();
  });

  it('once mixed, the day runs forward from the real mix time', () => {
    const mixedAt = new Date(NOW.getTime() - 2 * 3600_000);
    const p = planBread(readyBy(), env({ mixedAt }));
    expect(p.schedule!.plan!.mixAt.getTime()).toBe(mixedAt.getTime());
    expect(p.checkAt!.getTime()).toBeGreaterThan(mixedAt.getTime());
  });

  it('start now with a feed mixes at the peak', () => {
    const p = planBread({ ...DEFAULT_BREAD_FORM, starterMode: 'fed', modeChosen: true }, env());
    const diff = (p.schedule!.plan!.mixAt.getTime() - NOW.getTime()) / 3600_000;
    expect(diff).toBeCloseTo(p.timeToPeak!, 5);
  });

  it('labels a moment with its day only when it is not today', () => {
    // Times follow the viewer's locale ("23:00" or "11:00 PM"), so compare with the same formatter.
    const tonight = new Date(2026, 9, 28, 23, 0);
    const tomorrow = new Date(2026, 9, 29, 7, 15);
    expect(whenLabel(tonight, NOW)).toBe(clockTime(tonight));
    expect(whenLabel(tomorrow, NOW)).toContain(clockTime(tomorrow));
    expect(whenLabel(tomorrow, NOW)).toContain(',');
    expect(whenLabel(tomorrow, NOW).length).toBeGreaterThan(clockTime(tomorrow).length);
  });
});

describe('the flour rows', () => {
  it('a second flour takes half of the first, up to three', () => {
    const two = addFlour(DEFAULT_BREAD_FORM);
    expect(two.flours.map((r) => r.grams)).toEqual(['250', '250']);
    const three = addFlour(two);
    expect(addFlour(three).flours).toHaveLength(3);
    expect(removeFlour(three, three.flours[1]!.key).flours).toHaveLength(2);
    expect(removeFlour(DEFAULT_BREAD_FORM, 'flour_0').flours).toHaveLength(1);
  });

  it('the dough totals the blend', () => {
    const f = setFlourGrams(addFlour(DEFAULT_BREAD_FORM), 'flour_1', '300');
    expect(planBread(f, env()).flourGrams).toBe(550);
  });
});

describe('the starter log', () => {
  it('keeps the newest first, marks a peak, and moves the jar in and out of the fridge', () => {
    const a = feeding({ id: 'a', timestamp: new Date(NOW.getTime() - 48 * 3600_000).toISOString() });
    const b = feeding({ id: 'b' });
    let log = addFeeding(addFeeding([], a), b);
    expect(log.map((f) => f.id)).toEqual(['b', 'a']);
    log = markPeakedIn(log, 'b', NOW);
    expect(log[0]!.peakedAt).toBe(NOW.toISOString());
    log = fridgeStateIn(log, 'b', 'in', NOW);
    expect(log[0]!.fridgeAt).toBe(NOW.toISOString());
    log = fridgeStateIn(log, 'b', 'out', NOW);
    expect(log[0]!.outOfFridgeAt).toBeDefined();
    log = fridgeStateIn(log, 'b', 'in', NOW);
    expect(log[0]!.outOfFridgeAt).toBeUndefined();
    expect(deleteFeeding(log, 'a').map((f) => f.id)).toEqual(['b']);
  });

  it('reads the starter state: none, fresh, and learned', () => {
    expect(starterStateFrom([], 20, NOW).status).toBeNull();
    const s = starterStateFrom([feeding()], 20, NOW);
    expect(s.status).not.toBeNull();
    expect(s.learnedFromPeaks).toBeNull();
    expect(s.peakEffectiveHours).toBe(6);
  });
});
