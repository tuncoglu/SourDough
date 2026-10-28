import type { FlourCategory } from '@sourdough/calc/models/types';
import { FLOURS_BY_CATEGORY } from '@sourdough/calc/data/flours';
import { findFlour } from '@sourdough/calc/lib/flourSearch';
import { computeVitalityFactor } from '@sourdough/calc/lib/calculations';
import { LAZY_BAKE, formatHours, type LazyVessel } from '@sourdough/calc/lib/lazyMethod';
import { FRIDGE_HOURS, LAZY_PLAN_MINUTES, LAZY_STARTER_TEMP_C, type ProofMode } from '@sourdough/calc/lib/lazyPlan';
import { dayFromNow } from '@sourdough/calc/lib/lazySchedule';
import { FEED_RATIOS } from '@sourdough/calc/lib/starterLog';
import { clockTime, dayAndTime, hoursLabel, shortDay } from '@sourdough/calc/lib/starterFormat';
import { addFlour, earliestChoice, removeFlour, setFlourGrams, setFlourLabel, whenLabel, MAX_FLOURS } from '@sourdough/calc/lib/breadPlan';
import { formatTemp, formatWeight } from '@sourdough/calc/lib/unitConversion';
import { ChipGroup, KV, Note, NumField, RangeField } from '@sourdough/ui/components';
import { KitchenTempField } from '@sourdough/ui/KitchenTempField';
import { WeatherField } from '@sourdough/ui/WeatherField';
import { hardnessFor } from '@sourdough/calc/lib/hardnessFor';
import type { Ctx } from './ctx';

/** The flour picker: every flour, grouped, as a plain select. */
export function FlourSelect({ id, label, value, onChange }: { id: string; label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      <select id={id} value={findFlour(value).label} onChange={(e) => onChange(e.target.value)}>
        {(Object.keys(FLOURS_BY_CATEGORY) as FlourCategory[]).map((cat) => (
          <optgroup key={cat} label={cat}>
            {FLOURS_BY_CATEGORY[cat].map((f) => (
              <option key={f.label} value={f.label}>
                {f.label}
              </option>
            ))}
          </optgroup>
        ))}
      </select>
    </div>
  );
}

export function FlourCard({ c }: { c: Ctx }) {
  const { form, setForm, plan } = c;
  const many = form.flours.length > 1;
  return (
    <fieldset className="card">
      <legend>Flour</legend>
      {form.flours.map((r, i) => (
        <div key={r.key}>
          <FlourSelect id={`fl-${r.key}`} label={many ? `Flour ${i + 1}` : 'Flour'} value={r.label} onChange={(v) => setForm(setFlourLabel(form, r.key, v))} />
          <NumField label={many ? `Flour ${i + 1} in the bowl` : 'Flour in the bowl'} value={r.grams} suffix="g" onChange={(v) => setForm(setFlourGrams(form, r.key, v))} />
          {many && (
            <button type="button" className="link" onClick={() => setForm(removeFlour(form, r.key))}>
              Remove this flour
            </button>
          )}
        </div>
      ))}
      {form.flours.length < MAX_FLOURS && (
        <button type="button" className="link" onClick={() => setForm(addFlour(form))}>
          Blend with another flour
        </button>
      )}
      {many && <p className="hint">{Math.round(plan.flourGrams)} g of flour in all. Up to three flours; percentages are of the total.</p>}
    </fieldset>
  );
}

