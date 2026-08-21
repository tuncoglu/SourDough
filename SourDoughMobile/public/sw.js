/* Just Dough It service worker.
 *
 * This is intentionally small: it makes the static export installable on
 * Android Chrome (a fetch handler is part of the installability criteria)
 * and provides a basic offline fallback for the app shell after the first
 * visit.
 */
const CACHE_NAME = 'just-dough-it-v1';
const PRECACHE_URLS = [
  '/',
  '/manifest.webmanifest',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
  '/favicon.png',
];

self.addEventListener('install', (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);
    await Promise.all(
      PRECACHE_URLS.map(async (url) => {
        try {
          const response = await fetch(url);
          if (response.ok) {
            await cache.put(url, response);
          }
        } catch {
          // Some assets may not be available during install; the runtime
          // fetch handler will cache them on first normal request.
        }
      }),
    );
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(
      keys
        .filter((key) => key !== CACHE_NAME)
        .map((key) => caches.delete(key)),
    );
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  // For navigations, try the network first so users always get the latest
  // app shell when online, and fall back to the cached shell when offline.
  if (request.mode === 'navigate') {
    event.respondWith((async () => {
      try {
        const response = await fetch(request);
        const cache = await caches.open(CACHE_NAME);
        cache.put('/', response.clone());
        return response;
      } catch {
        const cached = await caches.match('/');
        return cached || Response.error();
      }
    })());
    return;
  }

  // Always keep the manifest and service worker fresh; serving a stale copy
  // could prevent updated install metadata from being picked up.
  if (url.pathname === '/manifest.webmanifest' || url.pathname === '/sw.js') {
    event.respondWith(fetch(request));
    return;
  }

  // For same-origin static assets, serve from cache first and populate the
  // cache as they are requested.
  event.respondWith((async () => {
    const cached = await caches.match(request);
    if (cached) return cached;

    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, response.clone());
    }
    return response;
  })());
});
