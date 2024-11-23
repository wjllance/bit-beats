import { NextResponse } from "next/server";
import axios from "axios";
import { Redis } from "@upstash/redis";
import {
  API_ENDPOINTS,
  PRICE_HISTORY_CACHE_DURATION,
  DISABLE_CACHE,
} from "@/utils/api-config";

// Redis client initialization
const redis = new Redis({
  url: process.env.KV_REST_API_URL!,
  token: process.env.KV_REST_API_TOKEN!,
});

interface PriceData {
  labels: string[];
  prices: number[];
}

// Cache key prefix
const PRICE_HISTORY_CACHE_KEY = "price_history";

async function fetchPriceHistory(
  days: number,
  interval?: string
): Promise<PriceData> {
  try {
    const response = await axios.get(
      `${API_ENDPOINTS.COINGECKO}/coins/bitcoin/market_chart`,
      {
        params: {
          vs_currency: "usd",
          days,
          interval,
        },
      }
    );

    const { prices } = response.data;
    return {
      labels: prices.map(([timestamp]: [number, number]) =>
        new Date(timestamp).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          hour: days <= 1 ? "numeric" : undefined,
          minute: days <= 1 ? "numeric" : undefined,
        })
      ),
      prices: prices.map(([, price]: [number, number]) => price),
    };
  } catch (error) {
    console.error("Error fetching price history:", error);
    throw error;
  }
}

export async function GET(request: Request) {
  try {
    // Get query parameters
    const { searchParams } = new URL(request.url);
    const days = parseInt(searchParams.get("days") || "1", 10);
    const interval = searchParams.get("interval") || undefined;

    // Create a unique cache key based on parameters
    const cacheKey = `${PRICE_HISTORY_CACHE_KEY}:${days}:${
      interval || "default"
    }`;

    if (!DISABLE_CACHE) {
      // Try to get data from Redis cache
      const cachedData = await redis.get<PriceData>(cacheKey);
      const lastUpdate = await redis.get<number>(`${cacheKey}:timestamp`);
      const now = Date.now();

      if (
        cachedData &&
        lastUpdate &&
        now - lastUpdate < PRICE_HISTORY_CACHE_DURATION
      ) {
        console.log("Returning cached data");
        return NextResponse.json(cachedData);
      }
    }

    // Fetch fresh data
    const priceData = await fetchPriceHistory(days, interval);
    console.log("Fetched fresh data");

    if (!DISABLE_CACHE) {
      // Update cache
      await Promise.all([
        redis.set(cacheKey, priceData),
        redis.set(`${cacheKey}:timestamp`, Date.now()),
      ]);
    }

    return NextResponse.json(priceData);
  } catch (error) {
    console.error("Error in price history API:", error);
    return NextResponse.json(
      { error: "Failed to fetch price history" },
      { status: 500 }
    );
  }
}
