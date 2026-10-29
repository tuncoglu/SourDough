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
  it('also carries the Android app\'s full policy, rendered from PRIVACY.md', () => {
    const md = readFileSync(new URL('../../../SourDoughMobile/PRIVACY.md', import.meta.url), 'utf8');
    expect(privacy).toContain('Privacy Policy for Dough &amp; Ferment Calculators');
    for (const heading of md.match(/^## .+$/gm) ?? []) {
      const text = heading.replace(/^## /, '').replace(/[*_`]/g, '');
      expect(privacy).toContain(text.replace(/&/g, '&amp;').replace(/'/g, '&#39;'));
    }
    expect(privacy).toContain('info@sourdoughcalculator.uk');
  });
  it('says there are no accounts, advertising or analytics', () => {
    expect(privacy).toMatch(/no accounts, no advertising and no analytics/);
  });
});

describe('the old paths', () => {
  const rules = readFileSync(new URL('../public/_redirects', import.meta.url), 'utf8')
    .split('\n')
    .filter((l) => l.trim() && !l.startsWith('#'))
    .map((l) => l.trim().split(/\s+/));

  it('each is a well-formed rule that sends people somewhere real', () => {
    for (const [from, to, code] of rules) {
      expect(from).toMatch(/^\//);
      expect(['301', '302']).toContain(code);
      expect(to).toMatch(/^(\/|https:\/\/(bread|yogurt|lactoferment)\.sourdoughcalculator\.uk\/)$/);
    }
  });

  it('sends the old calculator pages to their new homes', () => {
    const to = (p: string) => rules.find((r) => r[0] === p)?.[1];
    expect(to('/bread')).toBe('https://bread.sourdoughcalculator.uk/');
    expect(to('/yogurt')).toBe('https://yogurt.sourdoughcalculator.uk/');
    expect(to('/ferments')).toBe('https://lactoferment.sourdoughcalculator.uk/');
  });

  it('leaves /privacy and /about to the hub, because the Play listing links to /privacy', () => {
    expect(rules.some((r) => r[0] === '/privacy' || r[0] === '/about')).toBe(false);
  });
});

describe('retiring the old service worker', () => {
  const sw = readFileSync(new URL('../public/sw.js', import.meta.url), 'utf8');
  it('clears caches, unregisters itself and reloads open tabs', () => {
    expect(sw).toContain('caches.delete');
    expect(sw).toContain('registration.unregister()');
    expect(sw).toContain('navigate(');
    expect(sw).toContain('skipWaiting');
  });
  it('is never cached, so browsers always see it', () => {
    const headers = readFileSync(new URL('../public/_headers', import.meta.url), 'utf8');
    expect(headers).toMatch(/\/sw\.js\s+Cache-Control: no-cache/);
  });
  it('is valid script', () => {
    expect(() => new Function(sw)).not.toThrow();
  });
});
