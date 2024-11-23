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
  const [timeframe, setTimeframe] = useState<TimeframeOption>({
    label: "24H",
    days: 1,
  });

  useEffect(() => {
    const fetchPriceHistory = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await axios.get("/api/price-history", {
          params: {
            days: timeframe.days,
            // interval: timeframe.interval,
          },
        });

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

    fetchPriceHistory();
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
