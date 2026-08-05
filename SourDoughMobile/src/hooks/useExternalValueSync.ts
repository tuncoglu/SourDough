import { useEffect } from 'react';

/**
 * Keep a local display string in sync with a parent-controlled metric value.
 *
 * Used by unit-converting inputs (NumberInput, TempRow) whose display is a
 * local string: when the parent changes the value *programmatically* (recipe
 * preset, GPS auto-fill, reset-to-defaults, edit-recipe prefill) the display
 * must follow. Comparison is numeric rather than by string so typed decimals
 * that the parent normalizes (e.g. "12." → 12) are not clobbered mid-edit.
 */
export function useExternalValueSync(
  value: string,
  display: string,
  setDisplay: (v: string) => void,
  /** True when `display` is in a converted (imperial) unit, not metric. */
  isConverted: boolean,
  /** Convert a display value to the parent's metric units. */
  toMetric: (displayNumber: number) => number,
  /** Format a metric value for display. */
  toDisplay: (metricNumber: number) => string,
): void {
  useEffect(() => {
    const displayMetric = isConverted ? toMetric(parseFloat(display) || 0) : parseFloat(display);
    const parentMetric = parseFloat(value);
    if (isNaN(displayMetric) || isNaN(parentMetric)) return;
    if (Math.abs(displayMetric - parentMetric) > 0.001) {
      setDisplay(isConverted ? toDisplay(parentMetric) : value);
    }
  }, [value, display, isConverted, setDisplay, toMetric, toDisplay]);
}
