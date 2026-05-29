# BTC Flippening Image API Sprint Progress

**Sprint window:** 2026-05-28 to 2026-06-04  
**Primary hypothesis:** People will reuse a credible, real-time, directly linkable BTC flippening image in a tweet, newsletter, group chat, or embed.

## Success Line

- At least 3 non-friends explicitly say they would use, repost, or embed the image.
- At least 1 real external post, newsletter placement, group share, or embed happens.
- At least 1 user asks for a new asset, field, or style.
- The public methodology survives review without a core formula or source objection breaking it.

## Cut Line

- The seed group says only "interesting" and nobody wants to use the image.
- The data methodology cannot be defended after basic review.
- The image is opened but not reused.
- People mostly ask for a generic price chart instead of flippening fields.

## Day Plan

| Day | Date | Target | Status | Notes |
| --- | --- | --- | --- | --- |
| 1 | 2026-05-28 | Lock methodology, assets, metrics, docs, seed list shape | Done | Created sprint docs, asset config, metric formulas, and formula tests. |
| 2 | 2026-05-29 | Publish methodology page and run dunk test with 2-3 reviewers | In progress | `/methodology` page exists. Needs local browser/build check and external reviewer feedback. |
| 3 | 2026-05-30 | Build Data API and request logging | In progress | Data API exists and passed smoke tests. Request logging is still pending. |
| 4 | 2026-05-31 | Build Image API template | Pending |  |
| 5 | 2026-06-01 | Stabilize image URLs, cache behavior, and visual QA | Pending |  |
| 6 | 2026-06-02 | Run seed test with 20 targets | Pending |  |
| 7 | 2026-06-03 | Fix reuse blockers and decide continue/kill | Pending | Deadline buffer until 2026-06-04. |

## Current Scope

### In

- Public methodology page.
- Data endpoints:
  - `/api/assets`
  - `/api/flip/btc/[target]`
  - `/api/flip/btc/next`
- Image endpoints:
  - `/img/btc-vs-gold.png`
  - `/img/btc-vs-silver.png`
  - `/img/btc-vs-nvidia.png`
  - `/img/btc-vs-apple.png`
  - `/img/btc-vs-microsoft.png`
  - `/img/btc-vs-tesla.png`
  - `/img/btc-next.png`
- Lightweight request logging with endpoint, target, referrer, user agent, and IP hash.
- One image template only.

### Out

- Sheets.
- Telegram or Discord bot.
- RSS.
- Alerts.
- MCP.
- TradingView.
- User accounts.
- Multiple image styles.

## Seed Test Script

Ask one specific action question:

> Would you put this image in your next tweet, newsletter, group chat, or article? If not, what blocks you?

Send three links:

- Ready image: `/img/btc-next.png?ref=seed_<id>`
- Methodology: `/methodology?ref=seed_<id>`
- Target example: `/img/btc-vs-gold.png?ref=seed_<id>`

## Decision Log

- 2026-05-28: Sprint scope narrowed to Methodology, Data API, Image API, and seed test.
- 2026-05-28: Added `tsx` test runner for flip formula tests.
- 2026-05-28: Locked target list to Gold, Silver, NVIDIA, Apple, Microsoft, and Tesla.
- 2026-05-28: Formula convention set: if BTC already exceeds a target, remaining gap is reported as `0` and 24h gap change is based on clamped gaps.
- 2026-05-28: Data API shape implemented for `/api/assets`, `/api/flip/btc/[target]`, and `/api/flip/btc/next`.

## Verification Log

- 2026-05-28: `yarn test:flip` passed.
- 2026-05-28: `yarn lint` passed.
- 2026-05-28: `yarn tsc --noEmit` passed.
- 2026-05-28: Local smoke test passed for `/methodology`, `/api/assets`, `/api/flip/btc/gold`, and `/api/flip/btc/next`.

## Next Action

Implement request logging, then start the Image API:

- Log endpoint, target, referrer, user agent, optional `ref`, and SHA-256 IP hash.
- Add `/img/btc-vs-gold.png` and `/img/btc-next.png` first.
- Keep one visual template only.
