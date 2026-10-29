# Sourdough Calculators hub

Lives at https://sourdoughcalculator.uk. One static page that links out to the four calculators (bread, yogurt, lacto-ferment, pasta & noodles), plus About and Privacy pages. No React, no scripts of its own, no service worker, no cookies, and nothing loaded from anywhere else: a launcher should be the lightest thing in the family.

The look is the shared stylesheet (`../../packages/ui/src/styles.css`) plus `src/hub.css` for the tiles. Vite bundles the three pages and that stylesheet into `dist/`.

```sh
npm install
npm run dev
npm test           # the links all point at the right places, and nothing third-party is loaded
npm run build      # type-check + static files in dist/
```

## Keep in step with the apps

`privacy.html` lists every outside service any calculator can use (Open-Meteo, Nominatim, Google Calendar) and the host (Cloudflare). If an app starts using another service, or the host changes, update it in the same change; the test checks that the named services are still on the page.

## Deploying

A Cloudflare Pages project with `apps/hub` as the root, build command `npm ci && npm run build`, output `dist`. Deployed automatically by `.github/workflows/web-apps.yml` on a push to `main`, once every web app's checks pass. The old combined app's paths (`/bread`, `/ferments` and similar) redirect to the calculators through `public/_redirects`.
