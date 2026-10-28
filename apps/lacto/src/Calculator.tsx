import { useMemo, useState } from 'react';
import type { FermentType, PrepSize, SaltCrystal } from '@sourdough/calc/models/types';
import { PREP_SIZE_LABELS, PREP_SIZE_ORDER, SALT_LABELS, SALT_TYPE_ORDER } from '@sourdough/calc/models/types';
import { FERMENT_PRESETS, FERMENT_TYPE_ORDER, VEG_COMBOS } from '@sourdough/calc/data/fermentPresets';
import { allVegByCategory } from '@sourdough/calc/data/vegetables';
import { recommendedSaltPct } from '@sourdough/calc/lib/fermentSetup';
import { computeFermentTemp } from '@sourdough/calc/lib/lactoCalculations';
import {
  applyCombo,
  clearMix,
  comboOf,
  styleLabel,
  methodOf,
  planFromForm,
  resolveVeg,
  selectPreset,
  selectVeg,
  toggleVegInMix,
  updateMixGrams,
  type LactoForm,
} from '@sourdough/calc/lib/lactoForm';
import { hardnessFor } from '@sourdough/calc/lib/hardnessFor';
import { formatTemp } from '@sourdough/calc/lib/unitConversion';
import type { Settings } from '@sourdough/core/settings';
import type { Weather } from '@sourdough/core/weather';
import { Check, ChipGroup, NumField, OtherCalculators, SIBLING_APPS } from '@sourdough/ui/components';
import { KitchenTempField } from '@sourdough/ui/KitchenTempField';
import { WeatherField } from '@sourdough/ui/WeatherField';
import { CalendarCard, SaltCard, ScienceCard, TasteCheck, TimelineCard, TipsCard, WaterCard } from './Results';

interface Props {
  form: LactoForm;
  setForm: (f: LactoForm) => void;
  settings: Settings;
  setSettings: (s: Settings) => void;
  weather: Weather | null;
  onWeather: (w: Weather) => void;
  autoDetect: boolean;
  onAutoDetect: (on: boolean) => void;
}

const STYLES = FERMENT_TYPE_ORDER.map((t) => ({ id: t.id as FermentType, label: t.preset.name }));
const SALT_SHOWN = 4;

