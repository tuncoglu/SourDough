import { readFileSync, existsSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const page = (name: string) => readFileSync(new URL(`../${name}`, import.meta.url), 'utf8');
const pages = ['index.html', 'about.html', 'privacy.html'];

describe('the hub', () => {
  const index = page('index.html');

  it('links to all four calculators on their own addresses', () => {
    for (const host of ['bread', 'yogurt', 'lactoferment', 'pasta']) {
      expect(index).toContain(`href="https://${host}.sourdoughcalculator.uk"`);
    }
    // One tile each, nothing else pointing at the apps.
    expect(index.match(/class="pick"/g)).toHaveLength(4);
  });

  it('links to its own pages, and they exist', () => {
    for (const p of ['about.html', 'privacy.html']) {
      expect(index).toContain(`href="${p}"`);
      expect(existsSync(new URL(`../${p}`, import.meta.url))).toBe(true);
    }
  });

  it.each(pages)('%s has a title, a description and a viewport, and loads nothing from elsewhere', (name) => {
    const html = page(name);
    expect(html).toMatch(/<title>[^<]+<\/title>/);
    expect(html).toContain('name="description"');
    expect(html).toContain('name="viewport"');
    // Only our own script and stylesheet: no third-party scripts, fonts, trackers.
    expect(html.match(/<script[^>]*src="[^"]*"/g)).toEqual(['<script type="module" src="/src/main.ts"']);
    expect(html).not.toMatch(/<link[^>]+rel="stylesheet"/);
  });

  it('every page links back to the others it should', () => {
    expect(page('about.html')).toContain('href="index.html"');
    expect(page('privacy.html')).toContain('href="index.html"');
  });
});

describe('the privacy page', () => {
  const privacy = page('privacy.html');
  it('names every outside service the apps can use, and says when', () => {
    for (const s of ['Open-Meteo', 'Nominatim', 'Google Calendar', 'Cloudflare']) expect(privacy).toContain(s);
    expect(privacy).toContain('only when you ask');
  });
  it('says there are no accounts, advertising or analytics', () => {
    expect(privacy).toMatch(/no accounts, no advertising and no analytics/);
  });
});
