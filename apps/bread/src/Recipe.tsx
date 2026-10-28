import { useState } from 'react';
import { formatHours } from '@sourdough/calc/lib/lazyMethod';
import { clockTime } from '@sourdough/calc/lib/starterFormat';
import { formatWeight } from '@sourdough/calc/lib/unitConversion';
import { KV, Note, EstimateBadge } from '@sourdough/ui/components';
import type { Ctx } from './ctx';
import { stripEmoji } from './text';

export interface RecipeActions {
  mixedAt: Date | null;
  onMixed: () => void;
  onResetClock: () => void;
  onFeedNow: () => void;
  onSave: () => void;
  onShare: () => void;
  /** A short message after saving or sharing, or null. */
  status: string | null;
}

export function RecipeCard({ c, a }: { c: Ctx; a: RecipeActions }) {
  const { plan, form, settings } = c;
  const units = settings.units;
  const est = plan.chosen!.estimate!;
  const ing = est.results.ingredients;
  const w = (g: number) => formatWeight(g, units, units === 'imperial' ? 1 : 0);
  const proofLine =
    form.proofMode === 'fridge'
      ? `Then ${form.fridgeHours} h proof in the fridge, and bake from cold.`
      : `Then about ${formatHours(est.proofHours)} proof on the counter, and bake.`;
  // Only when the person has told us their water; otherwise it would just say "assuming moderate".
  const hard = settings.waterHardnessMgL > 0 ? est.results.waterHardnessAdvice.map((l) => stripEmoji(l.trim())).filter(Boolean) : [];
  const warnings = est.results.warnings.map(stripEmoji).filter(Boolean);
  const pct = (g: number) => `${Math.round((g / ing.totalFlour) * 100)} %`;
  return (
    <section className="card" aria-labelledby="rec-h">
      <h2 id="rec-h">Your recipe</h2>
      <div className="big">
        <span className="big-num">{formatHours(est.bulkHours)}</span>
        <span className="big-label">rise</span>
        <EstimateBadge />
      </div>
      <p className="range">{proofLine}</p>
      <Note kind="care">
        <p>
          {w(est.doughGrams)} of dough. {plan.fed ? 'Starter fed first and mixed at its peak.' : 'Starter straight from the fridge.'} Judge the rise by the dough, not the clock.
        </p>
      </Note>
      {a.mixedAt ? (
        <div className="advice advice-ready" role="status">
          <strong>Mixed at {clockTime(a.mixedAt)}.</strong>
          {plan.checkAt ? ` Start checking the dough at ${clockTime(plan.checkAt)}.` : ''}{' '}
          <button type="button" className="link" style={{ padding: 0, minHeight: 0, color: 'inherit' }} onClick={a.onResetClock}>
            Reset the clock
          </button>
        </div>
      ) : (
        <>
          <button type="button" className="btn btn-primary" onClick={a.onMixed}>
            I’ve mixed
          </button>
          <p className="hint">Saves the mix time, so the app can tell you when to check the dough, and logs the jar going into the fridge.</p>
        </>
      )}
      <div className="row">
        <button type="button" className="btn btn-small" onClick={a.onSave}>
          Save loaf
        </button>
        <button type="button" className="btn btn-small" onClick={a.onShare}>
          Share
        </button>
      </div>
      {a.status && (
        <p className="ok" role="status" style={{ margin: '4px 0' }}>
          {a.status}
        </p>
      )}

      <h3>Into the bowl</h3>
      <KV
        rows={[
          ...(plan.flourRows.length > 1
            ? plan.flourRows.map((r) => [r.flour.label, w(r.grams)] as [string, string])
            : ([['Flour', w(plan.flourGrams)]] as Array<[string, string]>)),
          ['Water', w(ing.addedWater)],
          [plan.fed ? 'Starter (at peak)' : 'Starter', w(ing.starterTotal)],
          ['Salt', w(ing.salt)],
          ['Dough', w(est.doughGrams)],
        ]}
      />
      <details className="plain">
        <summary style={{ fontWeight: 700, minHeight: 44, display: 'flex', alignItems: 'center', cursor: 'pointer' }}>Baker’s percentages</summary>
        <table className="bakers">
          <thead>
            <tr>
              <th>Ingredient</th>
              <th>Grams</th>
              <th>Baker’s %</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Flour, total</td>
              <td>{w(ing.totalFlour)}</td>
              <td>100 %</td>
            </tr>
            <tr>
              <td>Water, total</td>
              <td>{w(ing.totalWater)}</td>
              <td>{pct(ing.totalWater)}</td>
            </tr>
            <tr>
              <td>Salt</td>
              <td>{w(ing.salt)}</td>
              <td>{pct(ing.salt)}</td>
            </tr>
          </tbody>
        </table>
        <p className="hint">
          The {w(ing.starterTotal)} of starter is already inside these totals: {w(ing.flourFromStarter)} of flour and {w(ing.waterFromStarter)} of water.
        </p>
      </details>
      {hard.length > 0 && (
        <Note kind="care">
          {hard.map((l) => (
            <p className="hint" key={l}>
              {l.replace(/^\s*→\s*/, '')}
            </p>
          ))}
        </Note>
      )}
      {warnings.length > 0 && (
        <Note kind="warn">
          {warnings.map((l) => (
            <p className="hint" key={l}>
              {l}
            </p>
          ))}
        </Note>
      )}
    </section>
  );
}

