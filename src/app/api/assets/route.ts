import { NextResponse } from "next/server";
import {
  CACHE_TTL_SECONDS,
  FLIP_TARGETS,
  METHODOLOGY_PATH,
} from "@/lib/flip/assets";
import { getCacheHeaders } from "@/lib/flip/snapshot";

export async function GET(request: Request) {
  const origin = new URL(request.url).origin;

  return NextResponse.json(
    {
      base: {
        slug: "btc",
        name: "Bitcoin",
        symbol: "BTC",
        source: "CoinGecko",
      },
      targets: FLIP_TARGETS,
      cache_ttl: CACHE_TTL_SECONDS,
      methodology_url: `${origin}${METHODOLOGY_PATH}`,
    },
    {
      headers: getCacheHeaders(),
    }
  );
}
