import { useState, useEffect } from 'react';
import axios from 'axios';
import { TimeframeOption, PriceData } from '../types';

const API_ENDPOINTS = {
  COINGECKO: 'https://api.coingecko.com/api/v3',
};

export function usePriceHistory(timeframe: TimeframeOption) {
  const [priceData, setPriceData] = useState<PriceData>({ labels: [], prices: [] });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPriceHistory = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await axios.get(
          `${API_ENDPOINTS.COINGECKO}/coins/bitcoin/market_chart`,
          {
            params: {
              vs_currency: 'usd',
              days: timeframe.days,
              interval: timeframe.interval,
            },
          }
        );

        const { prices } = response.data;
        const formattedData: PriceData = {
          labels: prices.map(([timestamp]: [number, number]) =>
            new Date(timestamp).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              hour: timeframe.days <= 1 ? 'numeric' : undefined,
              minute: timeframe.days <= 1 ? 'numeric' : undefined,
            })
          ),
          prices: prices.map(([, price]: [number, number]) => price),
        };

        setPriceData(formattedData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch price history');
        console.error('Error fetching price history:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPriceHistory();
  }, [timeframe]);

  return { priceData, isLoading, error };
}
