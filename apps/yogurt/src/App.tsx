import { useEffect, useMemo, useState } from 'react';
import { applyTheme, loadSettings, saveSettings, DEFAULT_SETTINGS, type Settings } from '@sourdough/core/settings';
import type { Weather } from '@sourdough/core/weather';
import { Header, TabBar, type TabDef } from '@sourdough/ui/components';
import { Calculator } from './Calculator';
import { DEFAULT_STATE, type AppState, type Form } from './form';
import { YogurtLogo } from './Logo';
import { SettingsPage } from './SettingsPage';
import { SETTINGS_KEY, freshWeather, loadState, resetAll, saveState } from './store';

type Tab = 'calc' | 'settings';
const TABS: TabDef<Tab>[] = [
  { id: 'calc', label: 'Calculator' },
  { id: 'settings', label: 'Settings' },
];

export default function App() {
  const [state, setState] = useState<AppState>(loadState);
  const [settings, setSettings] = useState<Settings>(() => loadSettings(SETTINGS_KEY));
  const [tab, setTab] = useState<Tab>('calc');
  const [saved, setSaved] = useState(true);

  useEffect(() => applyTheme(settings.theme), [settings.theme]);
  useEffect(() => {
    setSaved(saveState(state) && saveSettings(SETTINGS_KEY, settings));
  }, [state, settings]);

  const weather = useMemo(() => freshWeather(state.weather, Date.now()), [state.weather]);
  const setForm = (form: Form) => setState((s) => ({ ...s, form }));
  const setWeather = (w: Weather) => setState((s) => ({ ...s, weather: w }));

  return (
    <div className="app">
      <Header
        title={tab === 'settings' ? 'Settings' : 'Yogurt'}
        subtitle={tab === 'settings' ? 'Set your defaults once; adjust any batch as you go.' : 'Choose your culture and milk. We’ll help with the wait.'}
        logo={<span className="logo"><YogurtLogo /></span>}
      />
      <main>
        {tab === 'calc' ? (
          <Calculator form={state.form} setForm={setForm} settings={settings} weather={weather} onWeather={setWeather} />
        ) : (
          <SettingsPage
            settings={settings}
            onChange={setSettings}
            saved={saved}
            weather={weather}
            onReset={() => {
              if (!window.confirm('Reset the calculator and settings on this device?')) return;
              resetAll();
              setState(DEFAULT_STATE);
              setSettings(DEFAULT_SETTINGS);
            }}
          />
        )}
      </main>
      <TabBar tabs={TABS} active={tab} onChange={setTab} />
    </div>
  );
}
