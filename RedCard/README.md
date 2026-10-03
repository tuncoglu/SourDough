# RedCard.Live on sourdoughcalculator.uk

An unlinked football PWA at `/redcard-7c4f/`. The HTML and response headers request `noindex, nofollow`; the address is obscure but does not require authentication.

The React interface and API-Football normalizer come from RedCard.Live. All covered live competitions are requested in one bulk call, including women's competitions when supplied. Only straight-red and second-yellow dismissals appear in the default view; ordinary yellows are ignored.

## Deployment and shared state

The existing Expo site still builds normally. Vite adds this independent page to `SourDoughMobile/dist/redcard-7c4f/` afterwards. Pages Functions proxy only that path's read-only API to the `sourdough-redcard` Worker through a service binding. The Worker has no public workers.dev URL. One globally named SQLite Durable Object stores live state, the next scheduled poll, a daily request reservation counter, and dismissal IDs for deduplication.

Durable Object alarms refresh upstream even when no browser is open. Concurrent visitors and repeated alarms share the same in-flight request. Each attempt reserves quota and the next due time durably before making the network call; failures preserve the last good data and back off. A repaired implementation revision can retry a failed snapshot once without resetting the stored daily counter. The frontend checks cached state every ten seconds while visible, without creating an upstream request per visitor. This Cloudflare deployment uses short cached requests instead of the original Node application's SSE stream.

The free API-Football plan permits 100 requests/day. Production defaults to one request every 1,200 seconds (about 72/day), with an independent hard cap of 85 attempts per UTC day. The remaining quota is available for manual checks. The cap applies to this Worker; any other program using the same key also spends the provider's quota. A match can change or finish between these snapshots; update age and cadence appear visibly.

After upgrading the same key to the 7,500/day tier, set GitHub repository variables `REDCARD_POLL_INTERVAL_SECONDS=20` and `REDCARD_DAILY_REQUEST_LIMIT=7000`, then rerun the Deploy workflow. Twenty-second polling uses about 4,320 requests/day. Do not enable this cadence before the paid plan is active.

## Provider networking

The deployed native-fetch adapter passes a mocked Cloudflare workerd regression test. Production calls currently receive API-Football's per-minute rate-limit response even with daily quota remaining. [API-Football documents that shared source IPs can combine unrelated traffic and specifically cautions about Cloudflare Workers](https://www.api-football.com/news/post/how-ratelimit-works). Shared Cloudflare egress is the likely cause. A provider-side resolution or a dedicated-IP relay is needed for reliable access; a higher daily allowance alone does not guarantee a fix. Do not rotate deployment locations or API keys to evade the provider's network protections.

Provider error bodies and rate-limit headers are recorded in private Worker logs with the configured key redacted. The public interface shows an outage and keeps the daily reservation cap and progressive backoff. No sample matches are substituted for failed production requests.

## Secrets and permissions

GitHub Actions requires the existing `CLOUDFLARE_ACCOUNT_ID` and `CLOUDFLARE_API_TOKEN`, plus the encrypted `API_FOOTBALL_KEY` secret. The Cloudflare token uses Pages Edit and Workers Admin, scoped to the account hosting the hobby site. Workers Admin permits creation of the new Worker and its Durable Object. SQLite Durable Objects work on Cloudflare's Free plan. The provider key is uploaded as a Worker secret, never a frontend environment variable or committed file.

The root site's service worker ignores this subtree and deletes only its own old caches. RedCard's scoped worker never caches the API and shows an offline fallback when disconnected. Its manifest, icons and launch URL stay inside this subtree.

## Local checks

```sh
cd RedCard
npm ci
npm run check
npm run worker:check
```

Tests cover normalization, women's fixtures, UI dismissal/status rendering, simultaneous visitors, restart persistence, reservation ordering, daily cap/reset, failure retention, repair recovery and notification deduplication. A mocked workerd test checks the real provider adapter in Cloudflare's runtime, including native fetch's receiver requirement. To run the backend locally, put `API_FOOTBALL_KEY` in an ignored `.dev.vars` and use `npm run worker:dev`. Keep the free-tier limits and avoid running a second automatic poller against the same key.