function VegPicker({ selected, onPick }: { selected: Set<string>; onPick: (id: string) => void }) {
  return (
    <div>
      {allVegByCategory().map((g) => (
        <div key={g.cat}>
          <p className="group">{g.label.replace(/^\S+\s/, '')}</p>
          <div className="chips" role="group" aria-label={g.label}>
            {g.items.map((v) => (
              <button key={v.id} type="button" className={selected.has(v.id) ? 'chip chip-on' : 'chip'} aria-pressed={selected.has(v.id)} onClick={() => onPick(v.id)}>
                {v.name}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export function Calculator({ form, setForm, settings, setSettings, weather, onWeather, autoDetect, onAutoDetect }: Props) {
  const units = settings.units;
  const preset = FERMENT_PRESETS[form.fermentType]!;
  const combo = comboOf(form);
  const style = combo ?? preset;
  const method = methodOf(form);
  const { veg, isMultiVeg, totalMixGrams, mixEntries } = resolveVeg(form);
  // How the vegetable list is open: to swap the one vegetable, or to build a mix.
  const [pick, setPick] = useState<'swap' | 'mix' | null>(null);
  const [allSalts, setAllSalts] = useState(false);
  const hardness = hardnessFor({ manualMgL: settings.waterHardnessMgL, postcode: settings.postcode, place: weather?.place }).hardness;

  const plan = useMemo(
    () =>
      planFromForm(form, {
        hourlyForecast: weather ? weather.hourly : null,
        currentTemp: weather ? weather.tempC : null,
        fermTempOverride: settings.kitchenTempC,
        hardness,
        unitSystem: units,
      }),
    [form, weather, settings.kitchenTempC, hardness, units],
  );
  const forecast = useMemo(
    () => computeFermentTemp(weather ? weather.hourly : null, weather ? weather.tempC : null, 14, units),
    [weather, units],
  );

  const set = <K extends keyof LactoForm>(k: K, v: LactoForm[K]) => setForm({ ...form, [k]: v });
  const saltRec = recommendedSaltPct(veg, method);
  const saltTypes = allSalts ? SALT_TYPE_ORDER : SALT_TYPE_ORDER.slice(0, SALT_SHOWN);
  // A salt type chosen from the hidden ones must stay visible.
  const shownSalts = saltTypes.includes(form.saltType) ? saltTypes : [...saltTypes, form.saltType];
  const vegWeightN = isMultiVeg ? totalMixGrams : parseFloat(form.vegWeight) || 0;
  const selectedVeg = new Set(isMultiVeg ? form.vegMix.map((m) => m.vegId) : [form.vegId]);

  const tempNote =
    settings.kitchenTempC > 0
      ? `Using your set temperature ${formatTemp(settings.kitchenTempC, units, 1)}.${weather ? ` The local forecast would have been ${formatTemp(forecast.effectiveTemp, units, 1)}.` : ''}`
      : weather
        ? `${forecast.summary}.`
        : `No temperature known, so ${formatTemp(forecast.effectiveTemp, units, 0)} is assumed. Set where the jar will sit, or use your location for the forecast.`;

  const typeLabel = styleLabel(form);

  return (
    <div className="stack">
      <fieldset className="card">
        <legend>Style</legend>
        <ChipGroup<FermentType> label="Ferment style" options={STYLES} value={form.fermentType} onChange={(t) => setForm(selectPreset(form, t))} />
        <p className="hint">
          {combo ? `${combo.name}: ${combo.description}` : preset.description}
        </p>
        <details>
          <summary className="link" style={{ display: 'inline-flex', alignItems: 'center', cursor: 'pointer' }}>
            Popular combinations
          </summary>
          <div className="chips" role="group" aria-label="Popular combinations">
            {VEG_COMBOS.map((c) => (
              <button key={c.id} type="button" className={combo?.id === c.id ? 'chip chip-on' : 'chip'} aria-pressed={combo?.id === c.id} onClick={() => setForm(applyCombo(form, c))}>
                {c.name}
              </button>
            ))}
          </div>
        </details>
      </fieldset>

      <fieldset className="card">
        <legend>Vegetable</legend>
        {isMultiVeg ? (
          <>
            {mixEntries.map((m) => (
              <div className="mixrow" key={m.vegId}>
                <NumField label={m.veg.name} value={m.grams} suffix="g" onChange={(g) => setForm(updateMixGrams(form, m.vegId, g))} />
                <button type="button" className="btn btn-small" aria-label={`Remove ${m.veg.name}`} onClick={() => setForm(toggleVegInMix(form, m.vegId))} style={{ marginBottom: 10 }}>
                  Remove
                </button>
              </div>
            ))}
            <p className="hint">
              {Math.round(totalMixGrams)} g in all · {veg.waterContentPct} % water on average
            </p>
            <div className="row">
              <button type="button" className="btn btn-small" onClick={() => setPick(pick === 'mix' ? null : 'mix')} aria-expanded={pick === 'mix'}>
                {pick === 'mix' ? 'Done adding' : 'Add a vegetable'}
              </button>
              <button type="button" className="link" onClick={() => { setForm(clearMix(form)); setPick(null); }}>
                Back to one vegetable
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="veg">
              <span>
                <strong>{veg.name}</strong>
                <span className="hint" style={{ display: 'block', margin: 0 }}>{veg.waterContentPct} % water</span>
              </span>
              <button type="button" className="btn btn-small" onClick={() => setPick(pick === 'swap' ? null : 'swap')} aria-expanded={pick === 'swap'}>
                {pick === 'swap' ? 'Close' : 'Change'}
              </button>
            </div>
            {pick !== 'mix' && (
              <button type="button" className="link" onClick={() => setPick(pick === 'swap' ? 'mix' : 'mix')}>
                Mix several vegetables
              </button>
            )}
          </>
        )}
        {pick && (
          <>
            {pick === 'mix' && !isMultiVeg && <p className="hint">Tap the vegetables to add to {veg.name.toLowerCase()}.</p>}
            <VegPicker
              selected={selectedVeg}
              onPick={(id) => {
                if (pick === 'swap') {
                  setForm(selectVeg(form, id));
                  setPick(null);
                } else setForm(toggleVegInMix(form, id));
              }}
            />
          </>
        )}
      </fieldset>

      <fieldset className="card">
        <legend>Your batch</legend>
        {!isMultiVeg && (
          <NumField label="Vegetable weight" value={form.vegWeight} suffix="g" onChange={(v) => set('vegWeight', v)} />
        )}
        {method === 'brine' && (
          <NumField label="Water for the brine" value={form.waterAmount} suffix="g" hint="1 g of water is about 1 mL." onChange={(v) => set('waterAmount', v)} />
        )}
        <NumField
          label="Salt"
          value={form.saltPct}
          suffix="%"
          onChange={(v) => set('saltPct', v)}
          hint={`Recommended ${saltRec} % ${method === 'brine' ? 'of the water' : 'of the vegetable weight'} for ${veg.name.toLowerCase()}. Usual range for ${style.name.toLowerCase()} is ${style.saltPctMin} to ${style.saltPctMax} %.`}
        />

        <h3>Salt type</h3>
        <ChipGroup<SaltCrystal>
          label="Salt type"
          options={shownSalts.map((s) => ({ id: s, label: SALT_LABELS[s] }))}
          value={form.saltType}
          onChange={(s) => set('saltType', s)}
        />
        {SALT_TYPE_ORDER.length > SALT_SHOWN && (
          <button type="button" className="link" onClick={() => setAllSalts(!allSalts)} style={{ marginTop: -8 }}>
            {allSalts ? 'Fewer salts' : `${SALT_TYPE_ORDER.length - SALT_SHOWN} more…`}
          </button>
        )}

        <h3>Cut size</h3>
        <ChipGroup<PrepSize>
          label="Cut size"
          options={PREP_SIZE_ORDER.map((p) => ({ id: p, label: PREP_SIZE_LABELS[p] }))}
          value={form.prepSize}
          onChange={(p) => set('prepSize', p)}
        />
        <p className="hint">
          Finer cuts ferment faster.
          {veg.category === 'leafy' ? ' Shredded cabbage is done in about half the time of whole heads.' : ''}
        </p>

        <Check
          checked={form.useStarter}
          onChange={(on) => set('useStarter', on)}
          title="Starter culture"
          detail="Commercial sachet or fresh mild brine. Skips most of the slow start."
        />
      </fieldset>

      <fieldset className="card">
        <legend>Jar temperature</legend>
        <KitchenTempField label="Where the jar will sit" settings={settings} onChange={setSettings} emptyWhenZero />
        <div className="converted">
          <p>{tempNote}</p>
          <p className="hint" style={{ margin: 0 }}>
            The forecast is the outdoor temperature. A jar on a kitchen counter sits warmer, so set your kitchen temperature. It is the biggest single effect on the timing.
          </p>
        </div>

        {weather && (
          <>
            <h3>Forecast, outdoors</h3>
            {forecast.dailyTemps.slice(0, 5).map((d) => {
              const lo = Math.max(0, Math.min(30, d.low));
              const hi = Math.max(lo, Math.min(30, d.high));
              return (
                <div className="fc" key={d.day}>
                  <span>{d.day.slice(0, 3)}</span>
                  <span className="track">
                    <span className="bar" style={{ left: `${(lo / 30) * 100}%`, width: `${Math.max(2, ((hi - lo) / 30) * 100)}%` }} />
                  </span>
                  <span className="tt">
                    {Math.round(d.high)}° / {Math.round(d.low)}°
                  </span>
                </div>
              );
            })}
            <p className="hint">From your location · Open-Meteo. Bars run from 0 to 30 °C.</p>
          </>
        )}
        <WeatherField weather={weather} onWeather={onWeather} autoDetect={autoDetect} onAutoDetect={onAutoDetect} purpose="the jar temperature" place />
      </fieldset>

      <p className="hint center" style={{ margin: 0 }}>
        The result updates as you change anything.
      </p>

      {plan.ok ? (
        <>
          <SaltCard plan={plan} method={method} units={units} />
          <TimelineCard plan={plan} timeline={plan.timeline} units={units} />
          {!plan.timing.stalled && (
            <CalendarCard
              plan={plan}
              timeline={plan.timeline}
              presetName={typeLabel.name}
              presetEmoji={typeLabel.emoji}
              vegName={veg.name}
              method={method}
              vegWeightG={vegWeightN}
              waterG={method === 'brine' ? parseFloat(form.waterAmount) || 0 : 0}
              saltPct={parseFloat(form.saltPct) || 0}
              units={units}
            />
          )}
          <TasteCheck />
          <TipsCard plan={plan} preset={preset} combo={combo} styleName={typeLabel.name} />
          {method === 'brine' && <WaterCard lines={plan.waterAdvice} />}
          <ScienceCard preset={preset} combo={combo} researchNote={isMultiVeg ? undefined : veg.researchNote} />
        </>
      ) : (
        <p className="error" role="status">
          {plan.error}
        </p>
      )}

      <OtherCalculators apps={SIBLING_APPS.filter((a) => a.id !== 'lacto')} />
    </div>
  );
}