export function StepsCard({ c, a }: { c: Ctx; a: RecipeActions }) {
  const { plan } = c;
  const hasPlan = !!plan.schedule?.plan && !plan.schedule.tooEarly;
  return (
    <section className="card" aria-labelledby="steps-h">
      <h2 id="steps-h">Steps</h2>
      {!hasPlan && <p className="hint" style={{ marginTop: -4 }}>Set when you want it ready, or mix now, to see a time for each step.</p>}
      {plan.steps.map((s) => (
        <article className="step" key={s.key}>
          <div className="step-head">
            <h3>{s.title}</h3>
            <span className="dur">{s.duration}</span>
          </div>
          {plan.stepWhen[s.key] && <p className="when">{plan.stepWhen[s.key]}</p>}
          <p className="body">{s.body}</p>
          {s.aside && (
            <Note kind={s.key === 'bake' ? 'warn' : 'care'}>
              <p className="hint">{s.aside}</p>
            </Note>
          )}
          {s.key === 'feed' && !a.mixedAt && (
            plan.loafPeak ? (
              <div className="advice advice-ready" role="status">
                <strong>Peaks about {clockTime(plan.loafPeak.peakAt)}.</strong> Mix between {clockTime(plan.loafPeak.window.from)} and {clockTime(plan.loafPeak.window.to)}.
              </div>
            ) : (
              <>
                <button type="button" className="btn btn-primary" onClick={a.onFeedNow}>
                  I’ve fed it
                </button>
                <Note kind="care">
                  <p className="hint">Logs the feeding in the Starter tab. The app then follows the peak for you and tells you when to mix.</p>
                </Note>
              </>
            )
          )}
        </article>
      ))}
    </section>
  );
}

type Check = 'flat' | 'ready' | 'past';
const CHECKS: Array<{ id: Check; label: string; sub: string }> = [
  { id: 'flat', label: 'Flat top, not much bigger', sub: 'Not ready' },
  { id: 'ready', label: 'Doubled, domed, jiggles', sub: 'Ready' },
  { id: 'past', label: 'Collapsed, loose and sticky', sub: 'Past its best' },
];

/** The dough, not the clock, says when the rise is done. */
export function RiseCheck() {
  const [v, setV] = useState<Check | null>(null);
  return (
    <fieldset className="card">
      <legend>Rise check</legend>
      <p className="hint">Look at the bowl. What does the dough look like?</p>
      <div className="squeeze-grid">
        {CHECKS.map((o) => (
          <button key={o.id} type="button" className={v === o.id ? 'squeeze-btn selected' : 'squeeze-btn'} aria-pressed={v === o.id} onClick={() => setV(o.id)}>
            {o.label}
            <span>{o.sub}</span>
          </button>
        ))}
      </div>
      {v === 'ready' && (
        <div className="advice advice-ready" role="status">
          <strong>Ready.</strong> Shape it now.
        </div>
      )}
      {v === 'flat' && (
        <div className="advice advice-wait" role="status">
          <strong>Not ready.</strong> Give it more time and look again in 30 to 60 minutes.
        </div>
      )}
      {v === 'past' && (
        <div className="advice advice-wait" role="status">
          <strong>Past its best.</strong> Shape it gently and bake soon. It will still make bread, with a flatter loaf and more sour taste. Next time, check sooner.
        </div>
      )}
    </fieldset>
  );
}

export function Assumptions() {
  return (
    <Note kind="warn">
      <p>
        <strong>What this estimate assumes</strong>
      </p>
      <ul className="plain">
        <li>Rise: 4 h at 26 °C as the baseline, then scaled by temperature (×2.5 per 10 °C), starter amount, hydration and flour.</li>
        <li>
          Proof: 60 % of the rise. <span className="badge badge-warn">heuristic</span> Real loaves range from a quarter to the full rise time.
        </li>
        <li>
          Starter activity: full at its peak, 6 warm hours after a 1 : 1 : 1 feed (about 7 h at 20 °C, 5 h at 24 °C), and lower when it is just fed, past peak or hungry. Fridge time counts at about 6 % of counter time. The app’s own figure,
          adjusted to your starter once you have logged three peaks.
        </li>
      </ul>
    </Note>
  );
}
