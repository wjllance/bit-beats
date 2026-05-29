import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  calculateFlipMetrics,
  findNextTarget,
  formatTargetSlug,
} from "./metrics";

describe("calculateFlipMetrics", () => {
  it("calculates progress, market-cap gap, required BTC price, and 24h gap change", () => {
    const metrics = calculateFlipMetrics({
      btcMarketCap: 2_000,
      btcPrice: 100,
      targetMarketCap: 5_000,
      previousBtcMarketCap: 1_800,
      previousTargetMarketCap: 5_200,
    });

    assert.equal(metrics.progress_pct, 40);
    assert.equal(metrics.gap_usd, 3_000);
    assert.equal(metrics.required_btc_price, 250);
    assert.equal(metrics.gap_change_24h, -400);
  });

  it("does not return negative gap when BTC already exceeds the target", () => {
    const metrics = calculateFlipMetrics({
      btcMarketCap: 6_000,
      btcPrice: 120,
      targetMarketCap: 5_000,
      previousBtcMarketCap: 5_500,
      previousTargetMarketCap: 5_100,
    });

    assert.equal(metrics.progress_pct, 120);
    assert.equal(metrics.gap_usd, 0);
    assert.equal(metrics.required_btc_price, 100);
    assert.equal(metrics.gap_change_24h, 0);
  });
});

describe("findNextTarget", () => {
  it("returns the nearest asset above BTC by market cap", () => {
    const next = findNextTarget(2_500, [
      { slug: "gold", marketCap: 20_000 },
      { slug: "silver", marketCap: 3_000 },
      { slug: "tesla", marketCap: 1_000 },
    ]);

    assert.equal(next, "silver");
  });

  it("returns null when BTC is above every configured target", () => {
    const next = findNextTarget(25_000, [
      { slug: "gold", marketCap: 20_000 },
      { slug: "silver", marketCap: 3_000 },
    ]);

    assert.equal(next, null);
  });
});

describe("formatTargetSlug", () => {
  it("normalizes user input to supported target slugs", () => {
    assert.equal(formatTargetSlug("Gold"), "gold");
    assert.equal(formatTargetSlug("btc-vs-nvidia.png"), "nvidia");
    assert.equal(formatTargetSlug("BTC-VS-MICROSOFT.PNG"), "microsoft");
  });
});
