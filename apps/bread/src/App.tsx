import { useEffect, useMemo, useState } from 'react';
import type { StarterFeeding } from '@sourdough/calc/models/types';
import { planBread, type BreadForm } from '@sourdough/calc/lib/breadPlan';
import { hardnessFor } from '@sourdough/calc/lib/hardnessFor';
import { STARTER_FEED_GRAMS } from '@sourdough/calc/lib/lazyMethod';
import {
  addFeeding,
  buildFeeding,
  deleteFeeding,
  fridgeStateIn,
  generateFeedingId,
  markPeakedIn,
  starterStateFrom,
} from '@sourdough/calc/lib/starterLog';
import { DEFAULT_SETTINGS, applyTheme, loadSettings, saveSettings, type Settings } from '@sourdough/core/settings';
import type { Weather } from '@sourdough/core/weather';
import { Header, TabBar, type TabDef } from '@sourdough/ui/components';
import { Calculator } from './Calculator';
import type { Ctx, RoomSource } from './ctx';
import { HistoryPage } from './HistoryPage';
import { BreadLogo } from './Logo';
import type { RecipeActions } from './Recipe';
import { SettingsPage } from './SettingsPage';
import { StarterPage } from './StarterPage';
import { DEFAULT_STATE, formFromDefaults, type AppState, type BreadDefaults, type SavedLoaf } from './state';
import { SETTINGS_KEY, freshWeather, loadFeedings, loadLoaves, loadState, resetAll, saveFeedings, saveLoaves, saveState } from './store';
import { loafText, shareText } from './share';

type Tab = 'calc' | 'starter' | 'history' | 'settings';

const SUBTITLES: Record<Tab, string> = {
  calc: 'Lazy sourdough: one bowl, no kneading',
  starter: 'Your starter: state, feeding and fridge',
  history: 'The loaves you saved, kept on this device.',
  settings: 'Set your defaults once; adjust any loaf as you go.',
};
const TITLES: Record<Tab, string> = { calc: 'Bread', starter: 'Starter', history: 'History', settings: 'Settings' };

const ASSUMED_ROOM_C = 22;

