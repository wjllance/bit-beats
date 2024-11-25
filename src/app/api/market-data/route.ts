import { NextResponse } from "next/server";
import axios from "axios";
import { Redis } from "@upstash/redis";
import {
  API_ENDPOINTS,
  API_KEYS,
  STOCK_CACHE_DURATION,
  COMMODITY_CACHE_DURATION,
  CRYPTO_CACHE_DURATION,
  DISABLE_CACHE,
} from "@/utils/api-config";

interface MarketData {
  id: string;
  name: string;
  symbol: string;
  current_price: number;
  price_change_percentage_24h: number;
  market_cap: number;
  type: "crypto" | "stock" | "commodity";
}

interface CachedData {
  stocks: MarketData[];
  commodities: MarketData[];
  crypto: MarketData[];
  timestamp?: number;
}

// Constants
const POPULAR_STOCKS = [
  "AAPL",
  "MSFT",
  "GOOGL",
  "AMZN",
  "NVDA",
  "TSLA",
  "TSM",
  "META",
  "BRK.B",
  "JPM",
  "UNH",
  "2222.SR",
];
const GOLD_SUPPLY_TONS = 205000;
const SILVER_SUPPLY_TONS = 1751000;
const METRIC_TON_TO_OUNCES = 35274;
const SAR_TO_USD = 0.2666; // 1 SAR = 0.2666 USD (fixed rate for Saudi Riyal)

const disableCache = DISABLE_CACHE;

// Redis client initialization
const redis = new Redis({
  url: process.env.KV_REST_API_URL!,
  token: process.env.KV_REST_API_TOKEN!,
});

// Cache keys
const STOCKS_CACHE_KEY = "market_data:stocks";
const COMMODITIES_CACHE_KEY = "market_data:commodities";
const CRYPTO_CACHE_KEY = "market_data:crypto";

// Fallback data
const FALLBACK_DATA: CachedData = {
  stocks: [
    {
      id: "AAPL",
      name: "Apple Inc.",
      symbol: "AAPL",
      current_price: 229.87,
      price_change_percentage_24h: 0.5908,
      market_cap: 3474668946000,
      type: "stock",
    },
    {
      id: "MSFT",
      name: "Microsoft Corporation",
      symbol: "MSFT",
      current_price: 417,
      price_change_percentage_24h: 1.0003,
      market_cap: 3100344960000,
      type: "stock",
    },
    {
      id: "GOOGL",
      name: "Alphabet Inc.",
      symbol: "GOOGL",
      current_price: 164.76,
      price_change_percentage_24h: -1.7121,
      market_cap: 2023821718587,
      type: "stock",
    },
    {
      id: "AMZN",
      name: "Amazon.com, Inc.",
      symbol: "AMZN",
      current_price: 197.12,
      price_change_percentage_24h: -0.6351,
      market_cap: 2072716800000,
      type: "stock",
    },
    {
      id: "NVDA",
      name: "NVIDIA Corporation",
      symbol: "NVDA",
      current_price: 141.95,
      price_change_percentage_24h: -3.2181,
      market_cap: 3482033500000,
      type: "stock",
    },
    {
      id: "TSLA",
      name: "Tesla, Inc.",
      symbol: "TSLA",
      current_price: 352.56,
      price_change_percentage_24h: 3.804,
      market_cap: 1131738753600,
      type: "stock",
    },
    {
      id: "TSM",
      name: "Taiwan Semiconductor Manufacturing Company Limited",
      symbol: "TSM",
      current_price: 190.08,
      price_change_percentage_24h: -0.6066,
      market_cap: 828164754490,
      type: "stock",
    },
    {
      id: "META",
      name: "Meta Platforms, Inc.",
      symbol: "META",
      current_price: 559.14,
      price_change_percentage_24h: -0.7015,
      market_cap: 1411269817936,
      type: "stock",
    },
    {
      id: "JPM",
      name: "JPMorgan Chase & Co.",
      symbol: "JPM",
      current_price: 248.55,
      price_change_percentage_24h: 1.5485,
      market_cap: 699752757000,
      type: "stock",
    },
    {
      id: "UNH",
      name: "UnitedHealth Group Incorporated",
      symbol: "UNH",
      current_price: 590.87,
      price_change_percentage_24h: -1.108,
      market_cap: 543768207080,
      type: "stock",
    },
    {
      id: "2222.SR",
      name: "Saudi Arabian Oil Company",
      symbol: "2222.SR",
      current_price: 7.45147,
      price_change_percentage_24h: -0.1786,
      market_cap: 1802873479589,
      type: "stock",
    },
  ],
  commodities: [
    {
      id: "gold",
      name: "Gold",
      symbol: "XAU/USD",
      current_price: 2670.8645535142,
      market_cap: 19313475633435.277,
      price_change_percentage_24h: 0.6989118363605942,
      type: "commodity",
    },
    {
      id: "silver",
      name: "Silver",
      symbol: "XAG/USD",
      current_price: 30.7691705563,
      market_cap: 1888511996633.0916,
      price_change_percentage_24h: -0.4606775601648274,
      type: "commodity",
    },
  ],
  crypto: [],
};

