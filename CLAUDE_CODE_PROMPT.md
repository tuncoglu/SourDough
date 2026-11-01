# Claude Code prompt — SourDough hostile review

Copy the block below into Claude Code at the repository root. It pairs with `HOSTILE_REVIEW_2026-11-01.md` (PR #7).

```text
You are a senior TypeScript / React Native engineer working in the SourDough repository.

A hostile review of current `main` is open as PR #7, file `HOSTILE_REVIEW_2026-11-01.md`. Your job is to verify its findings and fix the highest-impact ones with small, tested PRs — not to rewrite the app or blindly implement every suggestion.

Start in plan mode. Read:
- PR #7: `gh pr view 7`
- The full report: `git fetch origin && git show origin/review/hostile-2026-11-01:HOSTILE_REVIEW_2026-11-01.md` (if PR #7 is already merged, read it from `main`)
- `README.md`
- `SourDoughMobile/AGENTS.md` and `SourDoughMobile/CLAUDE.md`
- The code referenced by each finding.

Do not merge PR #7; it is the review artifact.

## Phase 0 — triage only

For every finding in the report:
1. Reproduce it, or mark it "not reproduced / needs device / latent / suspicion".
2. Record the evidence and the exact files/lines.
3. Propose the minimal fix and the regression test.
4. Flag anything that needs a product decision.

Produce a table: finding number, severity, shipped vs latent, reproduced?, evidence, proposed fix, test, files. Then stop and wait for approval. Do not edit code yet.

## Phase 1 — fix the top five

Work in this order, one draft PR per group, each branching from `main`. Keep each PR focused; do not combine model changes with unrelated UI work.

1. High-temperature model — `packages/calc/src/lib/calculations.ts`
   Acceptance: the rate is non-increasing above the optimum; 45°C and 100°C do not return a 2h bulk; hot dough is stalled or clearly slower than at 38°C; tests at 38/42/45/50°C. Do not just raise the minimum-hours floor. While in the curve, check the cold end (4°C) and report uncertainty.

2. Native kitchen temperature — `SourDoughMobile/app/(tabs)/bread.tsx`, `useCalculatorInputs.ts`, `useKitchenTemp.ts`
   Acceptance: `fermTempOverride` wins on the bread page; outdoor weather is labelled as outdoor and is not used as the kitchen or flour temperature; starter status/peak uses the same source; test outdoor=4°C with setting=20°C.

3. Silent weather fallback — `SourDoughMobile/src/lib/location.ts`, `useCalculatorInputs.ts`, `LocationBar.tsx`
   Acceptance: if Open-Meteo fails after a successful geocode, the user sees a degraded-estimate warning; no silent 22°C/18°C values with an "auto" badge; test with mocked null weather.

4. Dynamic fermentation — `packages/calc/src/lib/breadPlan.ts`, `calculations.ts`, README
   Acceptance: if kept, pass a forecast or constant ambient series and advance one hour per hourly forecast point; test that the profile's wall-clock span equals `bulkHours`; if not shipping, remove the dynamic claim and the "dynamic estimate above" advice. Do not leave a half-enabled path.

5. Location / hardness — `packages/calc/src/data/waterHardness.ts`, `api.ts`, `useLocation.tsx`, the Android location module, privacy text
   Acceptance: England uses correct regional/postcode data; assumed hardness is labelled assumed; postcode text is validated; Android "Approximate" permission is accepted; stale last-known fixes are rejected or labelled; tests for Manchester, London, and an invalid postcode.

## Constraints

- Never commit to `main`; never force-push; do not merge PRs; open draft PRs only.
- Keep diffs minimal and scoped. No unrelated refactors or formatting churn.
- `packages/calc` is shared by mobile and all web apps. After any change there, run the mobile Jest suite and all four web app test suites.
- Add a failing regression test before or with each fix. Do not update expected values to match a bug.
- Update docs/claims when behavior changes, including the README's dynamic/autolyse/hydration claims and `apps/bread/src/Recipe.tsx` assumptions.
- Do not change water or flour data values without a cited source.
- Never print, log, or commit secrets (`~/.pi/agent/auth.json`, `~/.config/gh/hosts.yml`, `~/.ssh/*`, `~/.secrets/*`, `.dev.vars`, keystores).
- Do not deploy, touch Cloudflare/DNS/Play, or run `npm audit fix --force`.
- If a finding is wrong or ambiguous, say so with evidence. Do not invent a fix.
- Stop after Phase 1 and report. Do not start medium/low findings without approval.

## Validation

Run the relevant commands and put the results in each PR:

- `cd SourDoughMobile && npx tsc --noEmit && npx jest --silent`
- `npx tsc -p ../functions`
- `npx tsc -p ../packages/calc`
- For each affected app: `npm test && npm run build`
- Any new focused test files.

## Deliverable

First: the Phase 0 triage table. After approval: draft PRs in the order above, each containing the finding number, reproduction, regression test, validation output, and a short risk note. Do not merge anything.
```
