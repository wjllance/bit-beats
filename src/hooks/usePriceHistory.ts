import { TimeframeOption } from '../types';
import { usePriceHistoryContext } from '@/context/PriceHistoryContext';

export function usePriceHistory(timeframe: TimeframeOption) {
  const { priceData, isLoading, error, setTimeframe } = usePriceHistoryContext();

  // Update the timeframe in the context when it changes
  if (timeframe.days !== undefined) {
    setTimeframe(timeframe);
  }

  return { priceData, isLoading, error };
}
