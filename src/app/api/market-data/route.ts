import { NextResponse } from 'next/server';
import axios from 'axios';

// Cache configuration
const CACHE_DURATION = 60 * 60 * 1000; // 5 minutes in milliseconds
let cachedData: any = null;
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

async function fetchStockData() {
  try {
    const response = await axios.get(
      `${API_ENDPOINTS.FMP}/quote/${POPULAR_STOCKS.join(',')}`,
      { params: { apikey: API_KEYS.FMP } }
    );
    return response.data.map((stock: any) => ({
      id: stock.symbol,
      name: stock.name,
      symbol: stock.symbol,
      current_price: stock.price,
      price_change_percentage_24h: stock.changesPercentage,
      market_cap: stock.marketCap,
      type: 'stock' as const,
    }));
  } catch (error) {
    console.error('Error fetching stock data:', error);
    return [];
  }
}

async function fetchCommodityData() {
  try {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 2);

    const formatDate = (date: Date) => date.toISOString().split('T')[0];

    const calculateMarketCap = (pricePerOunce: number, supplyTons: number) => {
      return pricePerOunce * supplyTons * METRIC_TON_TO_OUNCES;
    };

    const calculatePriceChange = (currentPrice: number, previousPrice: number) => {
      return ((currentPrice - previousPrice) / previousPrice) * 100;
    };

    const [goldPrice, silverPrice, yesterdayGold, yesterdaySilver] = await Promise.all([
      axios.get(`${API_ENDPOINTS.METAL_PRICE}/latest`, {
        params: { api_key: API_KEYS.METAL_PRICE, currencies: 'XAU' }
      }),
      axios.get(`${API_ENDPOINTS.METAL_PRICE}/latest`, {
        params: { api_key: API_KEYS.METAL_PRICE, currencies: 'XAG' }
      }),
      axios.get(`${API_ENDPOINTS.METAL_PRICE}/${formatDate(yesterday)}`, {
        params: { api_key: API_KEYS.METAL_PRICE, currencies: 'XAU' }
      }),
      axios.get(`${API_ENDPOINTS.METAL_PRICE}/${formatDate(yesterday)}`, {
        params: { api_key: API_KEYS.METAL_PRICE, currencies: 'XAG' }
      })
    ]);

    return [
      {
        id: 'gold',
        name: 'Gold',
        symbol: 'XAU/USD',
        current_price: goldPrice.data.rates.USDXAU,
        market_cap: calculateMarketCap(goldPrice.data.rates.USDXAU, GOLD_SUPPLY_TONS),
        price_change_percentage_24h: calculatePriceChange(
          goldPrice.data.rates.USDXAU,
          yesterdayGold.data.rates.USDXAU
        ),
        type: 'commodity' as const,
      },
      {
        id: 'silver',
        name: 'Silver',
        symbol: 'XAG/USD',
        current_price: silverPrice.data.rates.USDXAG,
        market_cap: calculateMarketCap(silverPrice.data.rates.USDXAG, SILVER_SUPPLY_TONS),
        price_change_percentage_24h: calculatePriceChange(
          silverPrice.data.rates.USDXAG,
          yesterdaySilver.data.rates.USDXAG
        ),
        type: 'commodity' as const,
      }
    ];
  } catch (error) {
    console.error('Error fetching commodity data:', error);
    return [];
  }
}

export async function GET() {
  const currentTime = Date.now();
  
  // Return cached data if it's still valid
  if (cachedData && currentTime - lastFetchTime < CACHE_DURATION) {
    return NextResponse.json(cachedData);
  }

  try {
    // Fetch new data
    const [stocks, commodities] = await Promise.all([
      fetchStockData(),
      fetchCommodityData(),
    ]);

    // Update cache
    cachedData = { stocks, commodities };
    lastFetchTime = currentTime;

    return NextResponse.json(cachedData);
  } catch (error) {
    console.error('Error fetching market data:', error);
    // Return last cached data if available, otherwise return empty data
    return NextResponse.json(cachedData || { stocks: [], commodities: [] });
  }
}
