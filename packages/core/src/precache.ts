/**
 * Vite plugin: after the build, write dist/sw.js listing every built file, so
 * the whole app is cached on first visit and works offline. One service
 * worker for every app; only the cache name differs.
 *
 * Navigations are served from the cached page at ./ (Pages redirects
 * /index.html to /, and a redirected response cannot answer a navigation).
 * A new build gets a new cache id, the new worker takes over at once, and
 * the old cache is deleted.
 */
import { readdirSync, statSync, writeFileSync } from 'node:fs';
import { join, relative } from 'node:path';

export function serviceWorkerSource(cacheName: string, urls: string[], cacheId: string): string {
  return `// Offline cache, written at build time by @sourdough/core/precache.
const CACHE = ${JSON.stringify(`${cacheName}-${cacheId}`)};
const PRECACHE = ${JSON.stringify(urls)};

// A response that followed a redirect (Pages sends /index.html to /) is refused by the browser
// when it answers a navigation, so store a plain copy instead.
async function plain(res) {
  if (!res.redirected) return res;
  return new Response(await res.blob(), { status: res.status, statusText: res.statusText, headers: res.headers });
}

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(CACHE)
      .then((c) =>
        Promise.all(
          PRECACHE.map(async (url) => {
            const res = await fetch(url, { cache: 'reload' });
            if (!res.ok) throw new Error(url + ' ' + res.status);
            await c.put(url, await plain(res));
          }),
        ),
      )
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== self.location.origin) return;

  if (req.mode === 'navigate') {
    event.respondWith(caches.match('./').then((hit) => hit || fetch(req)));
    return;
  }

  event.respondWith(
    caches.match(req).then(
      (hit) =>
        hit ||
        fetch(req).then((res) => {
          if (res.ok) {
            const copy = res.clone();
            caches.open(CACHE).then((c) => c.put(req, copy));
          }
          return res;
        }),
    ),
  );
});
`;
}

export function precachePlugin(cacheName: string) {
  let outDir = 'dist';
  return {
    name: `${cacheName}-precache`,
    apply: 'build' as const,
    configResolved(c: { build: { outDir: string } }) {
      outDir = c.build.outDir;
    },
    closeBundle() {
      const files: string[] = [];
      const walk = (dir: string) => {
        for (const f of readdirSync(dir)) {
          const p = join(dir, f);
          if (statSync(p).isDirectory()) walk(p);
          else files.push(relative(outDir, p).split('\\').join('/'));
        }
      };
      walk(outDir);
      // sw.js is the worker itself; _headers and _redirects are host config, not served assets.
      const skip = new Set(['sw.js', '_headers', '_redirects']);
      const urls = ['./', ...files.filter((f) => f !== 'index.html' && !skip.has(f)).map((f) => `./${f}`)];
      writeFileSync(join(outDir, 'sw.js'), serviceWorkerSource(cacheName, urls, String(Date.now())));
    },
  };
}
