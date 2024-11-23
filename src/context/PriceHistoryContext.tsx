"use client";
import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useRef,
} from "react";
import axios from "axios";
import { TimeframeOption, PriceData } from "../types";

interface PriceHistoryContextType {
  priceData: PriceData;
  isLoading: boolean;
  error: string | null;
  timeframe: TimeframeOption;
  setTimeframe: (timeframe: TimeframeOption) => void;
}

interface CacheEntry {
  data: PriceData;
  timestamp: number;
}

const CACHE_EXPIRATION = 30 * 1000; // 30 seconds in milliseconds
const AUTO_REFRESH_INTERVAL = 5 * 1000; // 30 seconds in milliseconds

const PriceHistoryContext = createContext<PriceHistoryContextType | undefined>(
  undefined
);

export function PriceHistoryProvider({ children }: { children: ReactNode }) {
  const [priceData, setPriceData] = useState<PriceData>({
    labels: [],
    prices: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeframe, setTimeframeState] = useState<TimeframeOption>({
    label: "24H",
    days: 1,
  });

  const setTimeframe = (newTimeframe: TimeframeOption) => {
    setError(null); // Reset error when timeframe changes
    setTimeframeState(newTimeframe);
  };

  const cacheRef = useRef<Record<number, CacheEntry>>({});

  const fetchPriceHistory = async () => {
    try {
      const cachedData = cacheRef.current[timeframe.days];
      const now = Date.now();

      // Check if we have valid cached data
      if (cachedData && now - cachedData.timestamp < CACHE_EXPIRATION) {
        setPriceData(cachedData.data);
        return;
      }

      setIsLoading(true);
      setError(null);

      const response = await axios.get("/api/price-history", {
        params: {
          days: timeframe.days,
        },
      });

      // Update cache
      cacheRef.current[timeframe.days] = {
        data: response.data,
        timestamp: now,
      };

      setPriceData(response.data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch price history"
      );
      console.error("Error fetching price history:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPriceHistory();

    // Set up auto-refresh interval
    const intervalId = setInterval(fetchPriceHistory, AUTO_REFRESH_INTERVAL);

    // Cleanup interval on unmount or when timeframe changes
    return () => clearInterval(intervalId);
  }, [timeframe.days]);

  return (
    <PriceHistoryContext.Provider
      value={{
        priceData,
        isLoading,
        error,
        timeframe,
        setTimeframe,
      }}
    >
      {children}
    </PriceHistoryContext.Provider>
  );
}

export function usePriceHistoryContext() {
  const context = useContext(PriceHistoryContext);
  if (context === undefined) {
    throw new Error(
      "usePriceHistoryContext must be used within a PriceHistoryProvider"
    );
  }
  return context;
}
