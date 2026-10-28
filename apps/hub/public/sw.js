/* Retires the old "Just Dough It" service worker.
 *
 * sourdoughcalculator.uk used to be one combined app that registered a service
 * worker at this address, which cached its pages for offline use. The address is
 * now this launcher page, so a browser that still has the old worker would keep
 * showing the old app from its cache. Browsers re-fetch this file to check for
 * updates; finding this version, they run it: it deletes the old caches,
 * unregisters itself and reloads any open tab onto the live site.
 *
 * The hub registers no service worker of its own. Keep this file for as long as
 * returning visitors might still have the old one (months, not days).
 */
self.addEventListener('install', () => self.skipWaiting());

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(keys.map((k) => caches.delete(k)));
      await self.registration.unregister();
      const windows = await self.clients.matchAll({ type: 'window' });
      windows.forEach((w) => w.navigate(w.url));
    })(),
  );
});
