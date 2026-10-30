import { useMemo } from 'react';
import type { YogurtType } from '@sourdough/calc/models/types';
import { MILK_TYPES, YOGURT_CULTURES, YOGURT_TYPE_ORDER, findMilk } from '@sourdough/calc/data/yogurtCultures';
import { PREHEAT_MINUTES, PREHEAT_TEMP_C } from '@sourdough/calc/lib/yogurtCalculations';
import { planYogurt } from '@sourdough/calc/lib/yogurtPlan';
import { computeFermentTemp } from '@sourdough/calc/lib/lactoCalculations';
import { formatTemp } from '@sourdough/calc/lib/unitConversion';
import type { Settings } from '@sourdough/core/settings';
import type { Weather } from '@sourdough/core/weather';
import { Check, ChipGroup, KV, Note, NumField } from '@sourdough/ui/components';
import { WeatherField } from '@sourdough/ui/WeatherField';
import {
  recommendedSachets,
  selectCulture,
  setBatchGrams,
  setLitres,
  setSachets,
  type Form,
} from './form';
import { ScienceCard, SetCheck, TipsCard, TimelineCard, YieldCard } from './Results';

interface Props {
  form: Form;
  setForm: (f: Form) => void;
  settings: Settings;
  /** The weather reading if it is still fresh. */
  weather: Weather | null;
  onWeather: (w: Weather) => void;
}

const cultureOptions = (section: 'thermophilic' | 'mesophilic') =>
  YOGURT_TYPE_ORDER.filter((c) => c.section === section).map((c) => ({ id: c.id, label: c.preset.name.replace(/ Yogurt$/i, '') }));

const THERMOPHILIC = cultureOptions('thermophilic');
const MESOPHILIC = cultureOptions('mesophilic');

