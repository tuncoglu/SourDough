// The optional weather lookup: browser location -> Open-Meteo (current
// temperature plus the hourly forecast). Open-Meteo is free, needs no key and
// allows cross-origin requests. This is the only network call the apps make,
// and only when the person taps the button (or turns on auto-detect).
// Coordinates are rounded to 2 decimals (~1 km) before they leave the device.

export const OPEN_METEO_URL = 'https://api.open-meteo.com/v1/forecast';
export const GEO_TIMEOUT_MS = 10_000;
export const FETCH_TIMEOUT_MS = 8_000;
/** A detected temperature older than this is not trusted when the app reopens. */
export const AUTO_TEMP_MAX_AGE_MS = 3 * 60 * 60 * 1000;
export const FORECAST_DAYS = 7;

export type DetectFailure = 'unsupported' | 'denied' | 'unavailable' | 'timeout' | 'network';

export interface HourlyTemp {
  /** ISO local time at the location, e.g. 2026-10-28T14:00. */
  datetime: string;
  tempC: number;
}

/** Where the person is, to the town: enough to pick water hardness from a table. */
export interface Place {
  /** ISO 3166-1 alpha-2, lower case ("gb"). */
  countryCode: string;
  /** State or county ("England"), may be empty. */
  region: string;
  city: string;
}

export interface Weather {
  /** Outdoor temperature now, °C. */
  tempC: number;
  /** Hourly outdoor temperatures from today, for the days ahead. May be empty. */
  hourly: HourlyTemp[];
  /** When it was read (ms since epoch). */
  at: number;
  /** The town and country, only when asked for (it needs one more service). */
  place?: Place;
  /** Estimated tap-water temperature (°C), only when asked for. */
  tapTempC?: number;
}

/** Accept a stored weather reading, keep what is valid, drop the rest. */
export function normalizeWeather(raw: unknown): Weather | null {
  const w = raw as Partial<Weather> | null | undefined;
  if (!w || typeof w.tempC !== 'number' || !Number.isFinite(w.tempC) || typeof w.at !== 'number' || !Array.isArray(w.hourly)) return null;
  const out: Weather = {
    tempC: w.tempC,
    at: w.at,
    hourly: w.hourly.filter((h) => h && typeof h.datetime === 'string' && typeof h.tempC === 'number'),
  };
  const p = w.place as Partial<Place> | undefined;
  if (p && typeof p.countryCode === 'string' && typeof p.region === 'string' && typeof p.city === 'string') {
    out.place = { countryCode: p.countryCode.toLowerCase().slice(0, 3), region: p.region.slice(0, 80), city: p.city.slice(0, 80) };
  }
  if (typeof w.tapTempC === 'number' && sensible(w.tapTempC)) out.tapTempC = w.tapTempC;
  return out;
}

export type DetectResult = ({ ok: true } & Weather) | { ok: false; reason: DetectFailure };

export interface Position {
  latitude: number;
  longitude: number;
}

export function roundCoord(n: number): number {
  return Math.round(n * 100) / 100;
}

export function weatherUrl(lat: number, lon: number): string {
  return (
    `${OPEN_METEO_URL}?latitude=${roundCoord(lat)}&longitude=${roundCoord(lon)}` +
    `&current=temperature_2m&hourly=temperature_2m&forecast_days=${FORECAST_DAYS}&timezone=auto`
  );
}

const sensible = (t: unknown): t is number => typeof t === 'number' && Number.isFinite(t) && t > -90 && t < 70;

/** Pull the current temperature out of an Open-Meteo response, or null if it is not a sensible number. */
export function parseTemp(json: unknown): number | null {
  const t = (json as { current?: { temperature_2m?: unknown } } | null)?.current?.temperature_2m;
  return sensible(t) ? t : null;
}

/** The hourly forecast, dropping any hour whose time or temperature is not usable. */
export function parseHourly(json: unknown): HourlyTemp[] {
  const h = (json as { hourly?: { time?: unknown; temperature_2m?: unknown } } | null)?.hourly;
  if (!h || !Array.isArray(h.time) || !Array.isArray(h.temperature_2m)) return [];
  const out: HourlyTemp[] = [];
  for (let i = 0; i < h.time.length; i++) {
    const time = h.time[i];
    const t = h.temperature_2m[i];
    if (typeof time === 'string' && !Number.isNaN(new Date(time).getTime()) && sensible(t)) out.push({ datetime: time, tempC: t });
  }
  return out;
}

// ── Place (for water hardness) ──────────────────────────────────────────
// Nominatim (OpenStreetMap) turns the rounded coordinates into a country and
// region. Its usage policy asks for at most one request a second and no bulk
// use; this is one request, only when the person asks.

export const NOMINATIM_URL = 'https://nominatim.openstreetmap.org/reverse';

export function placeUrl(lat: number, lon: number): string {
  return `${NOMINATIM_URL}?lat=${roundCoord(lat)}&lon=${roundCoord(lon)}&format=json&zoom=10&accept-language=en`;
}