export function StarterCard({ c }: { c: Ctx }) {
  const { form, setForm, plan, starter, roomTempC, settings } = c;
  const units = settings.units;
  const w = (g: number) => formatWeight(g, units, units === 'imperial' ? 1 : 0);
  const status = starter.status;
  const hours = plan.chosen?.starterHoursSinceFed;
  const activity = hours !== undefined ? Math.round(computeVitalityFactor(hours) * 100) : 100;
  const starterTempC = plan.chosen?.starterTempC ?? LAZY_STARTER_TEMP_C;
  const fridgeRise = plan.fridgeCase?.estimate?.bulkHours;
  const fedRise = plan.fedCase?.estimate?.bulkHours;
  const choose = (mode: 'fed' | 'fridge') => setForm({ ...form, starterMode: mode, modeChosen: true });
  const f = starter.feeding;
  return (
    <fieldset className="card">
      <legend>Your starter</legend>
      {status ? (
        <>
          <p className="zone">
            {status.emoji} {status.label}
          </p>
          <p className="hint" style={{ marginTop: 0 }}>
            Fed {dayAndTime(f!.timestamp)}
            {f!.fridgeAt ? ` · in the fridge since ${clockTime(new Date(f!.fridgeAt))}` : ''} · effective age {hoursLabel(status.effectiveHours)}. From your Starter tab.
          </p>
        </>
      ) : (
        <p className="hint" style={{ marginTop: 0 }}>
          No feeding logged, so this assumes a fridge-cold starter at full strength.{' '}
          <button type="button" className="link" style={{ padding: 0, minHeight: 0 }} onClick={c.goStarter}>
            Log a feeding in the Starter tab
          </button>
        </p>
      )}

      <h3>How will you use it?</h3>
      <div className="radio-list">
        <label className={plan.mode === 'fed' ? 'radio checked' : 'radio'}>
          <input type="radio" name="spath" checked={plan.mode === 'fed'} onChange={() => choose('fed')} />
          <span>
            Feed it first, mix at peak
            <small style={{ display: 'block', fontWeight: 400, color: 'var(--muted)' }}>
              Feed it about {plan.timeToPeak !== null ? formatHours(plan.timeToPeak) : 'a few hours'} before you mix. The rise takes about{' '}
              {fedRise != null ? formatHours(fedRise) : '—'}.
            </small>
          </span>
        </label>
        <label className={plan.mode === 'fridge' ? 'radio checked' : 'radio'}>
          <input type="radio" name="spath" checked={plan.mode === 'fridge'} onChange={() => choose('fridge')} />
          <span>
            Straight from the fridge
            <small style={{ display: 'block', fontWeight: 400, color: 'var(--muted)' }}>
              Least effort: mix straight away. The rise takes about {fridgeRise != null ? formatHours(fridgeRise) : '—'}.
            </small>
          </span>
        </label>
      </div>

      {plan.fed && (
        <>
          <h3>Feed ratio</h3>
          <ChipGroup
            label="Feed ratio"
            options={FEED_RATIOS.map((r) => ({ id: String(r), label: `1 : ${r} : ${r}` }))}
            value={String(form.feedRatio)}
            onChange={(v) => setForm({ ...form, feedRatio: Number(v) })}
          />
          <p className="hint">
            Starter : flour : water. A bigger feed peaks later. Pick the one that puts the peak at a time that suits you.
          </p>
        </>
      )}

      <KV
        rows={[
          ['Starter activity', `${activity} %`],
          [
            'Starter temperature',
            Number.isFinite(starterTempC)
              ? formatTemp(starterTempC, units, 0) + (plan.fed ? ', room temperature' : starterTempC <= LAZY_STARTER_TEMP_C ? ', from the fridge' : '')
              : '—',
          ],
          ...(plan.fed && plan.timeToPeak !== null
            ? ([
                ['Time to peak', `${hoursLabel(plan.timeToPeak)} at ${formatTemp(roomTempC, units, 0)}`],
                ['Peak window', plan.peakWindow ? `${hoursLabel(plan.peakWindow.from)} to ${hoursLabel(plan.peakWindow.to)} after the feed` : '—'],
              ] as Array<[string, string]>)
            : []),
        ]}
      />
      <p className="hint">
        Activity is how much of its peak strength the starter has. It sets how long the rise takes, and it is a rule of thumb
        that your own logged peaks refine. <span className="badge badge-warn">heuristic</span>
      </p>
      {plan.fed && (
        <Note kind="care">
          <p className="hint">
            Keep {w(plan.feedAmounts.keptGrams)} of starter, add {w(plan.feedAmounts.flourGrams)} of flour and {w(plan.feedAmounts.waterGrams)} of water
            ({w(plan.feedAmounts.totalGrams)} in all).
            {plan.loafFeeding && plan.loafPeak
              ? ` Fed ${clockTime(new Date(plan.loafFeeding.timestamp))}. Peaks about ${clockTime(plan.loafPeak.peakAt)}; mix between ${clockTime(plan.loafPeak.window.from)} and ${clockTime(plan.loafPeak.window.to)}.`
              : ''}
          </p>
        </Note>
      )}
      {!plan.fed && (
        <Note kind="care">
          <p className="hint">After you mix, refresh the jar with equal weights of flour and water, then put it back in the fridge.</p>
        </Note>
      )}
    </fieldset>
  );
}

