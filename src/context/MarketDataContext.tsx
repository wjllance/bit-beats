'use client';
import { createContext, useContext, ReactNode } from 'react';
import { useMarketData } from '@/hooks/useMarketData';
import { Asset } from '@/types';

interface MarketDataContextType {
  marketData: Asset[];
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

const MarketDataContext = createContext<MarketDataContextType | undefined>(undefined);

export function MarketDataProvider({ children }: { children: ReactNode }) {
  const { assets, isLoading, error, refetch } = useMarketData();

  return (
    <MarketDataContext.Provider
      value={{
        marketData: assets,
        isLoading,
        error,
        refetch,
      }}
    >
      {children}
    </MarketDataContext.Provider>
  );
}

export function useMarketDataContext() {
  const context = useContext(MarketDataContext);
  if (context === undefined) {
    throw new Error('useMarketDataContext must be used within a MarketDataProvider');
  }
  return context;
}
