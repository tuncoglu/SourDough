import { useMemo } from 'react';
import { computeFermentTemp } from '@sourdough/calc/lib/lactoCalculations';
import { formatTemp } from '@sourdough/calc/lib/unitConversion';
import type { Settings } from '@sourdough/core/settings';
import type { Weather } from '@sourdough/core/weather';
import { SettingsScreen } from '@sourdough/ui/SettingsScreen';

interface Props {
  settings: Settings;
  onChange: (s: Settings) => void;
  onReset: () => void;
  weather: Weather | null;
  saved: boolean;
}

export function SettingsPage({ settings, onChange, onReset, weather, saved }: Props) {
  const forecast = useMemo(
    () => computeFermentTemp(weather ? weather.hourly : null, weather ? weather.tempC : null, 7, settings.units),
    [weather, settings.units],
  );
  return (
    <SettingsScreen
      settings={settings}
      onChange={onChange}
      onReset={onReset}
      saved={saved}
      kitchenTemp={{
        explain:
          'Used by mesophilic cultures (Amasi, Filmjölk, Viili…), which ferment at room temperature. Leave at 0 to use your local weather forecast. Thermophilic cultures are held at their own temperature, so this does not change them.',
        forecastNote: weather
          ? `Today the forecast gives ${formatTemp(forecast.effectiveTemp, settings.units, 1)} outdoors.`
          : 'No forecast yet. Use your location on the calculator screen to get one.',
      }}
      links={
        <>
          <a href="https://github.com/tuncoglu/SourDough" rel="noreferrer">
            Source on GitHub
          </a>
        </>
      }
    />
  );
}