export function Calculator({ form, setForm, settings, weather, onWeather }: Props) {
  const units = settings.units;
  const preset = YOGURT_CULTURES[form.yogurtType]!;
  const milk = findMilk(form.milkId);
  const thermo = preset.type === 'thermophilic';

  const plan = useMemo(
    () =>
      planYogurt({
        preset,
        milk,
        milkLitres: form.milkLitres,
        sachetCount: form.sachetCount,
        starterSource: form.starterSource,
        previousBatchGrams: form.previousBatchGrams,
        preHeatEnabled: form.preHeat,
        hourlyForecast: weather ? weather.hourly : null,
        currentTemp: weather ? weather.tempC : null,
        fermTempOverride: settings.kitchenTempC,
        unitSystem: units,
      }),
    [preset, milk, form, weather, settings.kitchenTempC, units],
  );

  const forecast = useMemo(
    () => computeFermentTemp(weather ? weather.hourly : null, weather ? weather.tempC : null, 7, units),
    [weather, units],
  );

  const set = <K extends keyof Form>(k: K, v: Form[K]) => setForm({ ...form, [k]: v });
  const milkLitresN = parseFloat(form.milkLitres) || 0;
  const recommended = recommendedSachets(form);

  return (
    <div className="stack">
      <fieldset className="card">
        <legend>Culture</legend>
        <p className="group" style={{ marginTop: 0 }}>
          Thermophilic · 40–45 °C
        </p>
        <ChipGroup<YogurtType> label="Thermophilic cultures" options={THERMOPHILIC} value={form.yogurtType} onChange={(t) => setForm(selectCulture(form, t))} />
        <p className="group">Mesophilic · room temperature</p>
        <ChipGroup<YogurtType> label="Mesophilic cultures" options={MESOPHILIC} value={form.yogurtType} onChange={(t) => setForm(selectCulture(form, t))} />
        <Note>
          <p>
            <strong>{preset.name}</strong>
          </p>
          <p className="hint">{preset.description}</p>
        </Note>
      </fieldset>

      <fieldset className="card">
        <legend>Milk</legend>
        <ChipGroup label="Milk" options={MILK_TYPES.map((m) => ({ id: m.id, label: m.name }))} value={form.milkId} onChange={(id) => set('milkId', id)} />
        <p className="hint">
          <strong>{milk.name}:</strong> {milk.fatPct} % fat · {milk.proteinPct} % protein · {milk.carbsPct} % carbs.
          {milk.notes ? ` ${milk.notes}` : ''}
        </p>
        <NumField
          label="Amount of milk"
          value={form.milkLitres}
          onChange={(v) => setForm(setLitres(form, v))}
          suffix="L"
          hint={`Typical for ${preset.name.replace(/ Yogurt$/i, '')}: ${preset.typicalMilkLitres} L.`}
        />
      </fieldset>

      <fieldset className="card">
        <legend>Starter and method</legend>
        {form.starterSource === 'sachet' ? (
          <NumField
            label="Sachets"
            value={form.sachetCount}
            onChange={(v) => setForm(setSachets(form, v))}
            suffix="pcs"
            hint={
              form.sachetTouched && String(recommended) !== form.sachetCount
                ? `Calculated for you: ${recommended} for ${milkLitresN || preset.typicalMilkLitres} L.`
                : `Calculated for you: 1 sachet per ${Math.round(1 / preset.starterRatio)} L is recommended.`
            }
          />
        ) : (
          <NumField
            label="Previous batch"
            value={form.previousBatchGrams}
            onChange={(v) => setForm(setBatchGrams(form, v))}
            suffix="g"
            hint="About 30 g per litre of milk, plain and unflavoured."
          />
        )}
        <Check
          checked={form.starterSource === 'previous-batch'}
          onChange={(on) => set('starterSource', on ? 'previous-batch' : 'sachet')}
          title="Previous batch starter"
          detail="Use yogurt from your last batch instead of freeze-dried sachets. Then this field becomes grams, about 30 g per litre of milk, plain and unflavoured."
        />
        <Check
          checked={form.preHeat}
          onChange={(on) => set('preHeat', on)}
          title="Pre-heat milk"
          detail={`Heat to ${formatTemp(PREHEAT_TEMP_C, units, 0)} for ${PREHEAT_MINUTES} min. Denatures proteins for a thicker set.`}
        />
      </fieldset>

      <fieldset className="card">
        <legend>Incubation temperature</legend>
        {thermo ? (
          <>
            <KV
              rows={[
                ['This culture', formatTemp(preset.typicalTempC, units, 0)],
                ['Workable range', `${formatTemp(preset.tempMinC, units, 0)} – ${formatTemp(preset.tempMaxC, units, 0)}`],
              ]}
            />
            <p className="hint">Thermophilic cultures are held at a set temperature, so the weather does not change the time.</p>
            <Note kind="care">
              <p>
                <strong>Choose a mesophilic culture</strong> (Amasi, Filmjölk, Viili…) and this becomes your room
                temperature. It comes from the forecast, or from the kitchen temperature you set in Settings.
              </p>
            </Note>
          </>
        ) : (
          <>
            <KV
              rows={[
                [
                  'Room temperature',
                  plan.ok ? formatTemp(plan.incubationTempC, units, 1) : formatTemp(forecast.effectiveTemp, units, 1),
                ],
                ['Workable range', `up to ${formatTemp(preset.tempMaxC, units, 0)}`],
              ]}
            />
            <p className="hint">
              {settings.kitchenTempC > 0
                ? `Using your kitchen temperature from Settings, ${formatTemp(settings.kitchenTempC, units, 1)}.`
                : weather
                  ? `${forecast.summary}. Fermenting indoors? Set your room temperature in Settings.`
                  : `No temperature known, so ${formatTemp(forecast.effectiveTemp, units, 0)} is assumed. Set your room temperature in Settings, or use your location for the forecast.`}
            </p>
            <WeatherField
              weather={weather}
              onWeather={onWeather}
              autoDetect={form.autoDetect}
              onAutoDetect={(on) => set('autoDetect', on)}
              purpose="the room temperature"
            />
          </>
        )}
      </fieldset>

      <p className="hint center" style={{ margin: 0 }}>
        The result updates as you change anything.
      </p>

      {plan.ok ? (
        <>
          <YieldCard plan={plan} preset={preset} units={units} tempText={formatTemp(plan.incubationTempC, units, thermo ? 0 : 1)} />
          <TimelineCard points={plan.timeline} />
          <SetCheck key={form.yogurtType} hoursMin={plan.results.incubationHoursMin} hoursMax={plan.results.incubationHoursMax} />
          <TipsCard plan={plan} preset={preset} />
          <ScienceCard preset={preset} />
        </>
      ) : (
        <p className="error" role="status">
          {plan.error}
        </p>
      )}
    </div>
  );
}
