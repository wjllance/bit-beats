import { NextResponse } from 'next/server';
import axios from 'axios';

interface MarketData {
  id: string;
  name: string;
  symbol: string;
  current_price: number;
  price_change_percentage_24h: number;
  market_cap: number;
  type: 'crypto' | 'stock' | 'commodity';
}

interface CachedData {
  stocks: MarketData[];
  commodities: MarketData[];
  timestamp?: number;
}

// Cache configuration
const CACHE_DURATION = 1 * 60 * 60 * 1000; // 1 hours in milliseconds
let cachedData: CachedData | null = null;
let lastFetchTime: number = 0;

// Constants
const POPULAR_STOCKS = ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'NVDA', 'TSLA', 'TSM', 'META', 'BRK.B', 'JPM', 'UNH', '2222.SR'];
const GOLD_SUPPLY_TONS = 205000;
const SILVER_SUPPLY_TONS = 1740000;
const METRIC_TON_TO_OUNCES = 35274;

// API Configuration
const API_KEYS = {
  FMP: process.env.NEXT_PUBLIC_FMP_API_KEY || 'demo',
  METAL_PRICE: process.env.NEXT_PUBLIC_METAL_PRICE_API_KEY || 'demo',
};

const API_ENDPOINTS = {
  FMP: 'https://financialmodelingprep.com/api/v3',
  METAL_PRICE: 'https://api.metalpriceapi.com/v1',
};

// Fallback data
const FALLBACK_DATA: CachedData = {
  stocks: [
    {
      id: 'AAPL',
      name: 'Apple Inc.',
      symbol: 'AAPL',
      current_price: 169.90,
      price_change_percentage_24h: 0.85,
      market_cap: 2650000000000,
      type: 'stock',
    },
    {
      id: 'MSFT',
      name: 'Microsoft Corporation',
      symbol: 'MSFT',
      current_price: 425.22,
      price_change_percentage_24h: 1.25,
      market_cap: 3160000000000,
      type: 'stock',
    },
  ],
  commodities: [
    {
      id: 'gold',
      name: 'Gold',
      symbol: 'XAU/USD',
      current_price: 2619.50,
      price_change_percentage_24h: 0.35,
      market_cap: 17500000000000,
      type: 'commodity',
    },
    {
      id: 'silver',
      name: 'Silver',
      symbol: 'XAG/USD',
      current_price: 30.88,
      price_change_percentage_24h: -0.42,
      market_cap: 1730000000000,
      type: 'commodity',
    },
  ],
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

async function fetchStockData(): Promise<MarketData[]> {
  try {
    const response = await axios.get<StockResponse[]>(
      `${API_ENDPOINTS.FMP}/quote/${POPULAR_STOCKS.join(',')}`,
      { params: { apikey: API_KEYS.FMP } }
    );

    console.log('fetchStockData response', response.data);
    return response.data.map((stock) => ({
      id: stock.symbol,
      name: stock.name,
      symbol: stock.symbol,
      current_price: stock.price,
      price_change_percentage_24h: stock.changesPercentage,
      market_cap: stock.marketCap,
      type: 'stock',
    }));
  } catch (error) {
    console.error('Error fetching stock data:', error);
    return FALLBACK_DATA.stocks;
  }
}

async function fetchCommodityData(): Promise<MarketData[]> {
  try {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 2);

    const formatDate = (date: Date): string => date.toISOString().split('T')[0];

    const calculateMarketCap = (pricePerOunce: number, supplyTons: number): number => {
      return pricePerOunce * supplyTons * METRIC_TON_TO_OUNCES;
    };

    const calculatePriceChange = (currentPrice: number, previousPrice: number): number => {
      return ((currentPrice - previousPrice) / previousPrice) * 100;
    };

    const [goldPrice, silverPrice, yesterdayGold, yesterdaySilver] = await Promise.all([
      axios.get<MetalPriceResponse>(`${API_ENDPOINTS.METAL_PRICE}/latest`, {
        params: { api_key: API_KEYS.METAL_PRICE, currencies: 'XAU' }
      }),
      axios.get<MetalPriceResponse>(`${API_ENDPOINTS.METAL_PRICE}/latest`, {
        params: { api_key: API_KEYS.METAL_PRICE, currencies: 'XAG' }
      }),
      axios.get<MetalPriceResponse>(`${API_ENDPOINTS.METAL_PRICE}/${formatDate(yesterday)}`, {
        params: { api_key: API_KEYS.METAL_PRICE, currencies: 'XAU' }
      }),
      axios.get<MetalPriceResponse>(`${API_ENDPOINTS.METAL_PRICE}/${formatDate(yesterday)}`, {
        params: { api_key: API_KEYS.METAL_PRICE, currencies: 'XAG' }
      })
    ]);

    console.log('goldPrice', goldPrice.data);
    console.log('silverPrice', silverPrice.data);

    const goldData: MarketData = goldPrice.data?.success ?{
      id: 'gold',
      name: 'Gold',
      symbol: 'XAU/USD',
      current_price: goldPrice.data.rates?.USDXAU || 0,
      market_cap: calculateMarketCap(goldPrice.data.rates?.USDXAU || 0, GOLD_SUPPLY_TONS),
      price_change_percentage_24h: calculatePriceChange(
        goldPrice.data.rates?.USDXAU || 0,
        yesterdayGold.data.rates?.USDXAU || 0
      ),
      type: 'commodity',
    }: FALLBACK_DATA.commodities[0];
    const silverData: MarketData = silverPrice.data?.success ?{
      id: 'silver',
      name: 'Silver',
      symbol: 'XAG/USD',
      current_price: silverPrice.data.rates?.USDXAG || 0,
      market_cap: calculateMarketCap(silverPrice.data.rates?.USDXAG || 0, SILVER_SUPPLY_TONS),
      price_change_percentage_24h: calculatePriceChange(
        silverPrice.data.rates?.USDXAG || 0,
        yesterdaySilver.data.rates?.USDXAG || 0
      ),
      type: 'commodity',
    }: FALLBACK_DATA.commodities[1]; 

    return [
      goldData,
      silverData
    ];
  } catch (error) {
    console.error('Error fetching commodity data:', error);
    return FALLBACK_DATA.commodities;
  }
}

export async function GET() {
  const currentTime = Date.now();
  
  // Return cached data if it's still valid
  if (cachedData && currentTime - lastFetchTime < CACHE_DURATION) {
    console.log('Returning cached data');
    return NextResponse.json(cachedData);
  }

  try {
    // Fetch new data
    const [stocks, commodities] = await Promise.all([
      fetchStockData(),
      fetchCommodityData(),
    ]);

    // Update cache
    cachedData = { stocks, commodities, timestamp: currentTime };
    lastFetchTime = currentTime;

    return NextResponse.json(cachedData);
  } catch (error) {
    console.error('Error fetching market data:', error);
    // Return last cached data if available, otherwise return fallback data
    return NextResponse.json(cachedData || FALLBACK_DATA);
  }
}
