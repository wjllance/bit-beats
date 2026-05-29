import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { buildFlipLogEvent, hashIpAddress } from "./logging";

describe("hashIpAddress", () => {
  it("hashes IP addresses without exposing the raw value", () => {
    const hash = hashIpAddress("203.0.113.7");

    assert.equal(hash.length, 64);
    assert.notEqual(hash, "203.0.113.7");
  });
});

describe("buildFlipLogEvent", () => {
  it("extracts referrer, user agent, ref, and hashed IP from a request", () => {
    const request = new Request(
      "https://btchits.top/img/btc-vs-gold.png?ref=seed_001",
      {
        headers: {
          referer: "https://example.com/post",
          "user-agent": "newsletter-bot",
          "x-forwarded-for": "203.0.113.7, 10.0.0.1",
        },
      }
    );

    const event = buildFlipLogEvent(request, {
      endpoint: "image",
      target: "gold",
      now: new Date("2026-05-29T01:30:00.000Z"),
    });

    assert.equal(event.endpoint, "image");
    assert.equal(event.target, "gold");
    assert.equal(event.referrer, "https://example.com/post");
    assert.equal(event.user_agent, "newsletter-bot");
    assert.equal(event.ref, "seed_001");
    assert.equal(event.created_at, "2026-05-29T01:30:00.000Z");
    assert.equal(event.ip_hash.length, 64);
    assert.notEqual(event.ip_hash, "203.0.113.7");
  });
});
