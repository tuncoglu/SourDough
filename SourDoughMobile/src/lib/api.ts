import { HourlyPoint } from '../models/types';
import { getErrorMessage } from './errors';

/**
 * Open-Meteo and Nominatim API client.
 * All endpoints are free, no API key required.
 */

const OPEN_METEO_BASE = 'https://api.open-meteo.com/v1';
const OPEN_METEO_ARCHIVE = 'https://archive-api.open-meteo.com/v1/archive';
const NOMINATIM_BASE = 'https://nominatim.openstreetmap.org';
const USER_AGENT = 'SourDough/3.0 (JustDoughIt)';

// Nominatim rate limit: 1 req/s (polite use policy)
let lastNominatimCall = 0;

async function httpGet(url: string, timeoutMs = 8000): Promise<any> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, {
      signal: controller.signal,
      headers: { 'User-Agent': USER_AGENT },
    });
    if (!response.ok) return null;
    return response.json();
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

/**
 * Fetch with exponential backoff retry on network errors and 5xx responses.
 * Does NOT retry on 4xx (client errors).
 */
async function fetchWithRetry(
  url: string,
  timeoutMs = 8000,
  maxRetries = 2,
  baseDelayMs = 1000,
): Promise<any> {
  let lastError: unknown = null;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    if (attempt > 0) {
      const delay = baseDelayMs * Math.pow(2, attempt - 1);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const response = await fetch(url, {
        signal: controller.signal,
        headers: { 'User-Agent': USER_AGENT },
      });
      clearTimeout(timer);

      if (response.ok) {
        return response.json();
      }

      // Don't retry on 4xx (client errors)
      if (response.status >= 400 && response.status < 500) {
        return null;
      }

      // 5xx or other — retry
      lastError = new Error(`HTTP ${response.status}`);
    } catch (err) {
      clearTimeout(timer);
      lastError = err;
      // Network errors are retryable; abort errors from timeout are not
      if (err instanceof DOMException && err.name === 'AbortError') {
        return null;
      }
    }
  }

  // All retries exhausted — log and return null
  if (lastError) {
    console.warn(`[api] fetchWithRetry failed after ${maxRetries} retries: ${getErrorMessage(lastError)}`);
  }
  return null;
}

/** Throttle Nominatim calls to respect 1 req/s rate limit. */
async function nominatimGet(url: string, timeoutMs = 8000): Promise<any> {
  const now = Date.now();
  const wait = Math.max(0, 1100 - (now - lastNominatimCall));
  if (wait > 0) {
    await new Promise((resolve) => setTimeout(resolve, wait));
  }
  lastNominatimCall = Date.now();
  return fetchWithRetry(url, timeoutMs, 1, 1000);
}

// ── Weather ────────────────────────────────────────────────────────────

/** Get current ambient temperature from Open-Meteo */
export async function getAmbientTemp(
  lat: number,
  lon: number,
): Promise<number | null> {
  const url = `${OPEN_METEO_BASE}/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m&timezone=auto`;
  const data = await fetchWithRetry(url);
  return data?.current?.temperature_2m ?? null;
}

/** Fetch 48-hour temperature forecast */
export async function fetchHourlyForecast(
  lat: number,
  lon: number,
): Promise<HourlyPoint[] | null> {
  const url = `${OPEN_METEO_BASE}/forecast?latitude=${lat}&longitude=${lon}&hourly=temperature_2m&timezone=auto&forecast_days=2`;
  const data = await fetchWithRetry(url, 10000);
  if (!data?.hourly) return null;

  const times: string[] = data.hourly.time;
  const temps: number[] = data.hourly.temperature_2m;

  const result: HourlyPoint[] = [];
  for (let i = 0; i < times.length; i++) {
    if (temps[i] != null) {
      result.push({ datetime: times[i], tempC: temps[i] });
    }
  }
  return result.length > 0 ? result : null;
}

/** Estimate tap-water temp from 21-day average ground temperature */
export async function estimateWaterTemp(
  lat: number,
  lon: number,
): Promise<number | null> {
  const end = new Date();
  end.setHours(0, 0, 0, 0);
  const start = new Date(end);
  start.setDate(start.getDate() - 22);

  const endStr = end.toISOString().split('T')[0];
  const startStr = start.toISOString().split('T')[0];

  const url = `${OPEN_METEO_ARCHIVE}/archive?latitude=${lat}&longitude=${lon}&start_date=${startStr}&end_date=${endStr}&daily=temperature_2m_mean&timezone=UTC`;
  const data = await fetchWithRetry(url, 12000);
  if (!data?.daily) return null;

  const temps: number[] = data.daily.temperature_2m_mean.filter(
    (t: number | null) => t != null,
  );
  if (temps.length === 0) return null;

  // Weighted average with exponential decay
  const weights = temps.map((_, i) =>
    Math.exp(-0.1 * (temps.length - 1 - i)),
  );
  const weightSum = weights.reduce((a, b) => a + b, 0);
  const weightedSum = temps.reduce((sum, t, i) => sum + t * weights[i], 0);

  return Math.round((weightedSum / weightSum) * 10) / 10;
}

// ── Geocoding ──────────────────────────────────────────────────────────

export interface NominatimResult {
  lat: number;
  lon: number;
  city: string;
  region: string;
  country: string;
  countryCode: string;
}

/** Reverse geocode coordinates to city/region/country */
export async function reverseGeocode(
  lat: number,
  lon: number,
): Promise<NominatimResult | null> {
  const url = `${NOMINATIM_BASE}/reverse?lat=${lat}&lon=${lon}&format=json&zoom=10`;
  const data = await nominatimGet(url);
  if (!data?.address) return null;

  const addr = data.address;
  return {
    lat,
    lon,
    city: addr.city || addr.town || addr.village || addr.suburb || 'Unknown',
    region: addr.state || addr.county || '',
    country: addr.country || 'Unknown',
    countryCode: (addr.country_code || '').toLowerCase(),
  };
}

/** Geocode a postcode/ZIP to coordinates */
export async function geocodePostcode(
  postcode: string,
  countryCode: string = '',
): Promise<NominatimResult | null> {
  const query = encodeURIComponent(
    countryCode ? `${postcode}, ${countryCode}` : postcode,
  );
  const url = `${NOMINATIM_BASE}/search?q=${query}&format=json&limit=1`;
  const data = await nominatimGet(url);
  if (!data || data.length === 0) return null;

  const r = data[0];
  const addr = r.address || {};
  return {
    lat: parseFloat(r.lat),
    lon: parseFloat(r.lon),
    city:
      addr.city || addr.town || addr.village || addr.suburb || 'Unknown',
    region: addr.state || addr.county || '',
    country: addr.country || 'Unknown',
    countryCode: (addr.country_code || '').toLowerCase(),
  };
}