/** Pull the country and region out of a Nominatim response, or null if there is no country. */
export function parsePlace(json: unknown): Place | null {
  const a = (json as { address?: Record<string, unknown> } | null)?.address;
  if (!a || typeof a.country_code !== 'string' || a.country_code.length < 2) return null;
  const str = (v: unknown) => (typeof v === 'string' ? v : '');
  return {
    countryCode: a.country_code.toLowerCase(),
    region: str(a.state) || str(a.county),
    city: str(a.city) || str(a.town) || str(a.village) || str(a.suburb) || 'Unknown',
  };
}

// ── Tap-water temperature ───────────────────────────────────────────────
// Mains water is close to the recent ground temperature, so the estimate is a
// weighted average of the last three weeks of daily mean air temperatures
// (Open-Meteo archive), the most recent days counting most.

export const ARCHIVE_URL = 'https://archive-api.open-meteo.com/v1/archive';

export function archiveUrl(lat: number, lon: number, end: Date): string {
  const day = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  const start = new Date(end);
  start.setDate(start.getDate() - 22);
  return `${ARCHIVE_URL}?latitude=${roundCoord(lat)}&longitude=${roundCoord(lon)}&start_date=${day(start)}&end_date=${day(end)}&daily=temperature_2m_mean&timezone=auto`;
}

/** Weighted mean of daily temperatures, newest weighted most (decay 0.1 per day), to 0.1 °C; null if there are none. */
export function tapTempFromDaily(json: unknown): number | null {
  const d = (json as { daily?: { temperature_2m_mean?: unknown } } | null)?.daily?.temperature_2m_mean;
  if (!Array.isArray(d)) return null;
  const temps = d.filter(sensible);
  if (temps.length === 0) return null;
  const weights = temps.map((_, i) => Math.exp(-0.1 * (temps.length - 1 - i)));
  const sum = weights.reduce((a, b) => a + b, 0);
  return Math.round((temps.reduce((s, t, i) => s + t * weights[i]!, 0) / sum) * 10) / 10;
}

export function failureMessage(reason: DetectFailure): string {
  switch (reason) {
    case 'unsupported':
      return 'This browser cannot share a location. Enter the temperature yourself.';
    case 'denied':
      return 'Location permission was declined. Enter the temperature yourself.';
    case 'unavailable':
      return 'Your location is unavailable right now. Enter the temperature yourself.';
    case 'timeout':
      return 'Finding your location took too long. Enter the temperature yourself.';
    case 'network':
      return 'Could not reach the weather service (are you offline?). Enter the temperature yourself.';
  }
}

function browserPosition(): Promise<Position> {
  return new Promise((resolve, reject) => {
    if (typeof navigator === 'undefined' || !('geolocation' in navigator)) {
      reject({ code: 'unsupported' });
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (p) => resolve({ latitude: p.coords.latitude, longitude: p.coords.longitude }),
      (e) => reject({ code: e.code === 1 ? 'denied' : e.code === 3 ? 'timeout' : 'unavailable' }),
      // City-level accuracy is plenty for a temperature; allow a 10-minute-old fix.
      { enableHighAccuracy: false, timeout: GEO_TIMEOUT_MS, maximumAge: 10 * 60 * 1000 },
    );
  });
}

interface Deps {
  getPosition?: () => Promise<Position>;
  fetchFn?: typeof fetch;
  now?: () => number;
}

export interface DetectOptions {
  /** Also find the town and country (Nominatim), for water hardness. */
  place?: boolean;
  /** Also estimate the tap-water temperature (Open-Meteo archive). */
  tapTemp?: boolean;
}

export async function detectWeather(deps: Deps = {}, options: DetectOptions = {}): Promise<DetectResult> {
  const getPosition = deps.getPosition ?? browserPosition;
  const fetchFn = deps.fetchFn ?? fetch;
  const now = deps.now ?? Date.now;

  let pos: Position;
  try {
    pos = await getPosition();
  } catch (e) {
    const code = (e as { code?: string })?.code;
    const reason: DetectFailure =
      code === 'unsupported' || code === 'denied' || code === 'timeout' ? code : 'unavailable';
    return { ok: false, reason };
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
  try {
    const res = await fetchFn(weatherUrl(pos.latitude, pos.longitude), { signal: controller.signal });
    if (!res.ok) return { ok: false, reason: 'network' };
    const json = await res.json();
    const tempC = parseTemp(json);
    if (tempC == null) return { ok: false, reason: 'network' };
    const result: DetectResult = { ok: true, tempC, hourly: parseHourly(json), at: now() };

    // The extras are best effort: the forecast above is what the person asked for, so a failure here only leaves them out.
    const extra = async (url: string): Promise<unknown> => {
      try {
        const r = await fetchFn(url, { signal: controller.signal });
        return r.ok ? await r.json() : null;
      } catch {
        return null;
      }
    };
    const [placeJson, archiveJson] = await Promise.all([
      options.place ? extra(placeUrl(pos.latitude, pos.longitude)) : null,
      options.tapTemp ? extra(archiveUrl(pos.latitude, pos.longitude, new Date(now()))) : null,
    ]);
    const place = parsePlace(placeJson);
    if (place) result.place = place;
    const tap = tapTempFromDaily(archiveJson);
    if (tap !== null) result.tapTempC = tap;
    return result;
  } catch {
    return { ok: false, reason: 'network' };
  } finally {
    clearTimeout(timer);
  }
}