interface StockResponse {
  symbol: string;
  name: string;
  price: number;
  changesPercentage: number;
  marketCap: number;
}

interface MetalPriceResponse {
  success?: boolean;
  rates: {
    USDXAU?: number;
    USDXAG?: number;
  };
}

interface CoinGeckoResponse {
  id: string;
  name: string;
  symbol: string;
  current_price: number;
  price_change_percentage_24h: number;
  market_cap: number;
}

async function fetchStockData(): Promise<MarketData[]> {
  try {
    const response = await axios.get<StockResponse[]>(
      `${API_ENDPOINTS.FMP}/quote/${POPULAR_STOCKS.join(",")}`,
      { params: { apikey: API_KEYS.FMP } }
    );

    console.log("fetchStockData response", JSON.stringify(response.data));
    return response.data.map((stock) => {
      // Convert price to USD if the stock is from Saudi exchange
      const price = stock.symbol.endsWith(".SR")
        ? stock.price * SAR_TO_USD
        : stock.price;
      const marketCap = stock.symbol.endsWith(".SR")
        ? stock.marketCap * SAR_TO_USD
        : stock.marketCap;

      return {
        id: stock.symbol,
        name: stock.name,
        symbol: stock.symbol,
        current_price: price,
        price_change_percentage_24h: stock.changesPercentage,
        market_cap: marketCap,
        type: "stock",
      };
    });
  } catch (error) {
    console.error("Error fetching stock data:", error);
    return FALLBACK_DATA.stocks;
  }
}

async function fetchCommodityData(): Promise<MarketData[]> {
  try {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 2);

    const formatDate = (date: Date): string => date.toISOString().split("T")[0];

    const calculateMarketCap = (
      pricePerOunce: number,
      supplyTons: number
    ): number => {
      return pricePerOunce * supplyTons * METRIC_TON_TO_OUNCES;
    };

    const calculatePriceChange = (
      currentPrice: number,
      previousPrice: number
    ): number => {
      return ((currentPrice - previousPrice) / previousPrice) * 100;
    };

    const [goldPrice, silverPrice, yesterdayGold, yesterdaySilver] =
      await Promise.all([
        axios.get<MetalPriceResponse>(`${API_ENDPOINTS.METAL_PRICE}/latest`, {
          params: { api_key: API_KEYS.METAL_PRICE, currencies: "XAU" },
        }),
        axios.get<MetalPriceResponse>(`${API_ENDPOINTS.METAL_PRICE}/latest`, {
          params: { api_key: API_KEYS.METAL_PRICE, currencies: "XAG" },
        }),
        axios.get<MetalPriceResponse>(
          `${API_ENDPOINTS.METAL_PRICE}/${formatDate(yesterday)}`,
          {
            params: { api_key: API_KEYS.METAL_PRICE, currencies: "XAU" },
          }
        ),
        axios.get<MetalPriceResponse>(
          `${API_ENDPOINTS.METAL_PRICE}/${formatDate(yesterday)}`,
          {
            params: { api_key: API_KEYS.METAL_PRICE, currencies: "XAG" },
          }
        ),
      ]);

    console.log("goldPrice", goldPrice.data);
    console.log("silverPrice", silverPrice.data);

    const goldData: MarketData = goldPrice.data?.success
      ? {
          id: "gold",
          name: "Gold",
          symbol: "XAU/USD",
          current_price: goldPrice.data.rates?.USDXAU || 0,
          market_cap: calculateMarketCap(
            goldPrice.data.rates?.USDXAU || 0,
            GOLD_SUPPLY_TONS
          ),
          price_change_percentage_24h: calculatePriceChange(
            goldPrice.data.rates?.USDXAU || 0,
            yesterdayGold.data.rates?.USDXAU || 0
          ),
          type: "commodity",
        }
      : FALLBACK_DATA.commodities[0];
    const silverData: MarketData = silverPrice.data?.success
      ? {
          id: "silver",
          name: "Silver",
          symbol: "XAG/USD",
          current_price: silverPrice.data.rates?.USDXAG || 0,
          market_cap: calculateMarketCap(
            silverPrice.data.rates?.USDXAG || 0,
            SILVER_SUPPLY_TONS
          ),
          price_change_percentage_24h: calculatePriceChange(
            silverPrice.data.rates?.USDXAG || 0,
            yesterdaySilver.data.rates?.USDXAG || 0
          ),
          type: "commodity",
        }
      : FALLBACK_DATA.commodities[1];

    return [goldData, silverData];
  } catch (error) {
    console.error("Error fetching commodity data:", error);
    return FALLBACK_DATA.commodities;
  }
}

