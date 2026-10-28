import type { BreadForm, BreadPlan } from '@sourdough/calc/lib/breadPlan';
import type { StarterState } from '@sourdough/calc/lib/starterLog';
import type { Settings } from '@sourdough/core/settings';
import type { Weather } from '@sourdough/core/weather';

/** Where the room temperature came from, for the page to say so. */
export type RoomSource = 'set' | 'weather' | 'assumed';

/** Everything the calculator cards share. */
export interface Ctx {
  form: BreadForm;
  setForm: (f: BreadForm) => void;
  settings: Settings;
  setSettings: (s: Settings) => void;
  plan: BreadPlan;
  starter: StarterState;
  now: Date;
  roomTempC: number;
  roomSource: RoomSource;
  weather: Weather | null;
  onWeather: (w: Weather) => void;
  autoDetect: boolean;
  onAutoDetect: (on: boolean) => void;
  goSettings: () => void;
  goStarter: () => void;
}
