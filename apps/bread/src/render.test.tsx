// Server-render smoke tests of every tab, in the states that matter.
import { renderToString } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { DEFAULT_BREAD_FORM, planBread, type BreadForm } from '@sourdough/calc/lib/breadPlan';
import { hardnessFor } from '@sourdough/calc/lib/hardnessFor';
import { starterStateFrom } from '@sourdough/calc/lib/starterLog';
import type { StarterFeeding } from '@sourdough/calc/models/types';
import { DEFAULT_SETTINGS, type Settings } from '@sourdough/core/settings';
import { Calculator } from './Calculator';
import type { Ctx } from './ctx';
import { HistoryPage } from './HistoryPage';
import { SettingsPage } from './SettingsPage';
import { StarterPage } from './StarterPage';
import { DEFAULT_DEFAULTS } from './state';
import { loafText } from './share';

const NOW = new Date(2026, 9, 28, 17, 30);
const feeding = (over: Partial<StarterFeeding> = {}): StarterFeeding => ({
  id: 'f1',
  timestamp: new Date(NOW.getTime() - 3 * 3600_000).toISOString(),
  flourUsed: 'Generic: Bread Flour',
  flourGrams: 50,
  waterGrams: 50,
  starterKeptGrams: 50,
  roomTempC: 20,
  ...over,
});

function make(over: Partial<BreadForm> = {}, settingsOver: Partial<Settings> = {}, feedings: StarterFeeding[] = [], mixedAt: Date | null = null) {
  const settings = { ...DEFAULT_SETTINGS, ...settingsOver };
  const form = { ...DEFAULT_BREAD_FORM, ...over };
  const roomTempC = settings.kitchenTempC > 0 ? settings.kitchenTempC : 22;
  const starter = starterStateFrom(feedings, roomTempC, NOW);
  const plan = planBread(form, { now: NOW, roomTempC, hardness: hardnessFor({ manualMgL: settings.waterHardnessMgL, postcode: settings.postcode }).hardness, unitSystem: settings.units, starter, mixedAt });
  const c: Ctx = {
    form, setForm: () => {}, settings, setSettings: () => {}, plan, starter, now: NOW, roomTempC,
    roomSource: settings.kitchenTempC > 0 ? 'set' : 'assumed', weather: null, onWeather: () => {}, autoDetect: false, onAutoDetect: () => {}, goSettings: () => {}, goStarter: () => {},
  };
  const a = { mixedAt, onMixed: () => {}, onResetClock: () => {}, onFeedNow: () => {}, onSave: () => {}, onShare: () => {}, status: null };
  return { c, a, plan, form, settings, starter };
}
const clean = (out: string) => {
  expect(out).not.toContain('NaN');
  expect(out).not.toContain('undefined');
};

describe('calculator', () => {
  it('renders the default loaf with the weights from the design', () => {
    const { c, a } = make({}, { kitchenTempC: 20 });
    const out = renderToString(<Calculator c={c} a={a} />);
    for (const s of ['Flour', 'Your starter', 'Bake in', 'When', 'Your recipe', 'Steps', 'Rise check', 'What this estimate assumes']) expect(out).toContain(s);
    expect(out).toContain('375 g');
    expect(out).toContain('I’ve mixed');
    clean(out);
  });

  it('feed first adds the Feed step and the feed button', () => {
    const { c, a } = make({ starterMode: 'fed', modeChosen: true });
    const out = renderToString(<Calculator c={c} a={a} />);
    expect(out).toContain('>Feed<');
    expect(out).toContain('I’ve fed it');
    expect(out).toContain('Feed ratio');
    clean(out);
  });

  it('a recent feeding shows when it peaks instead of the feed button', () => {
    const { c, a } = make({}, {}, [feeding()]);
    const out = renderToString(<Calculator c={c} a={a} />);
    expect(out).toContain('Peaks about');
    clean(out);
  });

  it('says nothing about water hardness until the person has set it', () => {
    const none = renderToString(<Calculator c={make().c} a={make().a} />);
    expect(none).not.toContain('assuming moderate');
    const set = make({}, { waterHardnessMgL: 280 });
    const out = renderToString(<Calculator c={set.c} a={set.a} />);
    expect(out).toContain('280 mg/L');
    expect(out).not.toContain('→');
  });

  it('finds the hardness from a UK postcode and says so', () => {
    const { c, a } = make({}, { postcode: 'G1 1AA' });
    const out = renderToString(<Calculator c={c} a={a} />);
    expect(out).toContain('from your postcode');
    expect(out).toMatch(/<strong>soft<\/strong> · (<!-- -->)?20(<!-- -->)? mg\/L/);
  });

  it('once mixed, says when to start checking', () => {
    const { c, a } = make({}, {}, [], new Date(NOW.getTime() - 3600_000));
    const out = renderToString(<Calculator c={c} a={a} />);
    expect(out).toContain('Start checking the dough at');
    expect(out).not.toContain('>I’ve mixed<');
  });

  it('warns when a ready-by time is too early, and offers the earliest', () => {
    const { c, a } = make({ planMode: 'readyBy', readyDay: 0, readyTime: '20:00' });
    const out = renderToString(<Calculator c={c} a={a} />);
    expect(out).toContain('That is earlier than it can be.');
    expect(out).toContain('Use ');
  });

  it('asks for flour instead of showing a result when it is empty', () => {
    const { c, a } = make({ flours: [{ key: 'flour_0', label: 'Generic: Bread Flour', grams: '' }] });
    const out = renderToString(<Calculator c={c} a={a} />);
    expect(out).toContain('Enter the weight of your flour');
    expect(out).not.toContain('Your recipe');
  });

  it('shows imperial units', () => {
    const { c, a } = make({}, { units: 'imperial' });
    const out = renderToString(<Calculator c={c} a={a} />);
    expect(out).toContain('oz');
    expect(out).toContain('°F');
  });

  it('a blend lists each flour in the bowl', () => {
    const { c, a } = make({ flours: [{ key: 'flour_0', label: 'Generic: Bread Flour', grams: '300' }, { key: 'flour_1', label: 'Generic: Wholemeal', grams: '200' }] });
    const out = renderToString(<Calculator c={c} a={a} />);
    expect(out).toContain('Flour 2');
    clean(out);
  });
});

