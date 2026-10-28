import { useMemo, useState } from 'react';
import type { FermentMethod, FermentPreset, LactoDayPoint } from '@sourdough/calc/models/types';
import type { VegCombo } from '@sourdough/calc/data/fermentPresets';
import type { LactoPlanReady } from '@sourdough/calc/lib/lactoPlan';
import { FINAL_PH, SAFETY_PH, TARGET_PH, readinessPH } from '@sourdough/calc/lib/lactoCalculations';
import {
  addDays,
  buildFermentCalendarUrl,
  fermentReadyDate,
  formatEventDate,
  type FermentCalendarInput,
  type FermentEventKind,
} from '@sourdough/calc/lib/calendar';
import { formatTemp, formatWeight } from '@sourdough/calc/lib/unitConversion';
import type { Units } from '@sourdough/core/settings';
import { KV, Note } from '@sourdough/ui/components';
import { spoons, splitAdvice, splitStyleTips } from './display';

const REFERENCE_TEMP_C = 22;
const SITE_URL = 'https://lactoferment.sourdoughcalculator.uk';
const grams = (g: number, units: Units) => formatWeight(g, units, Number.isInteger(g) ? 0 : 1);

export function SaltCard({ plan, method, units }: { plan: LactoPlanReady; method: FermentMethod; units: Units }) {
  const r = plan.results;
  return (
    <section className="card" aria-labelledby="salt-h">
      <h2 id="salt-h">Salt</h2>
      <div className="big">
        <span className="big-num">{grams(r.saltGrams, units)}</span>
        <span className="big-label">you need</span>
      </div>
      <KV
        rows={[
          ['That’s about', `${spoons(r.saltTeaspoons)} tsp · ${spoons(r.saltTablespoons)} tbsp`],
          ['Using', r.saltLabel],
          ...(method === 'brine' && r.totalBrineGrams > 0
            ? ([
                ['Total brine', `${grams(r.totalBrineGrams, units)} · ${r.brineStrengthDisplay}`],
              ] as Array<[string, string]>)
            : ([['Effective brine', `~${r.effectiveSalinity} %`]] as Array<[string, string]>)),
        ]}
      />
      <p className="hint">
        {method === 'brine'
          ? 'Dissolve the salt in the water, then pour it over the vegetables. '
          : 'The brine strength after the vegetables release their water. '}
        Flaky salt is bulky, so the spoon amounts are larger than for fine salt. Weigh it if you can.
      </p>
    </section>
  );
}

export function TimelineCard({ plan, timeline, units }: { plan: LactoPlanReady; timeline: LactoDayPoint[]; units: Units }) {
  const { results: r, timing } = plan;
  return (
    <section className="card" aria-labelledby="tl-h">
      <h2 id="tl-h">Timeline</h2>
      {timing.stalled ? (
        <Note kind="warn">
          <p>
            <strong>{timing.stallReason === 'hot' ? 'Too warm for lactic acid bacteria' : 'Too cold to ferment'}</strong>
          </p>
          <p className="hint">
            {timing.stallReason === 'hot'
              ? `At ${formatTemp(timing.tempC, units, 0)} the bacteria that sour your vegetables are inhibited, and spoilage organisms take over instead. Move the jar somewhere below ${formatTemp(30, units, 0)}.`
              : `At ${formatTemp(timing.tempC, units, 0)} they are effectively dormant, so this jar will not sour in any useful time: cold is how you stop a ferment. Move it somewhere ${formatTemp(18, units, 0)} to ${formatTemp(24, units, 0)}, or leave it cold for a very slow, very gradual change.`}
          </p>
        </Note>
      ) : (
        <p style={{ margin: 0 }}>
          Ready to refrigerate in about <strong style={{ color: 'var(--brand)' }}>{r.estimatedDays} days</strong>. Taste from day{' '}
          {Math.round(r.estimatedDaysMin)}; leave it past day {Math.round(r.estimatedDaysMax)} for a deeper sour.
        </p>
      )}

      <div className="factors">
        <p className="ft">
          Recipe baseline {timing.referenceDays} days at {formatTemp(REFERENCE_TEMP_C, units, 0)}
        </p>
        {timing.factors.map((f) => (
          <div className="fr" key={f.id} title={f.detail}>
            <span>{f.label}</span>
            <strong>{f.daysDelta ? `${f.daysDelta.toFixed(1)} d` : `×${f.factor.toFixed(2)}`}</strong>
          </div>
        ))}
      </div>
      <p className="hint">Only the adjustments that move the estimate are listed. Anything at the recipe’s own setting adds nothing.</p>

      <ol style={{ listStyle: 'none', margin: '12px 0 0', padding: 0 }}>
        {timeline.map((p, i) => {
          const last = i === timeline.length - 1;
          return (
            <li className="pt" key={`${p.day}-${p.label}`}>
              <div className="dotcol">
                <span className={last ? 'dot last' : 'dot'} />
                {!last && <span className="vline" />}
              </div>
              <div className="ptc" style={last ? { paddingBottom: 0 } : undefined}>
                <strong>{p.label}</strong>
                <span>{p.description}</span>
              </div>
            </li>
          );
        })}
      </ol>

      <p className="hint" style={{ marginTop: 12 }}>
        Two dates, not one. The figure above is when it is safe (below pH {SAFETY_PH}) and good to eat. It keeps souring after
        that, in the jar and slowly in the fridge, so leave it longer for a sharper, more complex ferment.
      </p>
      <div className="precision">
        <p>
          <strong>Safe below pH {SAFETY_PH.toFixed(1)}</strong> · Stable below {TARGET_PH.toFixed(1)} · Final ≈ {FINAL_PH.toFixed(1)}
        </p>
        <p>
          At {formatTemp(timing.tempC, units, 0)} it tastes ready around pH {readinessPH(timing.tempC).toFixed(1)}. Fridge when you like it.
        </p>
      </div>
    </section>
  );
}

