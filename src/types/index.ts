export type TimeframeOption = {
  label: string;
  days: number;
};

export type PriceData = {
  labels: string[];
  prices: number[];
};

export const timeframeOptions: TimeframeOption[] = [
  { label: '24h', days: 1 },
  { label: '7d', days: 7 },
  { label: '30d', days: 30 },
  { label: '180d', days: 180 },
  { label: '1y', days: 365 },
];