describe('a feeding made a moment ago', () => {
  it('counts as fed for this loaf once the clock has caught up, and not while it looks like the future', () => {
    const fresh = feeding({ timestamp: new Date(NOW.getTime() + 20_000).toISOString() });
    // Clock behind the feeding: not recognised (this is why the app refreshes its clock when it logs one).
    expect(make({}, {}, [fresh]).plan.mode).toBe('fridge');
    const later = new Date(NOW.getTime() + 60_000);
    const settings = { ...DEFAULT_SETTINGS };
    const starter = starterStateFrom([fresh], 22, later);
    expect(planBread(DEFAULT_BREAD_FORM, { now: later, roomTempC: 22, hardness: hardnessFor({ manualMgL: settings.waterHardnessMgL }).hardness, unitSystem: 'metric', starter, mixedAt: null }).mode).toBe('fed');
  });
});

describe('share text', () => {
  it('lists the formula and says it is an estimate', () => {
    const { plan, form } = make();
    const t = loafText(form, plan, 'metric')!;
    expect(t).toContain('Water: 375 g');
    expect(t).toContain('an estimate');
  });
  it('is null without a result', () => {
    const { plan, form } = make({ flours: [{ key: 'flour_0', label: 'Generic: Bread Flour', grams: '' }] });
    expect(loafText(form, plan, 'metric')).toBeNull();
  });
});

describe('starter tab', () => {
  const page = (feedings: StarterFeeding[]) => {
    const { plan, starter, settings } = make({}, {}, feedings);
    return renderToString(
      <StarterPage starter={starter} plan={plan} now={NOW} roomTempC={22} settings={settings} hydration={100} onFeed={() => {}} onMarkPeaked={() => {}} onFridge={() => {}} onDelete={() => {}} goCalc={() => {}} />,
    );
  };
  it('renders with an empty log', () => {
    const out = page([]);
    for (const s of ['No feeding logged yet', 'How fast it runs in your kitchen', 'Feed now', 'Feeding log']) expect(out).toContain(s);
    clean(out);
  });
  it('renders a log entry with its actions', () => {
    const out = page([feeding()]);
    expect(out).toContain('since last fed');
    expect(out).toContain('Mark as peaked');
    expect(out).toContain('Into the fridge');
    clean(out);
  });
  it('a jar in the fridge offers to take it out', () => {
    const out = page([feeding({ fridgeAt: new Date(NOW.getTime() - 3600_000).toISOString() })]);
    expect(out).toContain('I’ve taken it out of the fridge');
  });
});

describe('history and settings', () => {
  it('says so when nothing is saved', () => {
    expect(renderToString(<HistoryPage loaves={[]} units="metric" onOpen={() => {}} onDelete={() => {}} />)).toContain('No saved loaves yet');
  });
  it('renders settings with defaults, hardness, kitchen temperature', () => {
    const out = renderToString(<SettingsPage settings={DEFAULT_SETTINGS} onChange={() => {}} defaults={DEFAULT_DEFAULTS} onDefaults={() => {}} onReset={() => {}} weather={null} saved />);
    for (const s of ['Default values', 'Kitchen temperature', 'Water hardness', 'Theme', 'Units', 'Reset to factory defaults']) expect(out).toContain(s);
  });
});
