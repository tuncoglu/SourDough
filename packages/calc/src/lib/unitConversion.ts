/**
 * Metric ↔ Imperial unit conversion for weights and temperatures.
 * Calculation engine always uses metric internally (g, °C).
 * Conversions happen at the display boundary only.
 */

import type { UnitSystem } from '../models/types';

// ── Conversion Functions ────────────────────────────────────────────────

/** Grams to ounces (avoirdupois). */
export function gramsToOz(g: number): number {
  return g / 28.349523125;
}

/** Ounces to grams. */
export function ozToGrams(oz: number): number {
  return oz * 28.349523125;
}

/** Celsius to Fahrenheit. */
export function celsiusToFahrenheit(c: number): number {
  return c * 9 / 5 + 32;
}

/** Fahrenheit to Celsius. */
export function fahrenheitToCelsius(f: number): number {
  return (f - 32) * 5 / 9;
}

// ── Display Helpers ─────────────────────────────────────────────────────

/** Return the abbreviated unit label for the given system. */
export function weightUnit(system: UnitSystem): string {
  return system === 'imperial' ? 'oz' : 'g';
}

/** Return the temperature unit label. */
export function tempUnit(system: UnitSystem): string {
  return system === 'imperial' ? '°F' : '°C';
}

/** Resolve display decimals: small ounce values (< 1 oz) need ≥ 2 places
 *  or they render as "0 oz" (e.g. 10 g of salt = 0.35 oz). */
function imperialDecimals(oz: number, decimals: number): number {
  return oz > 0 && oz < 1 ? Math.max(decimals, 2) : decimals;
}

/** Format a weight for display, converting to imperial if needed. */
export function formatWeight(grams: number, system: UnitSystem, decimals = 1): string {
  if (system === 'imperial') {
    const oz = gramsToOz(grams);
    return `${oz.toFixed(imperialDecimals(oz, decimals))} oz`;
  }
  return `${grams.toFixed(decimals)} g`;
}

/** Format a weight without the unit suffix (for tables where the unit is a separate column). */
export function formatWeightValue(grams: number, system: UnitSystem, decimals = 1): string {
  if (system === 'imperial') {
    const oz = gramsToOz(grams);
    return oz.toFixed(imperialDecimals(oz, decimals));
  }
  return grams.toFixed(decimals);
}

/** Format a temperature for display, converting to Fahrenheit if needed. */
export function formatTemp(celsius: number, system: UnitSystem, decimals = 1): string {
  if (system === 'imperial') {
    return `${celsiusToFahrenheit(celsius).toFixed(decimals)}°F`;
  }
  return `${celsius.toFixed(decimals)}°C`;
}

/** Format a temperature value without the unit suffix. */
export function formatTempValue(celsius: number, system: UnitSystem, decimals = 1): string {
  if (system === 'imperial') {
    return celsiusToFahrenheit(celsius).toFixed(decimals);
  }
  return celsius.toFixed(decimals);
}
