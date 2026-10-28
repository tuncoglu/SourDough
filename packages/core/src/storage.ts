/**
 * localStorage that never throws. Storage can be missing (some private
 * windows), full, blocked, or hold something that is not our JSON; in every
 * case the app carries on with its defaults and simply does not remember.
 */

export function loadJson<T>(key: string, fallback: T, parse: (raw: unknown) => T = (r) => r as T): T {
  try {
    const text = globalThis.localStorage?.getItem(key);
    if (text == null) return fallback;
    return parse(JSON.parse(text));
  } catch {
    return fallback;
  }
}

/** Returns false when the value could not be stored. */
export function saveJson(key: string, value: unknown): boolean {
  try {
    const store = globalThis.localStorage;
    if (!store) return false;
    store.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}

export function removeKey(key: string): void {
  try {
    globalThis.localStorage?.removeItem(key);
  } catch {
    /* nothing to remove */
  }
}
