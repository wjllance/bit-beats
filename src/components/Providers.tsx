'use client';

import { ReactNode, useEffect, useState } from 'react';
import { MarketDataProvider } from '@/context/MarketDataContext';
import { PriceHistoryProvider } from '@/context/PriceHistoryContext';

export function Providers({ children }: { children: ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <MarketDataProvider>
      <PriceHistoryProvider>
        {children}
      </PriceHistoryProvider>
    </MarketDataProvider>
  );
}
