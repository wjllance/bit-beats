import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { Asset } from "../types";

const REFRESH_INTERVAL = 5 * 60 * 1000; // 5 minutes in milliseconds

interface MarketResponse {
  stocks: Asset[];
  commodities: Asset[];
  crypto: Asset[];
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

      // Fetch all market data from our API
      const marketResponse = await axios.get<MarketResponse>("/api/market-data");
      const { stocks, commodities, crypto } = marketResponse.data;

      const allAssets = [...crypto, ...stocks, ...commodities]
        .sort((a, b) => b.market_cap - a.market_cap)
        .slice(0, 10);

      setAssets(allAssets);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to fetch market data");
      console.error("Error fetching data:", err);
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
