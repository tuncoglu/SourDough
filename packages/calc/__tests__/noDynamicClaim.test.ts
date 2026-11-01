/**
 * Hostile review finding 4: the bread page never ran the "dynamic fermentation" model (every
 * caller passed no forecast), the model advanced 15 min per hourly point (4x too fast), and the
 * README and an advice line still advertised it. The model is removed rather than half-enabled;
 * these tests keep it from coming back as a claim or a switch.
 */
import * as fs from 'fs';
import * as path from 'path';
import * as calc from '../src/lib/calculations';
import { estimateLazyLoaf } from '../src/lib/lazyPlan';
import { FALLBACK_HARDNESS } from '../src/lib/hardnessUtils';
import type { RecipeInputs } from '../src/models/types';

const INPUTS: RecipeInputs = {
  flourWeight: 500, flourType: 'Generic: Bread Flour', flourProtein: 12, hydration: 75,
  starterWeight: 100, starterHydration: 100, saltPct: 2, oilPct: 0,
  ambientTemp: 20, flourTemp: 20, waterTemp: 20, starterTemp: 4,
} as RecipeInputs;

describe('the dynamic fermentation model is gone, not half-enabled', () => {
  it('exports no dynamic or cold-proof integrators', () => {
    expect(calc).not.toHaveProperty('estimateDynamicFermentation');
    expect(calc).not.toHaveProperty('estimateColdProof');
  });

  it('runAllCalculations takes no forecast and never reports a dynamic estimate', () => {
    const r = calc.runAllCalculations(INPUTS, FALLBACK_HARDNESS);
    expect(r.dynamicFerment).toBeNull();
    expect(r.staticFermentHours).toBeGreaterThan(0);
  });

  it('estimateLazyLoaf takes no forecast', () => {
    const est = estimateLazyLoaf(
      { flourGrams: 500, waterPct: 75, starterPct: 20, saltPct: 2, starterHydration: 100, roomTempC: 22 },
      FALLBACK_HARDNESS,
    );
    expect(est!.bulkHours).toBe(est!.results.staticFermentHours);
  });
});

describe('no copy points at an estimate that does not exist', () => {
  it('a cool dough is told what the estimate really assumes, not that a dynamic estimate "accounts for this"', () => {
    const text = calc.fermentAdvice(18, 20, 70).join('\n');
    expect(text).not.toMatch(/dynamic/i);
    expect(text).toMatch(/starts cool/i);
    expect(text).toMatch(/same temperature|stays at|holds/i);
  });

  it('no advice line, for any temperature, mentions a dynamic estimate', () => {
    for (const fdt of [4, 10, 15, 18, 21, 26, 32, 38, 42]) {
      for (const inoc of [5, 20, 50]) {
        expect(calc.fermentAdvice(fdt, inoc, 70, 6).join('\n')).not.toMatch(/dynamic estimate/i);
      }
    }
  });

  it('the README does not advertise dynamic or hour-by-hour fermentation', () => {
    const readme = fs.readFileSync(path.join(__dirname, '../../../README.md'), 'utf8');
    expect(readme).not.toMatch(/dynamic fermentation/i);
    expect(readme).not.toMatch(/hour-by-hour/i);
  });
});
