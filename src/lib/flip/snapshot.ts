import axios from "axios";
import { API_ENDPOINTS, API_KEYS } from "@/utils/api-config";
import {
  CACHE_TTL_SECONDS,
  FLIP_TARGETS,
  FlipTargetSlug,
  getFlipTarget,
} from "./assets";
import { calculateFlipMetrics, findNextTarget } from "./metrics";

const GOLD_SUPPLY_TONS = 216_265;
const SILVER_SUPPLY_TONS = 1_600_000;
const METRIC_TON_TO_OUNCES = 35_274;

interface BaseSnapshot {
  marketCap: number;
  previousMarketCap: number;
  price: number;
  source: string;
}

interface TargetSnapshot {
  slug: FlipTargetSlug;
  name: string;
  symbol: string;
  marketCap: number;
  previousMarketCap: number;
  source: string;
}

interface TargetMarketCap {
  slug: string;
  marketCap: number;
}

export interface FlipResponse {
  base: "btc";
  target: FlipTargetSlug;
  updated_at: string;
  cache_ttl: number;
  source: {
    btc: string;
    target: string;
  };
  methodology_url: string;
  metrics: {
    progress_pct: number;
    gap_usd: number;
    required_btc_price: number;
    gap_change_24h: number | null;
    next_target: string | null;
  };
}

interface BuildFlipResponseInput {
  base: BaseSnapshot;
  target: TargetSnapshot;
  targets: TargetMarketCap[];
  updatedAt: Date;
  origin: string;
}

interface BuildNextFlipResponseInput {
  base: BaseSnapshot;
  targets: TargetSnapshot[];
  updatedAt: Date;
  origin: string;
}

interface CoinGeckoMarket {
  current_price: number;
  market_cap: number;
  market_cap_change_percentage_24h?: number;
}

interface StockQuote {
  symbol: string;
  name: string;
  price: number;
  changesPercentage: number;
  marketCap: number;
}

interface MetalPriceResponse {
  rates?: {
    USDXAU?: number;
    USDXAG?: number;
  };
}

const FALLBACK_BASE: BaseSnapshot = {
  marketCap: 2_000_000_000_000,
  previousMarketCap: 1_950_000_000_000,
  price: 100_000,
  source: "Fallback estimate",
};

const FALLBACK_TARGETS: Record<FlipTargetSlug, TargetSnapshot> = {
  gold: {
    slug: "gold",
    name: "Gold",
    symbol: "XAU",
    marketCap: 20_000_000_000_000,
    previousMarketCap: 19_900_000_000_000,
    source: "Fallback estimate",
  },
  silver: {
    slug: "silver",
    name: "Silver",
    symbol: "XAG",
    marketCap: 1_900_000_000_000,
    previousMarketCap: 1_920_000_000_000,
    source: "Fallback estimate",
  },
  nvidia: {
    slug: "nvidia",
    name: "NVIDIA",
    symbol: "NVDA",
    marketCap: 3_500_000_000_000,
    previousMarketCap: 3_450_000_000_000,
    source: "Fallback estimate",
  },
  apple: {
    slug: "apple",
    name: "Apple",
    symbol: "AAPL",
    marketCap: 3_400_000_000_000,
    previousMarketCap: 3_390_000_000_000,
    source: "Fallback estimate",
  },
  microsoft: {
    slug: "microsoft",
    name: "Microsoft",
    symbol: "MSFT",
    marketCap: 3_100_000_000_000,
    previousMarketCap: 3_080_000_000_000,
    source: "Fallback estimate",
  },
  tesla: {
    slug: "tesla",
    name: "Tesla",
    symbol: "TSLA",
    marketCap: 1_100_000_000_000,
    previousMarketCap: 1_080_000_000_000,
    source: "Fallback estimate",
  },
};

export function buildFlipResponse({
  base,
  target,
  targets,
  updatedAt,
  origin,
}: BuildFlipResponseInput): FlipResponse {
  const metrics = calculateFlipMetrics({
    btcMarketCap: base.marketCap,
    btcPrice: base.price,
    targetMarketCap: target.marketCap,
    previousBtcMarketCap: base.previousMarketCap,
    previousTargetMarketCap: target.previousMarketCap,
  });

  return {
    base: "btc",
    target: target.slug,
    updated_at: updatedAt.toISOString(),
    cache_ttl: CACHE_TTL_SECONDS,
    source: {
      btc: base.source,
      target: target.source,
    },
    methodology_url: `${origin}/methodology`,
    metrics: {
      ...metrics,
      next_target: findNextTarget(base.marketCap, targets),
    },
  };
}

export function buildNextFlipResponse({
  base,
  targets,
  updatedAt,
  origin,
}: BuildNextFlipResponseInput): FlipResponse {
  const nextSlug = findNextTarget(base.marketCap, targets);
  const target =
    targets.find((candidate) => candidate.slug === nextSlug) ??
    [...targets].sort((a, b) => b.marketCap - a.marketCap)[0];

  return buildFlipResponse({
    base,
    target,
    targets,
    updatedAt,
    origin,
  });
}

