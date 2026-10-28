// Server-render smoke tests: every style and every curated combo renders a
// full calculator without throwing or printing NaN.
import { renderToString } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { FERMENT_PRESETS, VEG_COMBOS } from '@sourdough/calc/data/fermentPresets';
import { DEFAULT_LACTO_FORM, applyCombo, selectPreset, toggleVegInMix, type LactoForm } from '@sourdough/calc/lib/lactoForm';
import { DEFAULT_SETTINGS, type Settings } from '@sourdough/core/settings';
import { Calculator } from './Calculator';
import { HistoryPage } from './HistoryPage';
import { SettingsPage } from './SettingsPage';

const html = (form: LactoForm, settings: Partial<Settings> = {}) =>
  renderToString(
    <Calculator form={form} setForm={() => {}} settings={{ ...DEFAULT_SETTINGS, ...settings }} setSettings={() => {}} weather={null} onWeather={() => {}} autoDetect={false} onAutoDetect={() => {}} />,
  );

const clean = (out: string) => {
  expect(out).not.toContain('NaN');
  expect(out).not.toContain('undefined');
};

describe('calculator', () => {
  it.each(Object.keys(FERMENT_PRESETS))('renders the %s style', (id) => {
    const out = html(selectPreset(DEFAULT_LACTO_FORM, id as never));
    for (const s of ['Salt', 'Timeline', 'Taste check', 'Tips and safety']) expect(out).toContain(s);
    clean(out);
  });

  it.each(VEG_COMBOS.map((c) => [c.id, c] as const))('renders the %s combination', (_id, combo) => {
    const out = html(applyCombo(DEFAULT_LACTO_FORM, combo));
    expect(out).toContain('Timeline');
    clean(out);
  });

  it('shows the design’s default: 20 g of salt for 1 kg of cabbage at 2 %', () => {
    const out = html(DEFAULT_LACTO_FORM, { kitchenTempC: 22 });
    expect(out).toContain('20 g');
    expect(out).toContain('Maldon sea flakes');
  });

  it('uses the jar temperature the person set, and says so', () => {
    const out = html(DEFAULT_LACTO_FORM, { kitchenTempC: 19 });
    expect(out).toContain('Using your set temperature 19.0°C');
    expect(out).toContain('×1.44');
  });

  it('asks for what is missing instead of showing a result', () => {
    const out = html({ ...DEFAULT_LACTO_FORM, vegWeight: '' });
    expect(out).toContain('Enter a weight for the vegetables.');
    expect(out).not.toContain('Taste check');
  });

  it('shows a mix with a weight for each vegetable', () => {
    const out = html(toggleVegInMix(DEFAULT_LACTO_FORM, 'carrot'));
    expect(out).toContain('Back to one vegetable');
    expect(out).toContain('Carrot');
    clean(out);
  });

  it('offers a water amount only for a brine ferment', () => {
    expect(html(selectPreset(DEFAULT_LACTO_FORM, 'dill-pickles'))).toContain('Water for the brine');
    expect(html(DEFAULT_LACTO_FORM)).not.toContain('Water for the brine');
  });

  it('links to Google Calendar without sending anything itself', () => {
    const out = html(DEFAULT_LACTO_FORM, { kitchenTempC: 22 });
    expect(out).toContain('https://calendar.google.com/calendar/render');
    expect(out).toContain('rel="noopener noreferrer"');
  });

  it('shows imperial units', () => {
    const out = html(DEFAULT_LACTO_FORM, { units: 'imperial', kitchenTempC: 22 });
    expect(out).toContain('oz');
    expect(out).toContain('°F');
  });
});

describe('history and settings', () => {
  it('says so when there is no history', () => {
    expect(renderToString(<HistoryPage history={[]} units="metric" onAgain={() => {}} onDelete={() => {}} />)).toContain('No ferments yet');
  });
  it('renders settings with water hardness', () => {
    const out = renderToString(<SettingsPage settings={DEFAULT_SETTINGS} onChange={() => {}} onReset={() => {}} weather={null} saved />);
    for (const s of ['Kitchen temperature', 'Water hardness', 'Theme', 'Units', 'Reset to factory defaults']) expect(out).toContain(s);
    expect(out).toContain('120 mg/L');
  });
});
