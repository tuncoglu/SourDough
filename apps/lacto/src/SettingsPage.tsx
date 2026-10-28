import { useMemo } from 'react';
import { computeFermentTemp } from '@sourdough/calc/lib/lactoCalculations';
import { formatTemp } from '@sourdough/calc/lib/unitConversion';
import type { Settings } from '@sourdough/core/settings';
import type { Weather } from '@sourdough/core/weather';
import { NumField } from '@sourdough/ui/components';
import { SettingsScreen } from '@sourdough/ui/SettingsScreen';
import { FALLBACK_HARDNESS } from '@sourdough/calc/lib/hardnessUtils';
import { classifyHardness } from '@sourdough/calc/data/ukWaterHardness';

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
  const mgL = settings.waterHardnessMgL;
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
        <fieldset className="card">
          <legend>Water hardness</legend>
          <p className="hint" style={{ marginTop: 0 }}>
            Leave at 0 if you do not know it. Enter your local water hardness in mg/L CaCO₃ (check your water company’s website or use a test kit). It nudges the timing by a few percent at most, and only for brine ferments.
          </p>
          <NumField
            label="Hardness"
            value={mgL === 0 ? '0' : String(mgL)}
            suffix="mg/L"
            onChange={(v) => {
              const n = parseFloat(v);
              onChange({ ...settings, waterHardnessMgL: Number.isFinite(n) && n > 0 && n <= 2000 ? n : 0 });
            }}
          />
          <div className="converted">
            <p>
              {mgL > 0
                ? `Using ${mgL} mg/L, which is ${classifyHardness(mgL)}.`
                : `Not set, so ${FALLBACK_HARDNESS.mgL} mg/L (${FALLBACK_HARDNESS.classification}) is assumed.`}
            </p>
          </div>
        </fieldset>
      }
      links={
        <a href="https://github.com/tuncoglu/SourDough" rel="noreferrer">
          Source on GitHub
        </a>
      }
    />
  );
}
