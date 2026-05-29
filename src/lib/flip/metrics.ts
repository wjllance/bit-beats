export interface FlipMetricInput {
  btcMarketCap: number;
  btcPrice: number;
  targetMarketCap: number;
  previousBtcMarketCap?: number;
  previousTargetMarketCap?: number;
}

export interface FlipMetrics {
  progress_pct: number;
  gap_usd: number;
  required_btc_price: number;
  gap_change_24h: number | null;
}

interface TargetMarketCap {
  slug: string;
  marketCap: number;
}

export function calculateFlipMetrics(input: FlipMetricInput): FlipMetrics {
  const progressPct = (input.btcMarketCap / input.targetMarketCap) * 100;
  const gapUsd = Math.max(input.targetMarketCap - input.btcMarketCap, 0);
  const requiredBtcPrice =
    input.btcPrice * (input.targetMarketCap / input.btcMarketCap);

  const hasPreviousGap =
    typeof input.previousBtcMarketCap === "number" &&
    typeof input.previousTargetMarketCap === "number";

  const gapChange24h = hasPreviousGap
    ? gapUsd -
      Math.max(
        input.previousTargetMarketCap! - input.previousBtcMarketCap!,
        0
      )
    : null;

  return {
    progress_pct: round(progressPct, 2),
    gap_usd: round(gapUsd, 2),
    required_btc_price: round(requiredBtcPrice, 2),
    gap_change_24h:
      typeof gapChange24h === "number" ? round(gapChange24h, 2) : null,
  };
}

export function findNextTarget(
  btcMarketCap: number,
  targets: TargetMarketCap[]
): string | null {
  const nextTarget = targets
    .filter((target) => target.marketCap > btcMarketCap)
    .sort((a, b) => a.marketCap - b.marketCap)[0];

  return nextTarget?.slug ?? null;
}

export function formatTargetSlug(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/^btc-vs-/, "")
    .replace(/\.png$/, "");
}

function round(value: number, decimals: number): number {
  const factor = 10 ** decimals;
  return Math.round(value * factor) / factor;
}
