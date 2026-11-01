import { WaterHardness, HourlyPoint, UnitSystem } from '@sourdough/calc/models/types';
import { lookupWaterHardness } from '@sourdough/calc/data/waterHardness';
import {
  getAmbientTemp,
  fetchHourlyForecast,
  estimateWaterTemp,
  reverseGeocode,
  reversePostcode,
  NominatimResult,
} from './api';
import { looksLikeUkPostcode } from '@sourdough/calc/data/ukWaterHardness';
import { formatTemp } from '@sourdough/calc/lib/unitConversion';
import { buildManualHardness } from '@sourdough/calc/lib/hardnessUtils';

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

  // In the UK the hardness table is keyed on postcode, and the region Nominatim gives is just
  // "England" for most of the country. Use a postcode the user typed (if it is one); otherwise
  // look up the one at this position.
  const typedPostcode = postcode && looksLikeUkPostcode(postcode) ? postcode : undefined;
  const needPostcode = !typedPostcode && loc.countryCode === 'gb';

  const [ambient, forecast, waterTemp, foundPostcode] = await Promise.all([
    getAmbientTemp(lat, lon),
    fetchHourlyForecast(lat, lon),
    estimateWaterTemp(lat, lon),
    needPostcode ? reversePostcode(lat, lon) : Promise.resolve(null),
  ]);

  const hardness = lookupWaterHardness(
    loc.countryCode, loc.region, typedPostcode ?? foundPostcode ?? undefined, manualHardness);

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
  parts.push(
    hardness.key === 'fallback'
      ? `🧪 Water hardness unknown (assuming ${hardness.mgL} mg/L)`
      : `🧪 Water ${hardness.classification} (${hardness.mgL} mg/L)`,
  );
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
