import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { buildFlipResponse, buildNextFlipResponse } from "./snapshot";

const now = new Date("2026-05-28T12:00:00.000Z");

describe("buildFlipResponse", () => {
  it("builds the stable public JSON shape for one target", () => {
    const response = buildFlipResponse({
      base: {
        marketCap: 2_000,
        previousMarketCap: 1_800,
        price: 100,
        source: "CoinGecko",
      },
      target: {
        slug: "gold",
        name: "Gold",
        symbol: "XAU",
        marketCap: 5_000,
        previousMarketCap: 5_200,
        source: "MetalPriceAPI",
      },
      targets: [
        { slug: "gold", marketCap: 5_000 },
        { slug: "silver", marketCap: 3_000 },
      ],
      updatedAt: now,
      origin: "https://btchits.top",
    });

    assert.equal(response.base, "btc");
    assert.equal(response.target, "gold");
    assert.equal(response.updated_at, "2026-05-28T12:00:00.000Z");
    assert.equal(response.cache_ttl, 300);
    assert.equal(response.methodology_url, "https://btchits.top/methodology");
    assert.deepEqual(response.source, {
      btc: "CoinGecko",
      target: "MetalPriceAPI",
    });
    assert.deepEqual(response.metrics, {
      progress_pct: 40,
      gap_usd: 3_000,
      required_btc_price: 250,
      gap_change_24h: -400,
      next_target: "silver",
    });
  });
});

describe("buildNextFlipResponse", () => {
  it("uses the nearest target above BTC", () => {
    const response = buildNextFlipResponse({
      base: {
        marketCap: 2_500,
        previousMarketCap: 2_400,
        price: 125,
        source: "CoinGecko",
      },
      targets: [
        {
          slug: "gold",
          name: "Gold",
          symbol: "XAU",
          marketCap: 20_000,
          previousMarketCap: 20_100,
          source: "MetalPriceAPI",
        },
        {
          slug: "silver",
          name: "Silver",
          symbol: "XAG",
          marketCap: 3_000,
          previousMarketCap: 3_100,
          source: "MetalPriceAPI",
        },
      ],
      updatedAt: now,
      origin: "https://btchits.top",
    });

    assert.equal(response.target, "silver");
    assert.equal(response.metrics.next_target, "silver");
  });
});