interface CalendarProps {
  plan: LactoPlanReady;
  timeline: LactoDayPoint[];
  presetName: string;
  presetEmoji: string;
  vegName: string;
  method: FermentMethod;
  vegWeightG: number;
  waterG: number;
  saltPct: number;
  units: Units;
}

/** Google Calendar "add event" links. Nothing leaves the device until one is tapped. */
export function CalendarCard(p: CalendarProps) {
  const { plan, units } = p;
  const r = plan.results;
  const today = new Date();
  const input: FermentCalendarInput = useMemo(
    () => ({
      presetName: p.presetName,
      presetEmoji: p.presetEmoji,
      vegName: p.vegName,
      method: p.method,
      vegWeightG: p.vegWeightG,
      waterG: p.waterG,
      saltG: r.saltGrams,
      saltPct: p.saltPct,
      saltLabel: r.saltLabel,
      tempC: plan.tempC,
      estimatedDays: r.estimatedDays,
      estimatedDaysMin: r.estimatedDaysMin,
      estimatedDaysMax: r.estimatedDaysMax,
      timeline: p.timeline,
      timing: plan.timing,
      unitSystem: units,
      siteUrl: SITE_URL,
    }),
    [p.presetName, p.presetEmoji, p.vegName, p.method, p.vegWeightG, p.waterG, p.saltPct, p.timeline, plan, r, units],
  );
  // Day 0 is the day you are looking at this screen.
  const day0 = today.toDateString();
  const link = (kind: FermentEventKind) => buildFermentCalendarUrl(kind, { ...input, startDate: new Date() });
  const readyDay = Math.max(1, Math.ceil(r.estimatedDays));
  const tasteDay = Math.min(Math.max(1, Math.round(r.estimatedDaysMin)), readyDay);
  const readyDate = useMemo(() => fermentReadyDate({ ...input, startDate: new Date() }), [input, day0]);
  const tasteDate = useMemo(() => addDays(new Date(), tasteDay), [tasteDay, day0]);
  return (
    <section className="card" aria-labelledby="cal-h">
      <h2 id="cal-h">Google Calendar</h2>
      <p className="hint" style={{ marginTop: -4 }}>
        Starting today. Ready on day {readyDay}, {formatEventDate(readyDate)}.
      </p>
      <a className="btn btn-primary" href={link('ready')} target="_blank" rel="noopener noreferrer">
        Add the ready day
        <small>
          day {readyDay} · {formatEventDate(readyDate)}
        </small>
      </a>
      <div className="row">
        <a className="btn" href={link('taste')} target="_blank" rel="noopener noreferrer">
          Taste check
          <small>
            day {tasteDay} · {formatEventDate(tasteDate)}
          </small>
        </a>
        <a className="btn" href={link('span')} target="_blank" rel="noopener noreferrer">
          Whole ferment
          <small>day 0–{readyDay}</small>
        </a>
      </div>
      <p className="hint">
        Opens Google Calendar with the batch, salt and day-by-day schedule filled in. Nothing is sent until you tap one.
      </p>
    </section>
  );
}

