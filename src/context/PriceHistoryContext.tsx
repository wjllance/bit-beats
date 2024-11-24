"use client";
import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useRef,
  useCallback,
} from "react";
import axios from "axios";
import { TimeframeOption, PriceData } from "../types";
import { RawPriceData } from "@/app/api/price-history/route";

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

const CACHE_EXPIRATION = 5 * 60 * 1000; // 5 mins in milliseconds
const AUTO_REFRESH_INTERVAL = 5 * 60 * 1000; // 5 mins in milliseconds

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

  const fetchPriceHistory = useCallback(async () => {
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

      const respData: PriceData = {
        labels: (response.data as RawPriceData).labels.map((label) =>
          new Date(label).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            hour: timeframe.days <= 7 ? "numeric" : undefined,
            minute: timeframe.days <= 7 ? "numeric" : undefined,
          })
        ),
        prices: response.data.prices,
      };

      // Update cache
      cacheRef.current[timeframe.days] = {
        data: respData,
        timestamp: now,
      };

      setPriceData(respData);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch price history"
      );
      console.error("Error fetching price history:", err);
    } finally {
      setIsLoading(false);
    }
  }, [timeframe.days]);

  useEffect(() => {
    fetchPriceHistory();

    // Set up auto-refresh interval
    const intervalId = setInterval(fetchPriceHistory, AUTO_REFRESH_INTERVAL);

    // Cleanup interval on unmount or when timeframe changes
    return () => clearInterval(intervalId);
  }, [fetchPriceHistory]);

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
