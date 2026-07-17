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

/** Format a weight for display, converting to imperial if needed. */
export function formatWeight(grams: number, system: UnitSystem, decimals = 1): string {
  if (system === 'imperial') {
    return `${gramsToOz(grams).toFixed(decimals)} oz`;
  }
  return `${grams.toFixed(decimals)} g`;
}

/** Format a weight without the unit suffix (for tables where the unit is a separate column). */
export function formatWeightValue(grams: number, system: UnitSystem, decimals = 1): string {
  if (system === 'imperial') {
    return gramsToOz(grams).toFixed(decimals);
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
