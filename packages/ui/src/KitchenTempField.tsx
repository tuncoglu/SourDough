import type { Settings } from '@sourdough/core/settings';
import { NumField } from './components';

const cToF = (c: number) => (c * 9) / 5 + 32;
const fToC = (f: number) => ((f - 32) * 5) / 9;
const round1 = (n: number) => Math.round(n * 10) / 10;

/**
 * The temperature where the jar sits, kept in the settings (always °C) and
 * shown in the person's units. Zero, or empty, means "use the forecast".
 */
export function KitchenTempField({
  settings,
  onChange,
  label = 'Temperature',
  hint,
  emptyWhenZero,
}: {
  settings: Settings;
  onChange: (s: Settings) => void;
  label?: string;
  hint?: string;
  /** Show an empty field (with a prompt) instead of 0 when no temperature is set. */
  emptyWhenZero?: boolean;
}) {
  const imperial = settings.units === 'imperial';
  const shown = settings.kitchenTempC === 0 ? (emptyWhenZero ? '' : '0') : String(round1(imperial ? cToF(settings.kitchenTempC) : settings.kitchenTempC));
  return (
    <NumField
      label={label}
      value={shown}
      suffix={imperial ? '°F' : '°C'}
      hint={hint}
      placeholder={emptyWhenZero ? 'Use the forecast' : undefined}
      onChange={(v) => {
        const n = parseFloat(v);
        if (!Number.isFinite(n) || n === 0) return onChange({ ...settings, kitchenTempC: 0 });
        onChange({ ...settings, kitchenTempC: round1(imperial ? fToC(n) : n) });
      }}
    />
  );
}
