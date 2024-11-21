export interface MarketData {
  id: string;
  name: string;
  symbol: string;
  current_price: number;
  price_change_percentage_24h: number;
  market_cap: number;
  type: 'crypto' | 'stock' | 'commodity';
}

export interface CoinGeckoResponse {
  id: string;
  name: string;
  symbol: string;
  current_price: number;
  price_change_percentage_24h: number;
  market_cap: number;
}

export interface TimeframeOption {
  label: string;
  days: number;
}

export interface PriceData {
  labels: string[];
  prices: number[];
}

export interface SortConfig {
  key: string;
  direction: 'asc' | 'desc';
}

export interface CachedMarketData {
  stocks: MarketData[];
  commodities: MarketData[];
  timestamp: number;
}

export const timeframeOptions: TimeframeOption[] = [
  { label: '24h', days: 1 },
  { label: '7d', days: 7 },
  { label: '30d', days: 30 },
  { label: '180d', days: 180 },
  { label: '1y', days: 365 },
];