export default function App() {
  const [state, setState] = useState<AppState>(loadState);
  const [settings, setSettings] = useState<Settings>(() => loadSettings(SETTINGS_KEY));
  const [feedings, setFeedings] = useState<StarterFeeding[]>(loadFeedings);
  const [loaves, setLoaves] = useState<SavedLoaf[]>(loadLoaves);
  const [tab, setTab] = useState<Tab>('calc');
  const [saved, setSaved] = useState(true);
  const [status, setStatus] = useState<string | null>(null);
  // The starter ages while the app is open.
  const [now, setNow] = useState(() => new Date());
  // Defaults from Settings fill the form only while the person has not changed anything yet.
  const [touched, setTouched] = useState(false);

  useEffect(() => applyTheme(settings.theme), [settings.theme]);
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(id);
  }, []);
  useEffect(() => {
    setSaved(saveState(state) && saveSettings(SETTINGS_KEY, settings) && saveFeedings(feedings) && saveLoaves(loaves));
  }, [state, settings, feedings, loaves]);
  useEffect(() => {
    if (!status) return;
    const t = setTimeout(() => setStatus(null), 4000);
    return () => clearTimeout(t);
  }, [status]);

  const weather = useMemo(() => freshWeather(state.weather, Date.now()), [state.weather]);
  const roomSource: RoomSource = settings.kitchenTempC > 0 ? 'set' : weather ? 'weather' : 'assumed';
  const roomTempC = roomSource === 'set' ? settings.kitchenTempC : weather ? weather.tempC : ASSUMED_ROOM_C;
  const mixedAt = state.mixedAt ? new Date(state.mixedAt) : null;

  const starter = useMemo(() => starterStateFrom(feedings, roomTempC, now), [feedings, roomTempC, now]);
  const form = state.form;
  const plan = useMemo(
    () =>
      planBread(form, {
        now,
        roomTempC,
        hardness: hardnessFor({ manualMgL: settings.waterHardnessMgL, postcode: settings.postcode, place: weather?.place }).hardness,
        tapTempC: weather?.tapTempC ?? null,
        unitSystem: settings.units,
        starter,
        mixedAt,
      }),
    // mixedAt is derived from state.mixedAt; depend on the string so the memo is stable.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [form, now, roomTempC, settings.waterHardnessMgL, settings.postcode, weather, settings.units, starter, state.mixedAt],
  );

  const setForm = (f: BreadForm) => {
    setState((s) => ({ ...s, form: f }));
    setTouched(true);
  };
  const updateSettings = (s: Settings) => {
    setSettings(s);
    setTouched(true);
  };
  const setWeather = (w: Weather) => setState((s) => ({ ...s, weather: w }));
  const setDefaults = (d: BreadDefaults) =>
    setState((s) => ({ ...s, defaults: d, form: touched ? s.form : { ...formFromDefaults(d), starterMode: s.form.starterMode, modeChosen: s.form.modeChosen } }));

  // ── The starter log ──
  const flourShares = starter.flourBlend ?? [{ label: 'Generic: Bread Flour', share: 100 }];
  // The clock only ticks once a minute, so a change to the log refreshes it too: a feeding made a
  // moment ago must not look as if it is from the future.
  const changeLog = (change: (l: StarterFeeding[]) => StarterFeeding[]) => {
    setNow(new Date());
    setFeedings(change);
  };
  const logFeeding = (f: StarterFeeding) => changeLog((l) => addFeeding(l, f));
  const feedForLoaf = () => {
    const rec = buildFeeding({
      id: generateFeedingId(),
      now: new Date(),
      flours: flourShares.map((s) => ({ label: s.label, grams: String(Math.round((plan.feedAmounts.flourGrams * s.share) / 100)) })),
      waterGrams: String(plan.feedAmounts.waterGrams),
      keptGrams: String(plan.feedAmounts.keptGrams),
      roomTempC,
    });
    if (rec) logFeeding(rec);
  };
  // The lazy loop: after mixing, feed what is left in the jar and put it back in the fridge.
  const mixedNow = () => {
    const at = new Date();
    setState((s) => ({ ...s, mixedAt: at.toISOString() }));
    setNow(at);
    if (plan.fed && plan.loafFeeding) {
      if (!plan.loafFeeding.fridgeAt) changeLog((l) => fridgeStateIn(l, plan.loafFeeding!.id, 'in', at));
    } else if (!plan.fed) {
      const rec = buildFeeding({
        id: generateFeedingId(),
        now: at,
        flours: flourShares.map((s) => ({ label: s.label, grams: String(Math.round((STARTER_FEED_GRAMS * s.share) / 100)) })),
        waterGrams: String(STARTER_FEED_GRAMS),
        keptGrams: '',
        roomTempC,
        intoFridge: true,
      });
      if (rec) logFeeding(rec);
    }
  };

  // ── Save and share ──
  const saveLoaf = () => {
    if (!plan.chosen?.estimate) return;
    const loaf: SavedLoaf = {
      id: `loaf_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`,
      createdAt: new Date().toISOString(),
      form,
      summary: {
        flourGrams: plan.flourGrams,
        waterPct: parseFloat(form.waterPct) || 0,
        starterPct: parseFloat(form.starterPct) || 0,
        riseHours: plan.chosen.estimate.bulkHours,
        flours: plan.flourRows.map((r) => r.flour.label).join(' + '),
      },
    };
    setLoaves((l) => [loaf, ...l].slice(0, 200));
    setStatus('Saved. Find it in History.');
  };
  const share = async () => {
    const text = loafText(form, plan, settings.units);
    if (!text) return;
    const r = await shareText(text);
    setStatus(r === 'copied' ? 'Copied to the clipboard.' : r === 'shared' ? 'Shared.' : null);
  };

  const ctx: Ctx = {
    form,
    setForm,
    settings,
    setSettings: updateSettings,
    plan,
    starter,
    now,
    roomTempC,
    roomSource,
    weather,
    onWeather: setWeather,
    autoDetect: state.autoDetect,
    onAutoDetect: (autoDetect) => setState((s) => ({ ...s, autoDetect })),
    goSettings: () => setTab('settings'),
    goStarter: () => setTab('starter'),
  };
  const actions: RecipeActions = {
    mixedAt,
    onMixed: mixedNow,
    onResetClock: () => setState((s) => ({ ...s, mixedAt: null })),
    onFeedNow: feedForLoaf,
    onSave: saveLoaf,
    onShare: () => void share(),
    status,
  };

  const tabs: TabDef<Tab>[] = [
    { id: 'calc', label: 'Calculator' },
    { id: 'starter', label: 'Starter' },
    { id: 'history', label: loaves.length > 0 ? `History (${loaves.length})` : 'History' },
    { id: 'settings', label: 'Settings' },
  ];

  return (
    <div className="app">
      <Header title={TITLES[tab]} subtitle={SUBTITLES[tab]} logo={<span className="logo"><BreadLogo /></span>} />
      <main>
        {tab === 'calc' && <Calculator c={ctx} a={actions} />}
        {tab === 'starter' && (
          <StarterPage
            starter={starter}
            plan={plan}
            now={now}
            roomTempC={roomTempC}
            settings={settings}
            hydration={parseFloat(form.starterHydration) || 100}
            onFeed={logFeeding}
            onMarkPeaked={(id) => changeLog((l) => markPeakedIn(l, id))}
            onFridge={(id, s) => changeLog((l) => fridgeStateIn(l, id, s))}
            onDelete={(id) => changeLog((l) => deleteFeeding(l, id))}
            goCalc={() => setTab('calc')}
          />
        )}
        {tab === 'history' && (
          <HistoryPage
            loaves={loaves}
            units={settings.units}
            onOpen={(l) => {
              setForm(l.form);
              setTab('calc');
              window.scrollTo(0, 0);
            }}
            onDelete={(id) => setLoaves((l) => l.filter((x) => x.id !== id))}
          />
        )}
        {tab === 'settings' && (
          <SettingsPage
            settings={settings}
            onChange={updateSettings}
            defaults={state.defaults}
            onDefaults={setDefaults}
            saved={saved}
            weather={weather}
            onReset={() => {
              if (!window.confirm('Reset the calculator, settings, starter log and saved loaves on this device?')) return;
              resetAll();
              setState(DEFAULT_STATE);
              setSettings(DEFAULT_SETTINGS);
              setFeedings([]);
              setLoaves([]);
              setTouched(false);
            }}
          />
        )}
      </main>
      <TabBar tabs={tabs} active={tab} onChange={setTab} />
    </div>
  );
}
