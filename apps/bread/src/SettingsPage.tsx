import { useMemo } from 'react';
import { formatTemp } from '@sourdough/calc/lib/unitConversion';
import { computeFermentTemp } from '@sourdough/calc/lib/lactoCalculations';
import type { Settings } from '@sourdough/core/settings';
import type { Weather } from '@sourdough/core/weather';
import { NumField } from '@sourdough/ui/components';
import { HardnessCard } from '@sourdough/ui/HardnessCard';
import { SettingsScreen } from '@sourdough/ui/SettingsScreen';
import { FlourSelect } from './Cards';
import type { BreadDefaults } from './state';

interface Props {
  settings: Settings;
  onChange: (s: Settings) => void;
  defaults: BreadDefaults;
  onDefaults: (d: BreadDefaults) => void;
  onReset: () => void;
  weather: Weather | null;
  saved: boolean;
}

export function SettingsPage({ settings, onChange, defaults, onDefaults, onReset, weather, saved }: Props) {
  const forecast = useMemo(
    () => computeFermentTemp(weather ? weather.hourly : null, weather ? weather.tempC : null, 3, settings.units),
    [weather, settings.units],
  );
  const waterG = Math.round((parseFloat(defaults.flourWeight) || 0) * ((parseFloat(defaults.waterPct) || 0) / 100));
  const set = <K extends keyof BreadDefaults>(k: K, v: BreadDefaults[K]) => onDefaults({ ...defaults, [k]: v });
  return (
    <SettingsScreen
      settings={settings}
      onChange={onChange}
      onReset={onReset}
      saved={saved}
      kitchenTemp={{
        explain:
          'Your room temperature, used for the rise and the starter. Leave at 0 to use the outdoor temperature from your location if you have asked for it, or 22 °C otherwise. Temperature is the biggest single factor in how long the dough takes.',
        forecastNote: weather ? `Outdoors right now: ${formatTemp(weather.tempC, settings.units, 1)}. ${forecast.summary}.` : 'No outdoor reading yet. Use your location on the calculator screen to get one.',
      }}
      afterKitchen={
        <HardnessCard
          settings={settings}
          onChange={onChange}
          place={weather?.place}
          why="Hard water tightens gluten and can slightly slow fermentation."
        />
      }
      links={
        <a href="https://github.com/tuncoglu/SourDough" rel="noreferrer">
          Source on GitHub
        </a>
      }
    >
      <fieldset className="card">
        <legend>Default values</legend>
        <p className="hint" style={{ marginTop: 0 }}>
          Pre-filled when you open the calculator. Typical ranges: flour 100–2000 g · water 50–100 % · salt 0.5–4 % · starter hydration 40–200 %.
        </p>
        <FlourSelect id="df" label="Flour type" value={defaults.flourLabel} onChange={(v) => set('flourLabel', v)} />
        <NumField label="Flour weight" value={defaults.flourWeight} suffix="g" onChange={(v) => set('flourWeight', v)} />
        <NumField label="Water" value={defaults.waterPct} suffix="%" onChange={(v) => set('waterPct', v)} hint={`${waterG} g for the default flour weight.`} />
        <NumField label="Salt" value={defaults.saltPct} suffix="%" onChange={(v) => set('saltPct', v)} />
        <NumField label="Starter hydration" value={defaults.starterHydration} suffix="%" onChange={(v) => set('starterHydration', v)} />
      </fieldset>
    </SettingsScreen>
  );
}
