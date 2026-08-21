import { WaterHardness, HourlyPoint, UnitSystem } from '../models/types';
import { lookupWaterHardness } from '../data/waterHardness';
import {
  getAmbientTemp,
  fetchHourlyForecast,
  estimateWaterTemp,
  reverseGeocode,
  NominatimResult,
} from './api';
import { formatTemp } from './unitConversion';
import { buildManualHardness } from './hardnessUtils';

export interface LocationData {
  location: NominatimResult;
  ambientTemp: number | null;
  waterTemp: number | null;
  hourlyForecast: HourlyPoint[] | null;
  hardness: WaterHardness;
  summary: string;
}

/**
 * Full auto-detection pipeline — GPS → reverse geocode → weather → hardness.
 * Returns a LocationData object or null if GPS fails.
 *
 * @param lat Latitude
 * @param lon Longitude
 * @param postcode Optional UK postcode for refined hardness lookup
 * @param manualHardness Optional manual hardness override in mg/L CaCO₃
 */
export async function detectAll(
  lat: number,
  lon: number,
  postcode?: string,
  manualHardness?: number | null,
  unitSystem: UnitSystem = 'metric',
): Promise<LocationData | null> {
  const loc = await reverseGeocode(lat, lon);
  if (!loc) return null;

  const [ambient, forecast, waterTemp] = await Promise.all([
    getAmbientTemp(lat, lon),
    fetchHourlyForecast(lat, lon),
    estimateWaterTemp(lat, lon),
  ]);

  const hardness = lookupWaterHardness(
    loc.countryCode, loc.region, postcode, manualHardness);

  const summary = buildSummary(loc, ambient, waterTemp, hardness, unitSystem);

  return {
    location: loc,
    ambientTemp: ambient,
    waterTemp,
    hourlyForecast: forecast,
    hardness,
    summary,
  };
}

export function buildSummary(
  loc: NominatimResult,
  ambient: number | null,
  waterTemp: number | null,
  hardness: WaterHardness,
  unitSystem: UnitSystem = 'metric',
): string {
  const parts: string[] = [`📍 ${loc.city}, ${loc.country}`];
  if (ambient !== null) parts.push(`🌡 Ambient ${formatTemp(ambient, unitSystem, 0)}`);
  if (waterTemp !== null) parts.push(`💧 Tap ~${formatTemp(waterTemp, unitSystem, 0)}`);
  parts.push(`🧪 Water ${hardness.classification} (${hardness.mgL} mg/L)`);
  return parts.join('  │  ');
}

/**
 * Location summary with the user's water-hardness override applied.
 *
 * `detectAll` builds the summary from auto-detected hardness only, because
 * it doesn't know about user settings. Every tab that shows the location
 * bar must re-apply the override here — otherwise the summary keeps showing
 * the auto-detected value after the user sets a manual hardness in Settings.
 */
export function summaryWithHardnessOverride(
  data: LocationData,
  waterHardnessOverride: number,
  unitSystem: UnitSystem = 'metric',
): string {
  if (waterHardnessOverride <= 0) return data.summary;
  return buildSummary(
    data.location,
    data.ambientTemp,
    data.waterTemp,
    buildManualHardness(waterHardnessOverride),
    unitSystem,
  );
}

/**
 * Get auto-fillable temperature defaults from detected data.
 * Falls back to sensible values when detection fails.
 */
export function getAutoTemps(ambient: number | null, waterTemp: number | null) {
  const amb = ambient ?? 22;
  return {
    ambientTemp: amb,
    flourTemp: amb,
    waterTemp: waterTemp ?? 18,
    starterTemp: amb,
  };
}
