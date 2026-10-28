import { useState } from 'react';
import type { YogurtCulturePreset, YogurtStepPoint } from '@sourdough/calc/models/types';
import type { YogurtPlanReady } from '@sourdough/calc/lib/yogurtPlan';
import { formatWeight } from '@sourdough/calc/lib/unitConversion';
import type { Units } from '@sourdough/core/settings';
import { EstimateBadge, KV, Note } from '@sourdough/ui/components';
import { hoursLabel, splitAdvice, splitCultureTips, stepTitle } from './display';

const SERVING_G = 150;
const num = (h: number) => hoursLabel(h).replace(' h', '');

export function YieldCard({ plan, preset, units, tempText }: { plan: YogurtPlanReady; preset: YogurtCulturePreset; units: Units; tempText: string }) {
  const r = plan.results;
  const strained = preset.thickness === 'thick' || preset.thickness === 'very-thick';
  const starter =
    r.starterSource === 'previous-batch'
      ? `${formatWeight(r.previousBatchGrams, units, 0)} of your last batch`
      : `${r.sachetCount} ${r.sachetCount === 1 ? 'sachet' : 'sachets'}`;
  return (
    <section className="card" aria-labelledby="res-h">
      <h2 id="res-h">Yield and timing</h2>
      <div className="big">
        <span className="big-num">{hoursLabel(r.incubationHours)}</span>
        <span className="big-label">incubation at {tempText}</span>
        <EstimateBadge />
      </div>
      <p className="range">
        Anywhere from {num(r.incubationHoursMin)} to {num(r.incubationHoursMax)} hours. Longer means tangier.
      </p>
      {r.tempCapped && (
        <Note kind="warn">
          <p>This culture does not work well at this temperature, so the time is stretched. See the tips below.</p>
        </Note>
      )}
      <KV
        rows={[
          ['Milk', formatWeight(r.milkGrams, units, 0)],
          ['Makes about', `${formatWeight(r.estimatedYieldGrams, units, 0)} · ${r.estimatedYieldLitres} L`],
          [`Servings of ${formatWeight(SERVING_G, units, 0)}`, `about ${r.estimatedServings}`],
          ['Starter', starter],
        ]}
      />
      <p className="hint">
        {r.starterRatioDisplay}. Allows 3 % for evaporation during incubation{strained ? ', and the whey you strain off' : ''}.
        Servings are {formatWeight(SERVING_G, units, 0)} each.
      </p>
      <h3>Per 100 g</h3>
      <KV
        rows={[
          ['Fat', `${plan.nutrition.fatPct} %`],
          ['Protein', `${plan.nutrition.proteinPct} %`],
        ]}
      />
    </section>
  );
}

export function TimelineCard({ points }: { points: YogurtStepPoint[] }) {
  return (
    <section className="card" aria-labelledby="tl-h">
      <h2 id="tl-h">Timeline</h2>
      <ol style={{ listStyle: 'none', margin: 0, padding: 0 }}>
        {points.map((p, i) => {
          const last = i === points.length - 1;
          return (
            <li className="pt" key={`${p.label}-${i}`}>
              <div className="dotcol">
                <span className={last ? 'dot last' : 'dot'} />
                {!last && <span className="vline" />}
              </div>
              <div className="ptc" style={last ? { paddingBottom: 0 } : undefined}>
                <strong>{stepTitle(p)}</strong>
                <span>{p.description}</span>
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
}

type SetState = 'runs' | 'set' | 'bad';

const SET_CHECK: Array<{ id: SetState; label: string; sub: string }> = [
  { id: 'runs', label: 'Runs like milk', sub: 'Not set yet' },
  { id: 'set', label: 'Moves as one mass', sub: 'Set' },
  { id: 'bad', label: 'Pink, blue or green, or smells yeasty', sub: 'Contaminated' },
];

/** A tilt test: the way to tell when it is done is the jar, not the clock. */
export function SetCheck({ hoursMin, hoursMax }: { hoursMin: number; hoursMax: number }) {
  const [state, setState] = useState<SetState | null>(null);
  return (
    <fieldset className="card">
      <legend>Set check</legend>
      <p className="hint">
        Somewhere between hour {num(hoursMin)} and hour {num(hoursMax)}, tilt the jar gently. What does it do?
      </p>
      <div className="squeeze-grid">
        {SET_CHECK.map((o) => (
          <button
            key={o.id}
            type="button"
            className={state === o.id ? 'squeeze-btn selected' : 'squeeze-btn'}
            aria-pressed={state === o.id}
            onClick={() => setState(o.id)}
          >
            {o.label}
            <span>{o.sub}</span>
          </button>
        ))}
      </div>
      {state === 'set' && (
        <div className="advice advice-ready" role="status">
          <strong>Set.</strong> Fridge it now, or give it 1 to 2 more hours for more tang.
        </div>
      )}
      {state === 'runs' && (
        <div className="advice advice-wait" role="status">
          <strong>Not set yet.</strong> Keep it at a steady temperature and tilt it again in an hour. If it is still liquid
          after the longest time above, check the temperature and that the culture was alive.
        </div>
      )}
      {state === 'bad' && (
        <div className="advice advice-bad" role="status">
          <strong>Throw it away.</strong> Pink, blue or green, or a yeasty smell, means something else grew. Wash the jars
          well before the next batch.
        </div>
      )}
    </fieldset>
  );
}

export function TipsCard({ plan, preset }: { plan: YogurtPlanReady; preset: YogurtCulturePreset }) {
  const { tips, contamination } = splitAdvice(plan.advice);
  const culture = splitCultureTips(preset.tips);
  return (
    <section className="card" aria-labelledby="adv-h">
      <h2 id="adv-h">Tips and safety</h2>
      {contamination && (
        <Note kind="danger">
          <p>
            <strong>Signs of contamination</strong>
          </p>
          <p className="hint">{contamination}</p>
        </Note>
      )}
      <ul className="plain">
        {tips.map((t) => (
          <li key={t}>{t}</li>
        ))}
      </ul>
      {culture.practical.length > 0 && (
        <>
          <h3>{preset.name.replace(/ Yogurt$/i, '')} tips</h3>
          <ul className="plain">
            {culture.practical.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
        </>
      )}
    </section>
  );
}

export function ScienceCard({ preset }: { preset: YogurtCulturePreset }) {
  const culture = splitCultureTips(preset.tips);
  return (
    <details className="card plain">
      <summary>The science</summary>
      {preset.strainInfo && (
        <p className="hint">
          <strong>The bacteria.</strong> {preset.strainInfo}
        </p>
      )}
      {preset.healthNote && (
        <p className="hint">
          <strong>What the studies say.</strong> {preset.healthNote}
        </p>
      )}
      {culture.science.map((s) => (
        <p className="hint" key={s}>
          {s}
        </p>
      ))}
      <p className="hint">
        <strong>The time is an estimate.</strong> It starts from the usual time for this culture at its ideal temperature and
        speeds up or slows down about 2.5 times for every 10 °C. That figure, and the range around the time (a quarter
        shorter to half as long again), are rules of thumb, not measurements of your milk. Your own batches are the best
        guide: the set check above tells you when it is done.
      </p>
    </details>
  );
}
