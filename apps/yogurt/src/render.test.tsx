// Server-render smoke tests: every culture renders a full calculator without
// throwing, with the right temperature behaviour. (No browser needed.)
import { renderToString } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { YOGURT_CULTURES } from '@sourdough/calc/data/yogurtCultures';
import { DEFAULT_SETTINGS } from '@sourdough/core/settings';
import { Calculator } from './Calculator';
import { SettingsPage } from './SettingsPage';
import { DEFAULT_FORM, selectCulture } from './form';

const html = (type: keyof typeof YOGURT_CULTURES, over: Partial<typeof DEFAULT_SETTINGS> = {}, form = {}) =>
  renderToString(
    <Calculator
      form={{ ...selectCulture(DEFAULT_FORM, type as never), ...form }}
      setForm={() => {}}
      settings={{ ...DEFAULT_SETTINGS, ...over }}
      weather={null}
      onWeather={() => {}}
    />,
  );

describe('calculator', () => {
  it.each(Object.keys(YOGURT_CULTURES))('renders %s', (id) => {
    const out = html(id);
    expect(out).toContain('Yield and timing');
    expect(out).toContain('Timeline');
    expect(out).toContain('Set check');
    expect(out).not.toContain('NaN');
    expect(out).not.toContain('undefined');
  });

  it('shows the Bulgarian numbers from the design: 8 h at 42 °C, 2 L makes about 1998 g', () => {
    const out = html('bulgarian');
    expect(out).toContain('8 h');
    expect(out).toContain('42°C');
    expect(out).toContain('1998');
  });

  it('uses the kitchen temperature for a mesophilic culture, not for a thermophilic one', () => {
    expect(html('filmjolk', { kitchenTempC: 24 })).toContain('your kitchen temperature from Settings');
    expect(html('bulgarian', { kitchenTempC: 24 })).not.toContain('your kitchen temperature');
  });

  it('asks for the milk volume instead of showing results when it is empty', () => {
    const out = html('bulgarian', {}, { milkLitres: '' });
    expect(out).toContain('Enter the amount of milk.');
    expect(out).not.toContain('Yield and timing');
  });

  it('shows imperial units without changing the calculation', () => {
    const out = html('bulgarian', { units: 'imperial' });
    expect(out).toContain('oz');
    expect(out).toContain('°F');
  });

  it('only offers a location lookup for a mesophilic culture', () => {
    expect(html('viili')).toContain('Use my location');
    expect(html('bulgarian')).not.toContain('Use my location');
  });
});

describe('settings', () => {
  it('renders theme, units, kitchen temperature and reset', () => {
    const out = renderToString(<SettingsPage settings={DEFAULT_SETTINGS} onChange={() => {}} onReset={() => {}} weather={null} saved />);
    for (const s of ['Kitchen temperature', 'Theme', 'Units', 'Reset to factory defaults']) expect(out).toContain(s);
  });
});
