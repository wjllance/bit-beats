import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { buildImageCopy, parseFlipImageSlug } from "./images";

describe("parseFlipImageSlug", () => {
  it("parses supported target image filenames", () => {
    assert.deepEqual(parseFlipImageSlug("btc-vs-gold.png"), {
      kind: "target",
      target: "gold",
    });
    assert.deepEqual(parseFlipImageSlug("btc-vs-microsoft.png"), {
      kind: "target",
      target: "microsoft",
    });
  });

  it("parses the next target image filename", () => {
    assert.deepEqual(parseFlipImageSlug("btc-next.png"), {
      kind: "next",
      target: null,
    });
  });

  it("rejects unsupported image filenames", () => {
    assert.equal(parseFlipImageSlug("btc-vs-amazon.png"), null);
    assert.equal(parseFlipImageSlug("gold.png"), null);
  });
});

describe("buildImageCopy", () => {
  it("formats the image headline and metric text", () => {
    const copy = buildImageCopy({
      targetName: "Gold",
      response: {
        base: "btc",
        target: "gold",
        updated_at: "2026-05-29T02:00:00.000Z",
        cache_ttl: 300,
        methodology_url: "https://btchits.top/methodology",
        source: {
          btc: "CoinGecko",
          target: "MetalPriceAPI",
        },
        metrics: {
          progress_pct: 12.34,
          gap_usd: 17_500_000_000_000,
          required_btc_price: 432_100,
          gap_change_24h: -250_000_000_000,
          next_target: "gold",
        },
      },
    });

    assert.equal(copy.title, "BTC vs Gold");
    assert.equal(copy.progress, "12.34% of Gold");
    assert.equal(copy.requiredPrice, "$432,100/BTC to flip");
    assert.equal(copy.gap, "$17.5T gap");
    assert.equal(copy.gapChange, "$250B closer in 24h");
  });
});
