import { useCallback, useState } from 'react';

/**
 * Staleness + validation state shared by the calculator hooks: any manual
 * input change marks previous results stale (so the banner appears) and
 * clears the inline validation message; a fresh calculation clears both.
 */
export function useStaleResults() {
  const [validationError, setValidationError] = useState<string | null>(null);
  const [inputsDirty, setInputsDirty] = useState(false);

  /** Any manual input change invalidates previous results + clears errors. */
  const markInputsChanged = useCallback(() => {
    setInputsDirty(true);
    setValidationError(null);
  }, []);

  /** A completed calculation resets both flags. */
  const markCalculated = useCallback(() => {
    setInputsDirty(false);
    setValidationError(null);
  }, []);

  return { validationError, setValidationError, inputsDirty, markInputsChanged, markCalculated };
}

/**
 * Wrap a state setter so every manual change marks results stale and clears
 * the inline error. (Preset/veg selection already resets showResults directly
 * and does not go through these setters.)
 */
export function dirtySetter<T>(
  markInputsChanged: () => void,
  set: (v: T) => void,
): (v: T) => void {
  return (v) => {
    set(v);
    markInputsChanged();
  };
}