type Taste = 'mild' | 'ready' | 'sharp';
const TASTES: Array<{ id: Taste; label: string; sub: string }> = [
  { id: 'mild', label: 'Mild, still raw-tasting', sub: 'Not sour yet' },
  { id: 'ready', label: 'Tangy and pleasantly sour', sub: 'Ready' },
  { id: 'sharp', label: 'Very sharp', sub: 'Fully soured' },
];

/** The jar, not the clock, says when it is done. */
export function TasteCheck() {
  const [taste, setTaste] = useState<Taste | null>(null);
  return (
    <fieldset className="card">
      <legend>Taste check</legend>
      <p className="hint">Use a clean fork. How does it taste?</p>
      <div className="squeeze-grid">
        {TASTES.map((t) => (
          <button key={t.id} type="button" className={taste === t.id ? 'squeeze-btn selected' : 'squeeze-btn'} aria-pressed={taste === t.id} onClick={() => setTaste(t.id)}>
            {t.label}
            <span>{t.sub}</span>
          </button>
        ))}
      </div>
      {taste === 'ready' && (
        <div className="advice advice-ready" role="status">
          <strong>Ready.</strong> Move it to the fridge when you like it. It keeps souring slowly in the cold.
        </div>
      )}
      {taste === 'mild' && (
        <div className="advice advice-wait" role="status">
          <strong>Not sour yet.</strong> Keep it submerged and at the same temperature, and taste again tomorrow.
        </div>
      )}
      {taste === 'sharp' && (
        <div className="advice advice-ready" role="status">
          <strong>Fully soured.</strong> Fridge it now to hold it there. Next time you can stop sooner for a milder ferment.
        </div>
      )}
    </fieldset>
  );
}

export function TipsCard({ plan, preset, combo, styleName }: { plan: LactoPlanReady; preset: FermentPreset; combo: VegCombo | null; styleName: string }) {
  const { tips, mould } = splitAdvice(plan.advice);
  const style = splitStyleTips((combo ?? preset).tips);
  return (
    <section className="card" aria-labelledby="tips-h">
      <h2 id="tips-h">Tips and safety</h2>
      <Note kind="danger">
        <p>
          <strong>Mould</strong>
        </p>
        <p className="hint">
          {mould ?? 'A thin white film (kahm yeast) is harmless. Skim it off. Fuzzy mould means discard immediately.'}
        </p>
      </Note>
      <ul className="plain">
        {tips.map((t) => (
          <li key={t}>{t}</li>
        ))}
      </ul>
      {style.practical.length > 0 && (
        <>
          <h3>{styleName} tips</h3>
          <ul className="plain">
            {style.practical.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
        </>
      )}
    </section>
  );
}

/** Brine ferments use added water, so its hardness and chlorine matter; dry-salted ones barely touch it. */
export function WaterCard({ lines }: { lines: string[] }) {
  if (lines.length === 0) return null;
  return (
    <section className="card" aria-labelledby="water-h">
      <h2 id="water-h">Water</h2>
      <ul className="plain">
        {lines.map((l) => (
          <li key={l}>{l.replace(/^\s*→\s*/, '')}</li>
        ))}
      </ul>
    </section>
  );
}

export function ScienceCard({ preset, combo, researchNote }: { preset: FermentPreset; combo: VegCombo | null; researchNote?: string }) {
  const style = splitStyleTips((combo ?? preset).tips);
  return (
    <details className="card plain">
      <summary>The science</summary>
      {researchNote && (
        <p className="hint">
          <strong>This vegetable.</strong> {researchNote}
        </p>
      )}
      {preset.healthNote && !combo && (
        <p className="hint">
          <strong>What the studies say.</strong> {preset.healthNote}
        </p>
      )}
      {style.science.map((s) => (
        <p className="hint" key={s}>
          {s}
        </p>
      ))}
      {combo && (
        <p className="hint">
          <strong>Where this combination comes from.</strong> {combo.source}
        </p>
      )}
      <p className="hint">
        <strong>The date is an estimate.</strong> It starts from the recipe’s documented time at 22 °C and is adjusted for your
        temperature, salt, water hardness, vegetables, cut size and starter. Each adjustment is listed above with its
        multiplier. The temperature effect follows a cardinal-temperature curve for lactic acid bacteria; the vegetable speed
        factors are rules of thumb, not measurements, and the range around the date (Taste from… to past…) carries that
        uncertainty. Your own jar, tasted, is the best guide.
      </p>
    </details>
  );
}
