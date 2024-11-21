export type TimeframeOption = {
  label: string;
  days: number;
  interval?: string;
};

export type PriceData = {
  labels: string[];
  prices: number[];
};

export type Asset = {
  id: string;
  name: string;
  symbol: string;
  current_price: number;
  price_change_percentage_24h: number;
  market_cap: number;
  type: 'crypto' | 'stock' | 'commodity';
};

export const timeframeOptions: TimeframeOption[] = [
  { label: '24h', days: 1 },
  { label: '7d', days: 7 },
  { label: '30d', days: 30 },
  { label: '180d', days: 180 },
  { label: '1y', days: 365 },
];
