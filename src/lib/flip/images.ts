import { FlipTargetSlug, getFlipTarget, getSupportedTargetSlugs } from "./assets";
import { FlipResponse } from "./snapshot";

export type FlipImageRequest =
  | {
      kind: "target";
      target: FlipTargetSlug;
    }
  | {
      kind: "next";
      target: null;
    };

export interface FlipImageCopy {
  title: string;
  progress: string;
  requiredPrice: string;
  gap: string;
  gapChange: string;
  updatedAt: string;
  methodologyUrl: string;
}

export function parseFlipImageSlug(image: string): FlipImageRequest | null {
  const normalized = image.trim().toLowerCase();

  if (normalized === "btc-next.png") {
    return { kind: "next", target: null };
  }

  const match = normalized.match(/^btc-vs-([a-z]+)\.png$/);
  const target = match?.[1];

  if (!target || !getSupportedTargetSlugs().includes(target as never)) {
    return null;
  }

  return {
    kind: "target",
    target: target as FlipTargetSlug,
  };
}

export function buildImageCopy({
  targetName,
  response,
}: {
  targetName?: string;
  response: FlipResponse;
}): FlipImageCopy {
  const name = targetName ?? getFlipTarget(response.target)?.name ?? response.target;

  return {
    title: `BTC vs ${name}`,
    progress: `${formatPercent(response.metrics.progress_pct)} of ${name}`,
    requiredPrice: `${formatUsd(response.metrics.required_btc_price)}/BTC to flip`,
    gap: `${formatCompactUsd(response.metrics.gap_usd)} gap`,
    gapChange: formatGapChange(response.metrics.gap_change_24h),
    updatedAt: formatUpdatedAt(response.updated_at),
    methodologyUrl: response.methodology_url,
  };
}

function formatPercent(value: number): string {
  return `${value.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}%`;
}

function formatUsd(value: number): string {
  return `$${Math.round(value).toLocaleString("en-US")}`;
}

function formatCompactUsd(value: number): string {
  const abs = Math.abs(value);

  if (abs >= 1_000_000_000_000) {
    return `$${trimDecimal(abs / 1_000_000_000_000)}T`;
  }

  if (abs >= 1_000_000_000) {
    return `$${trimDecimal(abs / 1_000_000_000)}B`;
  }

  if (abs >= 1_000_000) {
    return `$${trimDecimal(abs / 1_000_000)}M`;
  }

  return formatUsd(abs);
}

function formatGapChange(value: number | null): string {
  if (value === null || value === 0) {
    return "Gap unchanged in 24h";
  }

  const direction = value < 0 ? "closer" : "farther in 24h";
  const label = value < 0 ? "closer in 24h" : direction;
  return `${formatCompactUsd(value)} ${label}`;
}

function formatUpdatedAt(value: string): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "UTC",
    timeZoneName: "short",
  }).format(new Date(value));
}

function trimDecimal(value: number): string {
  return value.toFixed(1).replace(/\.0$/, "");
}