async function fetchCryptoData(): Promise<MarketData[]> {
  try {
    const response = await axios.get<CoinGeckoResponse[]>(
      `${API_ENDPOINTS.COINGECKO}/coins/markets`,
      {
        params: {
          vs_currency: "usd",
          order: "market_cap_desc",
          per_page: 5,
          page: 1,
          sparkline: false,
        },
      }
    );

    return response.data.map((coin) => ({
      id: coin.id,
      name: coin.name,
      symbol: coin.symbol.toUpperCase(),
      current_price: coin.current_price,
      price_change_percentage_24h: coin.price_change_percentage_24h,
      market_cap: coin.market_cap,
      type: "crypto",
    }));
  } catch (error) {
    console.error("Error fetching crypto data:", error);
    return [];
  }
}

export async function GET() {
  try {
    let stocks: MarketData[] = [];
    let commodities: MarketData[] = [];
    let crypto: MarketData[] = [];

    if (!disableCache) {
      // Try to get data from Redis cache
      const [cachedStocks, cachedCommodities, cachedCrypto] = await Promise.all(
        [
          redis.get<MarketData[]>(STOCKS_CACHE_KEY),
          redis.get<MarketData[]>(COMMODITIES_CACHE_KEY),
          redis.get<MarketData[]>(CRYPTO_CACHE_KEY),
        ]
      );

      const now = Date.now();
      const stocksNeedUpdate =
        !cachedStocks ||
        now -
          ((await redis.get<number>(`${STOCKS_CACHE_KEY}:timestamp`)) || 0) >
          STOCK_CACHE_DURATION;
      const commoditiesNeedUpdate =
        !cachedCommodities ||
        now -
          ((await redis.get<number>(`${COMMODITIES_CACHE_KEY}:timestamp`)) ||
            0) >
          COMMODITY_CACHE_DURATION;
      const cryptoNeedUpdate =
        !cachedCrypto ||
        now -
          ((await redis.get<number>(`${CRYPTO_CACHE_KEY}:timestamp`)) || 0) >
          CRYPTO_CACHE_DURATION;

      if (stocksNeedUpdate) {
        console.log("stocksNeedUpdate");
        stocks = await fetchStockData();
        await Promise.all([
          redis.set(STOCKS_CACHE_KEY, stocks),
          redis.set(`${STOCKS_CACHE_KEY}:timestamp`, now),
        ]);
      } else {
        console.log("using cached stocks");
        stocks = cachedStocks || [];
      }

      if (commoditiesNeedUpdate) {
        console.log("commoditiesNeedUpdate");
        commodities = await fetchCommodityData();
        await Promise.all([
          redis.set(COMMODITIES_CACHE_KEY, commodities),
          redis.set(`${COMMODITIES_CACHE_KEY}:timestamp`, now),
        ]);
      } else {
        console.log("using cached commodities");
        commodities = cachedCommodities || [];
      }

      if (cryptoNeedUpdate) {
        console.log("cryptoNeedUpdate");
        crypto = await fetchCryptoData();
        await Promise.all([
          redis.set(CRYPTO_CACHE_KEY, crypto),
          redis.set(`${CRYPTO_CACHE_KEY}:timestamp`, now),
        ]);
      } else {
        console.log("using cached crypto");
        crypto = cachedCrypto || [];
      }
    } else {
      [stocks, commodities, crypto] = await Promise.all([
        fetchStockData(),
        fetchCommodityData(),
        fetchCryptoData(),
      ]);
    }

    return NextResponse.json({
      stocks,
      commodities,
      crypto,
    });
  } catch (error) {
    console.error("Error fetching market data:", error);
    return NextResponse.json({
      ...FALLBACK_DATA,
      crypto: [],
    });
  }
}
