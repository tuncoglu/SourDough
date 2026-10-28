import { useMemo } from 'react';
import { computeFermentTemp } from '@sourdough/calc/lib/lactoCalculations';
import { formatTemp } from '@sourdough/calc/lib/unitConversion';
import type { Settings } from '@sourdough/core/settings';
import type { Weather } from '@sourdough/core/weather';
import { HardnessCard } from '@sourdough/ui/HardnessCard';
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
    () => computeFermentTemp(weather ? weather.hourly : null, weather ? weather.tempC : null, 14, settings.units),
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
          'Leave at 0 to use your local weather forecast. Fermenting indoors? Enter the temperature where the jar actually sits. The outdoor forecast can be several degrees cooler, and temperature is the biggest single factor in the timing.',
        forecastNote: weather
          ? `Today the forecast gives ${formatTemp(forecast.effectiveTemp, settings.units, 1)} outdoors.`
          : 'No forecast yet. Use your location on the calculator screen to get one.',
      }}
      afterKitchen={
        <HardnessCard
          settings={settings}
          onChange={onChange}
          place={weather?.place}
          why="It nudges the timing by a few percent at most, and only for brine ferments."
        />
      }
      links={
        <a href="https://github.com/tuncoglu/SourDough" rel="noreferrer">
          Source on GitHub
        </a>
      }
    />
  );
}
