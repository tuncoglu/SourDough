import { useEffect, useMemo, useRef, useState } from 'react';
import type { FermentHistoryEntry } from '@sourdough/calc/models/types';
import { historyDraft, planFromForm, restoreFrom, type LactoForm } from '@sourdough/calc/lib/lactoForm';
import { hardnessFor } from '@sourdough/calc/lib/hardnessFor';
import { DEFAULT_SETTINGS, applyTheme, loadSettings, saveSettings, type Settings } from '@sourdough/core/settings';
import type { Weather } from '@sourdough/core/weather';
import { Header, TabBar, type TabDef } from '@sourdough/ui/components';
import { Calculator } from './Calculator';
import { DEFAULT_STATE, type AppState } from './form';
import { HistoryPage } from './HistoryPage';
import { LactoLogo } from './Logo';
import { HISTORY_SETTLE_MS, record, type LastRecord } from './recorder';
import { SettingsPage } from './SettingsPage';
import { SETTINGS_KEY, freshWeather, loadHistory, loadState, resetAll, saveHistory, saveState } from './store';

type Tab = 'calc' | 'history' | 'settings';

const SUBTITLES: Record<Tab, string> = {
  calc: 'Choose what goes in. We’ll help with salt and timing.',
  history: 'Every ferment you worked out, kept on this device.',
  settings: 'Set your defaults once; adjust any jar as you go.',
};

export default function App() {
  const [state, setState] = useState<AppState>(loadState);
  const [settings, setSettings] = useState<Settings>(() => loadSettings(SETTINGS_KEY));
  const [history, setHistory] = useState<FermentHistoryEntry[]>(() => loadHistory());
  const [tab, setTab] = useState<Tab>('calc');
  const [saved, setSaved] = useState(true);
  // A ferment is only recorded once the person has worked on it, never for opening the app.
  const [touched, setTouched] = useState(false);
  const last = useRef<LastRecord | null>(null);

  useEffect(() => applyTheme(settings.theme), [settings.theme]);
  useEffect(() => {
    setSaved(saveState(state) && saveSettings(SETTINGS_KEY, settings) && saveHistory(history));
  }, [state, settings, history]);

  const weather = useMemo(() => freshWeather(state.weather, Date.now()), [state.weather]);
  const setForm = (form: LactoForm) => {
    setState((s) => ({ ...s, form }));
    setTouched(true);
  };
  const setWeather = (w: Weather) => setState((s) => ({ ...s, weather: w }));
  const updateSettings = (s: Settings) => {
    setSettings(s);
    setTouched(true);
  };

  // The same plan the calculator shows, for the history entry.
  const draft = useMemo(() => {
    const plan = planFromForm(state.form, {
      hourlyForecast: weather ? weather.hourly : null,
      currentTemp: weather ? weather.tempC : null,
      fermTempOverride: settings.kitchenTempC,
      hardness: hardnessFor({ manualMgL: settings.waterHardnessMgL, postcode: settings.postcode, place: weather?.place }).hardness,
      unitSystem: settings.units,
    });
    return historyDraft(state.form, plan);
  }, [state.form, weather, settings.kitchenTempC, settings.waterHardnessMgL, settings.postcode, settings.units]);

  useEffect(() => {
    if (!touched || !draft) return;
    const timer = setTimeout(() => {
      const r = record(history, draft, last.current);
      last.current = r.last;
      setHistory(r.history);
    }, HISTORY_SETTLE_MS);
    return () => clearTimeout(timer);
    // `history` is deliberately not a dependency: recording must not retrigger itself.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [touched, draft]);

  return (
    <div className="app">
      <Header
        title={tab === 'settings' ? 'Settings' : tab === 'history' ? 'History' : 'Lacto-ferment'}
        subtitle={SUBTITLES[tab]}
        logo={<span className="logo"><LactoLogo /></span>}
      />
      <main>
        {tab === 'calc' && (
          <Calculator
            form={state.form}
            setForm={setForm}
            settings={settings}
            setSettings={updateSettings}
            weather={weather}
            onWeather={setWeather}
            autoDetect={state.autoDetect}
            onAutoDetect={(autoDetect) => setState((s) => ({ ...s, autoDetect }))}
          />
        )}
        {tab === 'history' && (
          <HistoryPage
            history={history}
            units={settings.units}
            onAgain={(e) => {
              setForm(restoreFrom(state.form, e));
              setTab('calc');
              window.scrollTo(0, 0);
            }}
            onDelete={(id) => setHistory((h) => h.filter((e) => e.id !== id))}
          />
        )}
        {tab === 'settings' && (
          <SettingsPage
            settings={settings}
            onChange={updateSettings}
            saved={saved}
            weather={weather}
            onReset={() => {
              if (!window.confirm('Reset the calculator, settings and history on this device?')) return;
              resetAll();
              setState(DEFAULT_STATE);
              setSettings(DEFAULT_SETTINGS);
              setHistory([]);
              last.current = null;
              setTouched(false);
            }}
          />
        )}
      </main>
      <TabBar
        tabs={[
          { id: 'calc', label: 'Calculator' },
          { id: 'history', label: history.length > 0 ? `History (${history.length})` : 'History' },
          { id: 'settings', label: 'Settings' },
        ] satisfies TabDef<Tab>[]}
        active={tab}
        onChange={setTab}
      />
    </div>
  );
}