export async function getFlipResponse(
  targetSlug: FlipTargetSlug,
  origin: string
): Promise<FlipResponse> {
  const snapshot = await getFlipSnapshot();
  const target = snapshot.targets.find((item) => item.slug === targetSlug);

  if (!target) {
    throw new Error(`Unsupported flip target: ${targetSlug}`);
  }

  return buildFlipResponse({
    base: snapshot.base,
    target,
    targets: snapshot.targets,
    updatedAt: snapshot.updatedAt,
    origin,
  });
}

export async function getNextFlipResponse(origin: string): Promise<FlipResponse> {
  const snapshot = await getFlipSnapshot();

  return buildNextFlipResponse({
    base: snapshot.base,
    targets: snapshot.targets,
    updatedAt: snapshot.updatedAt,
    origin,
  });
}

export async function getFlipSnapshot(): Promise<{
  base: BaseSnapshot;
  targets: TargetSnapshot[];
  updatedAt: Date;
}> {
  const [base, stockTargets, commodityTargets] = await Promise.all([
    fetchBtcSnapshot(),
    fetchStockTargets(),
    fetchCommodityTargets(),
  ]);

  const targets = FLIP_TARGETS.map((target) => {
    return (
      [...stockTargets, ...commodityTargets].find(
        (snapshot) => snapshot.slug === target.slug
      ) ?? FALLBACK_TARGETS[target.slug]
    );
  });

  return {
    base,
    targets,
    updatedAt: new Date(),
  };
}

export function getCacheHeaders(): HeadersInit {
  return {
    "Cache-Control": `public, s-maxage=${CACHE_TTL_SECONDS}, stale-while-revalidate=600`,
  };
}

function previousFromChange(current: number, changePercent?: number): number {
  if (typeof changePercent !== "number" || changePercent <= -100) {
    return current;
  }

  return current / (1 + changePercent / 100);
}

async function fetchBtcSnapshot(): Promise<BaseSnapshot> {
  try {
    const response = await axios.get<CoinGeckoMarket[]>(
      `${API_ENDPOINTS.COINGECKO}/coins/markets`,
      {
        params: {
          vs_currency: "usd",
          ids: "bitcoin",
          sparkline: false,
        },
      }
    );
    const btc = response.data[0];

    if (!btc?.market_cap || !btc.current_price) {
      return FALLBACK_BASE;
    }

    return {
      marketCap: btc.market_cap,
      previousMarketCap: previousFromChange(
        btc.market_cap,
        btc.market_cap_change_percentage_24h
      ),
      price: btc.current_price,
      source: "CoinGecko",
    };
  } catch {
    return FALLBACK_BASE;
  }
}

async function fetchStockTargets(): Promise<TargetSnapshot[]> {
  const stockTargets = FLIP_TARGETS.filter((target) => target.type === "stock");

  try {
    const response = await axios.get<StockQuote[]>(
      `${API_ENDPOINTS.FMP}/quote/${stockTargets
        .map((target) => target.symbol)
        .join(",")}`,
      { params: { apikey: API_KEYS.FMP } }
    );

    return response.data.flatMap((quote) => {
      const target = stockTargets.find((item) => item.symbol === quote.symbol);
      if (!target || !quote.marketCap) {
        return [];
      }

      return [
        {
          slug: target.slug,
          name: target.name,
          symbol: target.symbol,
          marketCap: quote.marketCap,
          previousMarketCap: previousFromChange(
            quote.marketCap,
            quote.changesPercentage
          ),
          source: target.source,
        },
      ];
    });
  } catch {
    return [];
  }
}

async function fetchCommodityTargets(): Promise<TargetSnapshot[]> {
  try {
    const [current, previous] = await Promise.all([
      fetchMetalPrices(daysAgo(1)),
      fetchMetalPrices(daysAgo(2)),
    ]);

    return [
      buildCommodityTarget("gold", current.gold, previous.gold),
      buildCommodityTarget("silver", current.silver, previous.silver),
    ];
  } catch {
    return [];
  }
}

async function fetchMetalPrices(date: string): Promise<{
  gold: number;
  silver: number;
}> {
  const [goldResponse, silverResponse] = await Promise.all([
    axios.get<MetalPriceResponse>(`${API_ENDPOINTS.METAL_PRICE}/${date}`, {
      params: { api_key: API_KEYS.METAL_PRICE, currencies: "XAU" },
    }),
    axios.get<MetalPriceResponse>(`${API_ENDPOINTS.METAL_PRICE}/${date}`, {
      params: { api_key: API_KEYS.METAL_PRICE, currencies: "XAG" },
    }),
  ]);

  return {
    gold: goldResponse.data.rates?.USDXAU ?? 0,
    silver: silverResponse.data.rates?.USDXAG ?? 0,
  };
}

function buildCommodityTarget(
  slug: "gold" | "silver",
  currentPrice: number,
  previousPrice: number
): TargetSnapshot {
  const target = getFlipTarget(slug)!;
  const supplyTons = slug === "gold" ? GOLD_SUPPLY_TONS : SILVER_SUPPLY_TONS;

  return {
    slug,
    name: target.name,
    symbol: target.symbol,
    marketCap: currentPrice * supplyTons * METRIC_TON_TO_OUNCES,
    previousMarketCap: previousPrice * supplyTons * METRIC_TON_TO_OUNCES,
    source: target.source,
  };
}

function daysAgo(count: number): string {
  const date = new Date();
  date.setUTCDate(date.getUTCDate() - count);
  return date.toISOString().slice(0, 10);
}