export function DoughCard({ c }: { c: Ctx }) {
  const { form, setForm, plan } = c;
  const ing = plan.chosen?.estimate?.results.ingredients;
  const set = (k: 'waterPct' | 'starterPct' | 'saltPct' | 'starterHydration', v: string) => setForm({ ...form, [k]: v });
  return (
    <details className="card sum">
      <summary>
        <span>
          <span className="s-title">Dough</span>
          <span className="s-line">
            {form.waterPct} % water · {form.starterPct} % starter · {form.saltPct} % salt
          </span>
        </span>
      </summary>
      <div className="body">
        <RangeField label="Water" value={form.waterPct} min={50} max={100} onChange={(v) => set('waterPct', v)} hint="Percent of the flour weight." />
        <RangeField label="Starter" value={form.starterPct} min={5} max={50} onChange={(v) => set('starterPct', v)} />
        <RangeField label="Salt" value={form.saltPct} min={0} max={4} step={0.1} onChange={(v) => set('saltPct', v)} hint="Percent of all the flour, including the flour inside the starter." />
        <NumField label="Starter hydration" value={form.starterHydration} suffix="%" onChange={(v) => set('starterHydration', v)} hint="100 % means equal weights of flour and water." />
        {ing && (
          <div className="converted">
            <p>
              Total hydration <strong>{Math.round(ing.hydrationPct)} %</strong>. The starter brings {Math.round(ing.flourFromStarter)} g of flour and{' '}
              {Math.round(ing.waterFromStarter)} g of water with it.
            </p>
          </div>
        )}
      </div>
    </details>
  );
}

export function KitchenCard({ c }: { c: Ctx }) {
  const { form, setForm, settings, setSettings, plan, roomTempC, roomSource, weather } = c;
  const units = settings.units;
  const choice = hardnessFor({ manualMgL: settings.waterHardnessMgL, postcode: settings.postcode, place: weather?.place });
  const hardness = { mgL: choice.hardness.mgL, label: choice.hardness.classification };
  const known = choice.source !== 'assumed';
  const tapTempC = weather?.tapTempC;
  const source =
    roomSource === 'set'
      ? `Using your room temperature, ${formatTemp(roomTempC, units, 1)}.`
      : roomSource === 'weather'
        ? `Using ${formatTemp(roomTempC, units, 1)}, the outdoor temperature from Open-Meteo. It is the outdoor figure, so type your room temperature if it differs.`
        : `No temperature known, so ${formatTemp(roomTempC, units, 0)} is assumed. Type your room temperature, or use your location.`;
  return (
    <details className="card sum">
      <summary>
        <span>
          <span className="s-title">Kitchen</span>
          <span className="s-line">
            {formatTemp(roomTempC, units, 0)} room · {known ? `${hardness.label} water` : 'water hardness unknown'}
          </span>
        </span>
      </summary>
      <div className="body">
        <KitchenTempField label="Room temperature" settings={settings} onChange={setSettings} emptyWhenZero />
        <div className="converted">
          <p>{source}</p>
        </div>
        <WeatherField weather={weather} onWeather={c.onWeather} autoDetect={c.autoDetect} onAutoDetect={c.onAutoDetect} purpose="the room temperature" place tapTemp />

        <h3>Ingredient temperatures</h3>
        <NumField
          label="Water"
          value={form.waterTempOverride}
          suffix={units === 'imperial' ? '°F' : '°C'}
          placeholder="Same as room"
          onChange={(v) => {
            const n = parseFloat(v);
            // Typed in the display unit; held in °C.
            setForm({ ...form, waterTempOverride: v === '' || !Number.isFinite(n) ? '' : String(Math.round((units === 'imperial' ? ((n - 32) * 5) / 9 : n) * 10) / 10) });
          }}
        />
        <p className="hint">
          Flour is at room temperature ({formatTemp(roomTempC, units, 0)}), water is{' '}
          {form.waterTempOverride !== '' ? `${formatTemp(plan.waterTempC, units, 1)} as typed` : tapTempC != null ? `${formatTemp(tapTempC, units, 1)}, estimated for your tap` : 'at room temperature'}, and the
          starter’s temperature follows your starter choice above.
        </p>

        <h3>Tap water</h3>
        <div className="converted">
          <p>
            <strong>{hardness.label}</strong> · {hardness.mgL} mg/L CaCO₃
            {choice.source === 'manual' ? ', from Settings' : choice.source === 'postcode' ? ', from your postcode' : choice.source === 'location' ? ', from your location' : ', assumed'}.
          </p>
          <button type="button" className="link" style={{ padding: 0, minHeight: 44 }} onClick={c.goSettings}>
            Change in Settings
          </button>
        </div>
      </div>
    </details>
  );
}

