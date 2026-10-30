import type { ReactNode } from 'react';
import { applyTheme, type Settings, type ThemeMode, type Units } from '@sourdough/core/settings';
import { KitchenTempField } from './KitchenTempField';

const THEMES: Array<{ id: ThemeMode; label: string }> = [
  { id: 'system', label: 'System' },
  { id: 'light', label: 'Light' },
  { id: 'dark', label: 'Dark' },
];

function Radios<T extends string>({
  name,
  label,
  options,
  value,
  onChange,
  two,
}: {
  name: string;
  label: string;
  options: Array<{ id: T; label: string }>;
  value: T;
  onChange: (v: T) => void;
  two?: boolean;
}) {
  return (
    <div className={two ? 'radio-list two' : 'radio-list'} role="radiogroup" aria-label={label}>
      {options.map((o) => (
        <label key={o.id} className={o.id === value ? 'radio checked' : 'radio'}>
          <input type="radio" name={name} checked={o.id === value} onChange={() => onChange(o.id)} />
          {o.label}
        </label>
      ))}
    </div>
  );
}

interface Props {
  settings: Settings;
  onChange: (s: Settings) => void;
  onReset: () => void;
  /** Sections particular to one app (default values, water hardness…). */
  children?: ReactNode;
  /** Cards after the kitchen temperature (water hardness...). */
  afterKitchen?: ReactNode;
  /** The kitchen temperature card; omit for apps it does not affect. */
  kitchenTemp?: { explain: string; forecastNote?: string };
  /** Whether the settings could be written to this browser. */
  saved: boolean;
}

export function SettingsScreen({ settings, onChange, onReset, children, afterKitchen, kitchenTemp, saved }: Props) {
  return (
    <div className="stack">
      {children}

      {kitchenTemp && (
        <fieldset className="card">
          <legend>Kitchen temperature</legend>
          <p className="hint" style={{ marginTop: 0 }}>
            {kitchenTemp.explain}
          </p>
          <KitchenTempField settings={settings} onChange={onChange} />
          {kitchenTemp.forecastNote && (
            <div className="converted">
              <p>{kitchenTemp.forecastNote}</p>
            </div>
          )}
        </fieldset>
      )}

      {afterKitchen}

      <fieldset className="card">
        <legend>Appearance</legend>
        <h3 style={{ marginTop: 0 }}>Theme</h3>
        <Radios
          name="theme"
          label="Theme"
          options={THEMES}
          value={settings.theme}
          onChange={(theme) => {
            applyTheme(theme);
            onChange({ ...settings, theme });
          }}
        />
        <h3>Units</h3>
        <Radios<Units>
          name="units"
          label="Units"
          two
          options={[
            { id: 'metric', label: 'Metric' },
            { id: 'imperial', label: 'Imperial' },
          ]}
          value={settings.units}
          onChange={(units) => onChange({ ...settings, units })}
        />
        <p className="hint">
          Metric shows grams and °C. Imperial shows ounces and °F. Everything is calculated in grams and °C either way.
        </p>
      </fieldset>

      {saved ? (
        <p className="ok center" style={{ margin: 0 }} role="status">
          Changes save automatically on this device.
        </p>
      ) : (
        <p className="error" role="status">
          This browser is not letting the app save anything, so your choices will be forgotten when you close it.
        </p>
      )}
      <button type="button" className="btn btn-danger" onClick={onReset}>
        Reset to factory defaults
      </button>

    </div>
  );
}
