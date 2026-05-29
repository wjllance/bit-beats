# BTC Flippening Image API Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build and validate a one-week MVP that exposes credible BTC flippening data and reusable image URLs for six target assets.

**Architecture:** Keep the implementation small and composable. Shared flippening logic lives in `src/lib/flip/*`; route handlers only parse input, call the shared library, log requests, and return JSON or PNG responses. The methodology page explains sources, formulas, cache behavior, and limitations so the image can be trusted without hand-holding.

**Tech Stack:** Next.js App Router, TypeScript, Tailwind CSS, Upstash Redis, existing CoinGecko/FMP/MetalPrice integrations, Next.js `ImageResponse`.

---

## Files

- Create: `src/lib/flip/assets.ts` for asset configuration and source labels.
- Create: `src/lib/flip/metrics.ts` for deterministic metric calculations.
- Create: `src/lib/flip/snapshot.ts` for fetching and normalizing BTC plus target asset data.
- Create: `src/lib/flip/logging.ts` for request logging with hashed IP.
- Create: `src/app/methodology/page.tsx` for the public methodology.
- Create: `src/app/api/assets/route.ts` for target asset metadata.
- Create: `src/app/api/flip/btc/[target]/route.ts` for target-specific flip data.
- Create: `src/app/api/flip/btc/next/route.ts` for nearest target data.
- Create: `src/app/img/[image]/route.tsx` for image URL generation.
- Modify: `src/app/layout.tsx` to include methodology-friendly metadata if needed.
- Modify: `docs/flip-week/progress.md` after each work session.

## Task 1: Methodology and Domain Model

**Files:**
- Create: `src/lib/flip/assets.ts`
- Create: `src/lib/flip/metrics.ts`
- Create: `src/app/methodology/page.tsx`
- Modify: `docs/flip-week/progress.md`

- [ ] Define the six target assets with stable slugs: `gold`, `silver`, `nvidia`, `apple`, `microsoft`, `tesla`.
- [ ] Define formulas for `progress_pct`, `gap_usd`, `required_btc_price`, `gap_change_24h`, and `next_target`.
- [ ] Add a public methodology page that explains sources, formulas, update frequency, cache TTL, and limitations.
- [ ] Run `yarn lint` and fix issues in touched files.
- [ ] Update `docs/flip-week/progress.md` Day 1 and Day 2 notes.

## Task 2: Data Snapshot and JSON API

**Files:**
- Create: `src/lib/flip/snapshot.ts`
- Create: `src/app/api/assets/route.ts`
- Create: `src/app/api/flip/btc/[target]/route.ts`
- Create: `src/app/api/flip/btc/next/route.ts`
- Modify: `docs/flip-week/progress.md`

- [ ] Reuse existing market-data concepts where possible, but keep flip-specific calculations isolated in `src/lib/flip`.
- [ ] Return JSON with `base`, `target`, `updated_at`, `cache_ttl`, `source`, `methodology_url`, and `metrics`.
- [ ] Make invalid targets return a stable 404 JSON error with supported target slugs.
- [ ] Add CDN cache headers with a 5-minute TTL.
- [ ] Run `yarn lint` and a local endpoint smoke test.
- [ ] Update `docs/flip-week/progress.md` Day 3 notes.

## Task 3: Request Logging

**Files:**
- Create: `src/lib/flip/logging.ts`
- Modify: `src/app/api/assets/route.ts`
- Modify: `src/app/api/flip/btc/[target]/route.ts`
- Modify: `src/app/api/flip/btc/next/route.ts`
- Modify: `src/app/img/[image]/route.tsx`
- Modify: `docs/flip-week/progress.md`

- [ ] Log endpoint, target, referrer, user agent, optional `ref` query param, and SHA-256 IP hash.
- [ ] Do not store raw IP addresses.
- [ ] If Redis credentials are missing, skip logging without breaking responses.
- [ ] Run `yarn lint`.
- [ ] Update `docs/flip-week/progress.md`.

## Task 4: Image API

**Files:**
- Create: `src/app/img/[image]/route.tsx`
- Modify: `docs/flip-week/progress.md`

- [ ] Support `btc-vs-gold.png`, `btc-vs-silver.png`, `btc-vs-nvidia.png`, `btc-vs-apple.png`, `btc-vs-microsoft.png`, `btc-vs-tesla.png`, and `btc-next.png`.
- [ ] Render one clean 1200x630 PNG template.
- [ ] Include target name, progress percentage, required BTC price, gap, `updated_at`, and `btchits.top/methodology` attribution.
- [ ] Add CDN cache headers with a 5-minute TTL.
- [ ] Run local image URL smoke tests.
- [ ] Update `docs/flip-week/progress.md` Day 4 and Day 5 notes.

## Task 5: Seed Test Pack

**Files:**
- Create: `docs/flip-week/seed-test.md`
- Modify: `docs/flip-week/progress.md`

- [ ] Create a 20-person seed list template with name, channel, relationship, sent_at, response, reuse_status, and notes.
- [ ] Write a short outreach message that asks only whether they would reuse the image.
- [ ] Add the three required links: ready image, methodology page, and target URL example.
- [ ] Track responses and classify them as `used`, `would_use`, `blocked`, or `interesting_only`.
- [ ] Update the Day 6 notes in `docs/flip-week/progress.md`.

## Task 6: Decision Review

**Files:**
- Create: `docs/flip-week/decision-review.md`
- Modify: `docs/flip-week/progress.md`

- [ ] Summarize seed test results against the success line and cut line.
- [ ] List the top reuse blockers.
- [ ] Decide one of: continue into Widget/Alerts, iterate image/methodology, or kill the direction.
- [ ] Update final sprint status in `docs/flip-week/progress.md`.
- [ ] Run `yarn lint` and `yarn build`.
