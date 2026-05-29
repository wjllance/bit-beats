export type FlipTargetSlug =
  | "gold"
  | "silver"
  | "nvidia"
  | "apple"
  | "microsoft"
  | "tesla";

export type FlipAssetType = "commodity" | "stock";

export interface FlipTargetAsset {
  slug: FlipTargetSlug;
  name: string;
  symbol: string;
  type: FlipAssetType;
  source: string;
  methodologyNote: string;
}

export const METHODOLOGY_PATH = "/methodology";
export const CACHE_TTL_SECONDS = 300;

export const FLIP_TARGETS: FlipTargetAsset[] = [
  {
    slug: "gold",
    name: "Gold",
    symbol: "XAU",
    type: "commodity",
    source: "MetalPriceAPI + above-ground supply estimate",
    methodologyNote:
      "Market cap is estimated from spot price per troy ounce multiplied by an above-ground supply estimate.",
  },
  {
    slug: "silver",
    name: "Silver",
    symbol: "XAG",
    type: "commodity",
    source: "MetalPriceAPI + above-ground supply estimate",
    methodologyNote:
      "Market cap is estimated from spot price per troy ounce multiplied by an above-ground supply estimate.",
  },
  {
    slug: "nvidia",
    name: "NVIDIA",
    symbol: "NVDA",
    type: "stock",
    source: "Financial Modeling Prep",
    methodologyNote:
      "Market cap is the latest available quoted equity market capitalization.",
  },
  {
    slug: "apple",
    name: "Apple",
    symbol: "AAPL",
    type: "stock",
    source: "Financial Modeling Prep",
    methodologyNote:
      "Market cap is the latest available quoted equity market capitalization.",
  },
  {
    slug: "microsoft",
    name: "Microsoft",
    symbol: "MSFT",
    type: "stock",
    source: "Financial Modeling Prep",
    methodologyNote:
      "Market cap is the latest available quoted equity market capitalization.",
  },
  {
    slug: "tesla",
    name: "Tesla",
    symbol: "TSLA",
    type: "stock",
    source: "Financial Modeling Prep",
    methodologyNote:
      "Market cap is the latest available quoted equity market capitalization.",
  },
];

export function getFlipTarget(slug: string): FlipTargetAsset | undefined {
  return FLIP_TARGETS.find((target) => target.slug === slug);
}

export function getSupportedTargetSlugs(): FlipTargetSlug[] {
  return FLIP_TARGETS.map((target) => target.slug);
}
