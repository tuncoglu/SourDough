import { WaterHardness, HourlyPoint } from '../models/types';
import { lookupWaterHardness } from '../data/waterHardness';
import {
  getAmbientTemp,
  fetchHourlyForecast,
  estimateWaterTemp,
  reverseGeocode,
  NominatimResult,
} from './api';

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
 */
export async function detectAll(
  lat: number,
  lon: number,
): Promise<LocationData | null> {
  const loc = await reverseGeocode(lat, lon);
  if (!loc) return null;

  const [ambient, forecast, waterTemp] = await Promise.all([
    getAmbientTemp(lat, lon),
    fetchHourlyForecast(lat, lon),
    estimateWaterTemp(lat, lon),
  ]);

  const hardness = lookupWaterHardness(loc.countryCode, loc.region);

  const summary = buildSummary(loc, ambient, waterTemp, hardness);

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
): string {
  const parts: string[] = [`📍 ${loc.city}, ${loc.country}`];
  if (ambient !== null) parts.push(`🌡 Ambient ${ambient}°C`);
  if (waterTemp !== null) parts.push(`💧 Tap ~${waterTemp}°C`);
  parts.push(`🧪 Water ${hardness.classification} (${hardness.mgL} mg/L)`);
  return parts.join('  │  ');
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
