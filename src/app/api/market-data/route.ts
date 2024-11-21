import { NextResponse } from 'next/server';
import axios from 'axios';
import { MarketData, CachedMarketData } from '@/types';

// Cache configuration
const CACHE_DURATION = 60 * 60 * 1000; // 1 hour in milliseconds
let cachedData: CachedMarketData | null = null;
let lastFetchTime: number = 0;

// Constants
const POPULAR_STOCKS = ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'NVDA', 'TSLA', 'TSM', 'META', 'BRK.B', 'JPM', 'UNH', '2222.SR'];

// Constants for commodity calculations
const GOLD_SUPPLY_TONS = 205000; // Total above-ground gold in metric tons
const SILVER_SUPPLY_TONS = 1740000; // Total above-ground silver in metric tons
const METRIC_TON_TO_OUNCES = 35274; // 1 metric ton = 35,274 ounces

const API_KEYS = {
  FMP: process.env.NEXT_PUBLIC_FMP_API_KEY || 'demo',
  METAL_PRICE: process.env.NEXT_PUBLIC_METAL_PRICE_API_KEY || 'demo',
};

const API_ENDPOINTS = {
  FMP: 'https://financialmodelingprep.com/api/v3',
  METAL_PRICE: 'https://api.metalpriceapi.com/v1',
};

interface FMPResponse {
  symbol: string;
  name: string;
  price: number;
  changesPercentage: number;
  marketCap: number;
}

interface MetalPriceResponse {
  rates: {
    USDXAU?: number;
    USDXAG?: number;
  };
}

export async function GET() {
  const currentTime = Date.now();

  // Return cached data if it's still valid
  if (cachedData && currentTime - lastFetchTime < CACHE_DURATION) {
    return NextResponse.json(cachedData);
  }

  try {
    // Fetch stock data
    const stockResponse = await axios.get<FMPResponse[]>(`${API_ENDPOINTS.FMP}/quote/${POPULAR_STOCKS.join(',')}`, {
      params: { apikey: API_KEYS.FMP }
    });

    const stocks: MarketData[] = stockResponse.data.map((stock) => ({
      id: stock.symbol,
      name: stock.name,
      symbol: stock.symbol,
      current_price: stock.price,
      price_change_percentage_24h: stock.changesPercentage,
      market_cap: stock.marketCap,
      type: 'stock',
    }));

    // Get yesterday's date for price change
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 2);

    const formatDate = (date: Date) => {
      return date.toISOString().split('T')[0];
    };

    const calculateMarketCap = (pricePerOunce: number, supplyTons: number) => {
      return pricePerOunce * supplyTons * METRIC_TON_TO_OUNCES;
    };

    const calculatePriceChange = (currentPrice: number, previousPrice: number) => {
      return ((currentPrice - previousPrice) / previousPrice) * 100;
    };

    // Fetch commodity data
    const [goldPrice, silverPrice, yesterdayGold, yesterdaySilver] = await Promise.all([
      axios.get<MetalPriceResponse>(`${API_ENDPOINTS.METAL_PRICE}/latest`, {
        params: {
          api_key: API_KEYS.METAL_PRICE,
          currencies: 'XAU'
        }
      }),
      axios.get<MetalPriceResponse>(`${API_ENDPOINTS.METAL_PRICE}/latest`, {
        params: {
          api_key: API_KEYS.METAL_PRICE,
          currencies: 'XAG'
        }
      }),
      axios.get<MetalPriceResponse>(`${API_ENDPOINTS.METAL_PRICE}/${formatDate(yesterday)}`, {
        params: {
          api_key: API_KEYS.METAL_PRICE,
          currencies: 'XAU',
        }
      }),
      axios.get<MetalPriceResponse>(`${API_ENDPOINTS.METAL_PRICE}/${formatDate(yesterday)}`, {
        params: {
          api_key: API_KEYS.METAL_PRICE,
          currencies: 'XAG',
        }
      })
    ]);

    const commodities: MarketData[] = [
      {
        id: 'gold',
        name: 'Gold',
        symbol: 'XAU/USD',
        current_price: goldPrice.data.rates.USDXAU || 0,
        market_cap: calculateMarketCap(goldPrice.data.rates.USDXAU || 0, GOLD_SUPPLY_TONS),
        price_change_percentage_24h: calculatePriceChange(
          goldPrice.data.rates.USDXAU || 0,
          yesterdayGold.data.rates.USDXAU || 0
        ),
        type: 'commodity',
      },
      {
        id: 'silver',
        name: 'Silver',
        symbol: 'XAG/USD',
        current_price: silverPrice.data.rates.USDXAG || 0,
        market_cap: calculateMarketCap(silverPrice.data.rates.USDXAG || 0, SILVER_SUPPLY_TONS),
        price_change_percentage_24h: calculatePriceChange(
          silverPrice.data.rates.USDXAG || 0,
          yesterdaySilver.data.rates.USDXAG || 0
        ),
        type: 'commodity',
      }
    ];

    // Update cache
    cachedData = {
      stocks,
      commodities,
      timestamp: currentTime,
    };
    lastFetchTime = currentTime;

    return NextResponse.json(cachedData);
  } catch (error) {
    console.error('Error fetching market data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch market data' },
      { status: 500 }
    );
  }
}
