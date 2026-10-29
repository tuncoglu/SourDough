import { afterEach, describe, expect, it } from 'vitest';
import { DEFAULT_SETTINGS, loadSettings, normalizePostcode, normalizeSettings, saveSettings } from '../src/settings';
import { loadJson, saveJson } from '../src/storage';
import { serviceWorkerSource } from '../src/precache';

describe('normalizeSettings', () => {
  it('keeps valid values', () => {
    expect(normalizeSettings({ theme: 'dark', units: 'imperial', kitchenTempC: 21.5, waterHardnessMgL: 280 })).toEqual({ theme: 'dark', units: 'imperial', kitchenTempC: 21.5, waterHardnessMgL: 280, postcode: '' });
  });
  it('defaults anything unknown, wrong or out of range', () => {
    expect(normalizeSettings(null)).toEqual(DEFAULT_SETTINGS);
    expect(normalizeSettings({ theme: 'neon', units: 'cubits', kitchenTempC: 'warm' })).toEqual(DEFAULT_SETTINGS);
    expect(normalizeSettings({ kitchenTempC: 400 }).kitchenTempC).toBe(0);
    expect(normalizeSettings({ kitchenTempC: NaN }).kitchenTempC).toBe(0);
    expect(normalizeSettings({ waterHardnessMgL: -5 }).waterHardnessMgL).toBe(0);
    expect(normalizeSettings({ waterHardnessMgL: 99999 }).waterHardnessMgL).toBe(0);
  });
});

describe('postcode', () => {
  it('is kept tidy: upper case, no symbols, one space, short', () => {
    expect(normalizePostcode('  sw1a   1aa')).toBe('SW1A 1AA');
    expect(normalizePostcode('kt12<script>')).toBe('KT12SCRI');
    expect(normalizeSettings({ postcode: 42 }).postcode).toBe('');
    expect(normalizeSettings({ postcode: 'g1 1aa' }).postcode).toBe('G1 1AA');
  });
});

describe('storage that never throws', () => {
  const g = globalThis as { localStorage?: unknown };
  const original = g.localStorage;
  afterEach(() => {
    g.localStorage = original;
  });

  it('falls back when storage is missing', () => {
    g.localStorage = undefined;
    expect(loadSettings('k')).toEqual(DEFAULT_SETTINGS);
    expect(saveJson('k', 1)).toBe(false);
  });

  it('falls back on corrupt JSON and reports a failed write', () => {
    g.localStorage = {
      getItem: () => '{not json',
      setItem: () => {
        throw new Error('QuotaExceededError');
      },
    };
    expect(loadJson('k', 'fallback')).toBe('fallback');
    expect(saveSettings('k', DEFAULT_SETTINGS)).toBe(false);
  });

  it('round-trips through a working store', () => {
    const data = new Map<string, string>();
    g.localStorage = { getItem: (k: string) => data.get(k) ?? null, setItem: (k: string, v: string) => void data.set(k, v) };
    saveSettings('k', { theme: 'light', units: 'imperial', kitchenTempC: 20, waterHardnessMgL: 0, postcode: 'KT12 1AB' });
    expect(loadSettings('k')).toEqual({ theme: 'light', units: 'imperial', kitchenTempC: 20, waterHardnessMgL: 0, postcode: 'KT12 1AB' });
  });
});

describe('service worker source', () => {
  it('names the cache per app and build, and lists every file', () => {
    const src = serviceWorkerSource('yogurt', ['./', './assets/a.js'], '42');
    expect(src).toContain('"yogurt-42"');
    expect(src).toContain('"./assets/a.js"');
    // It must at least parse as a script.
    expect(() => new Function(src)).not.toThrow();
  });

  it('serves navigations from ./ and never caches a redirected response', () => {
    const src = serviceWorkerSource('bread', ['./'], '1');
    expect(src).toContain("caches.match('./')");
    expect(src).not.toContain("caches.match('./index.html')");
    expect(src).toContain('res.redirected');
  });
});