export function BakeCard({ c }: { c: Ctx }) {
  const { form, setForm, settings } = c;
  const u = settings.units;
  const opts: Array<{ id: LazyVessel; title: string; sub: string }> = [
    { id: 'cocotte', title: 'Cocotte (lidded pot)', sub: `${formatTemp(LAZY_BAKE.cocotte.ovenTempC, u, 0)} · ${LAZY_BAKE.cocotte.totalMinutes} min · lid on, then off` },
    { id: 'tin', title: 'Loaf tin', sub: `${formatTemp(LAZY_BAKE.tin.ovenTempC, u, 0)} · ${LAZY_BAKE.tin.totalMinutes} min · lined with baking paper` },
  ];
  return (
    <fieldset className="card">
      <legend>Bake in</legend>
      <div className="radio-list">
        {opts.map((o) => (
          <label key={o.id} className={form.vessel === o.id ? 'radio checked' : 'radio'}>
            <input type="radio" name="vessel" checked={form.vessel === o.id} onChange={() => setForm({ ...form, vessel: o.id })} />
            <span>
              {o.title}
              <small style={{ display: 'block', fontWeight: 400, color: 'var(--muted)' }}>{o.sub}</small>
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}

export function WhenCard({ c }: { c: Ctx }) {
  const { form, setForm, plan, now } = c;
  const sch = plan.schedule;
  const dayLabel = (i: number) => (i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : shortDay(dayFromNow(now, i)).replace(/ \w+$/, ''));
  const readyAt = sch?.plan ? new Date(sch.plan.steps.find((s) => s.key === 'cool')!.at.getTime() + LAZY_PLAN_MINUTES.cool * 60_000) : null;
  const find = (k: string) => sch?.plan?.steps.find((s) => s.key === k)?.at ?? null;
  const rows: Array<[string, Date | null]> = [
    ['Feed the starter', sch?.plan?.feedAt ?? null],
    ['Mix', find('mix')],
    ['Heat the oven', plan.ovenOn],
    ['Bake', find('bake')],
    ['Ready to slice', readyAt],
  ];
  const visible = rows.filter((r): r is [string, Date] => r[1] !== null);
  return (
    <fieldset className="card">
      <legend>When</legend>
      <ChipGroup
        label="Plan from"
        options={[
          { id: 'now', label: 'Mix now' },
          { id: 'readyBy', label: 'Ready to slice by' },
        ]}
        value={form.planMode}
        onChange={(m) => setForm({ ...form, planMode: m })}
      />
      {form.planMode === 'readyBy' && (
        <>
          <div className="chips" role="group" aria-label="Day">
            {[0, 1, 2, 3, 4].map((d) => (
              <button key={d} type="button" className={form.readyDay === d ? 'chip chip-on' : 'chip'} aria-pressed={form.readyDay === d} onClick={() => setForm({ ...form, readyDay: d })}>
                {dayLabel(d)}
              </button>
            ))}
          </div>
          <NumField label="Ready to slice at (time)" value={form.readyTime} onChange={(v) => setForm({ ...form, readyTime: v })} hint={plan.readyTimeValid ? 'For example 9, 9:30 or 9pm.' : undefined} />
          {!plan.readyTimeValid && <p className="error" role="status">Enter a time such as 9, 9:30 or 9pm.</p>}
        </>
      )}
      <h3>Proof</h3>
      <ChipGroup<ProofMode>
        label="Proof place"
        options={[
          { id: 'counter', label: 'Counter' },
          { id: 'fridge', label: 'Fridge' },
        ]}
        value={form.proofMode}
        onChange={(m) => setForm({ ...form, proofMode: m })}
      />
      {form.proofMode === 'fridge' && (
        <RangeField
          label="Time in the fridge"
          value={form.fridgeHours}
          min={FRIDGE_HOURS.min}
          max={FRIDGE_HOURS.max}
          unit="h"
          onChange={(v) => setForm({ ...form, fridgeHours: v })}
          hint={`Between ${FRIDGE_HOURS.min} and ${FRIDGE_HOURS.max} hours. Bake straight from cold.`}
        />
      )}

      {sch?.tooEarly && sch.earliest && (
        <Note kind="danger">
          <p>
            <strong>That is earlier than it can be.</strong>
          </p>
          <p className="hint">Starting now, the earliest it is ready to slice is {whenLabel(sch.earliest, now)}.</p>
          <button
            type="button"
            className="btn btn-small"
            onClick={() => {
              const pick = earliestChoice(sch.earliest!, now);
              setForm({ ...form, planMode: 'readyBy', readyDay: pick.day, readyTime: pick.time });
            }}
          >
            Use {whenLabel(sch.earliest, now)}
          </button>
        </Note>
      )}
      {!sch?.tooEarly && sch?.note && (
        <Note kind="care">
          <p className="hint">{sch.note}</p>
        </Note>
      )}
      {sch?.plan && !sch.tooEarly && visible.length > 0 && (
        <KV rows={visible.map(([label, at]) => [label, whenLabel(at, now)] as [string, string])} />
      )}
      {sch?.plan?.mixWindow && !sch.tooEarly && (
        <p className="hint">
          Mixing between {clockTime(sch.plan.mixWindow.from)} and {clockTime(sch.plan.mixWindow.to)} keeps the starter at 95 % or more of its peak.
        </p>
      )}
    </fieldset>
  );
}
