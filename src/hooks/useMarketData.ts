import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Asset } from '../types';
import { API_ENDPOINTS } from '../utils/api-config';

const REFRESH_INTERVAL = 5 * 60 * 1000; // 5 minutes in milliseconds

interface CoinGeckoAsset {
  id: string;
  name: string;
  symbol: string;
  current_price: number;
  price_change_percentage_24h: number;
  market_cap: number;
}

interface MarketResponse {
  stocks: Asset[];
  commodities: Asset[];
}

interface UseMarketDataReturn {
  assets: Asset[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useMarketData(): UseMarketDataReturn {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAllData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Fetch crypto data
      const cryptoResponse = await axios.get<CoinGeckoAsset[]>(
        `${API_ENDPOINTS.COINGECKO}/coins/markets`,
        {
          params: {
            vs_currency: 'usd',
            order: 'market_cap_desc',
            per_page: 5,
            page: 1,
            sparkline: false,
          },
        }
      );

      const cryptoAssets: Asset[] = cryptoResponse.data.map((coin: CoinGeckoAsset) => ({
        id: coin.id,
        name: coin.name,
        symbol: coin.symbol.toUpperCase(),
        current_price: coin.current_price,
        price_change_percentage_24h: coin.price_change_percentage_24h,
        market_cap: coin.market_cap,
        type: 'crypto',
      }));

      // Fetch stocks and commodities from our cached API
      const marketResponse = await axios.get<MarketResponse>('/api/market-data');
      const { stocks, commodities } = marketResponse.data;

      const allAssets = [...cryptoAssets, ...stocks, ...commodities]
        .sort((a, b) => b.market_cap - a.market_cap)
        .slice(0, 10);

      setAssets(allAssets);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to fetch market data');
      console.error('Error fetching data:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAllData();
    const interval = setInterval(fetchAllData, REFRESH_INTERVAL);

    return () => clearInterval(interval);
  }, [fetchAllData]);

  return { assets, isLoading, error, refetch: fetchAllData };
}
