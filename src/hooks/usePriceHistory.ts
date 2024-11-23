import { useEffect } from "react";
import { TimeframeOption } from "../types";
import { usePriceHistoryContext } from "@/context/PriceHistoryContext";

export function usePriceHistory(timeframe: TimeframeOption) {
  const { priceData, isLoading, error, setTimeframe } =
    usePriceHistoryContext();

  useEffect(() => {
    if (timeframe.days !== undefined) {
      setTimeframe(timeframe);
    }
  }, [timeframe, setTimeframe]);

  return { priceData, isLoading, error };
}
