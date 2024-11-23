'use client';

import { useState, useEffect } from 'react';
import clsx from 'clsx';
import MobileBitcoinChart from '../../components/mobile/MobileBitcoinChart';
import MobileTopAssets from '../../components/mobile/MobileTopAssets';
import MobileTimeframeSelector from '../../components/mobile/MobileTimeframeSelector';
import { usePriceHistory } from '../../hooks/usePriceHistory';

const SLOGANS = [
  "Watch Bitcoin Rise to the Top",
  "Ride the Digital Gold Wave",
  "The Future of Finance is Here",
  "Decentralized. Secure. Revolutionary.",
  "Beyond Traditional Boundaries",
  "Financial Freedom Awaits",
  "Join the Crypto Revolution",
  "Where Innovation Meets Value",
  "Empowering Digital Wealth",
  "The Beat of Digital Currency"
];

const formatPrice = (price: number | undefined): string => {
  if (typeof price !== 'number') return '-.--';
  return price.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

export default function MobilePage() {
  const [selectedTimeframe, setSelectedTimeframe] = useState({ label: '24h', days: 1 });
  const { priceData, isLoading, error } = usePriceHistory(selectedTimeframe);
  const [currentSlogan, setCurrentSlogan] = useState(Math.floor(Math.random() * SLOGANS.length));
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Calculate 24h price change
  const currentPrice = priceData.prices[priceData.prices.length - 1];
  const priceChange = (!isLoading && priceData.prices.length > 0) ? (() => {
    // For 24h timeframe, compare first and last price
    const startPrice = priceData.prices[0];
    return ((currentPrice - startPrice) / startPrice) * 100;
  })() : null;

  useEffect(() => {
    const interval = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentSlogan((prev) => (prev + 1) % SLOGANS.length);
        setIsTransitioning(false);
      }, 500);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <main className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-gray-900/95 backdrop-blur-sm border-b border-gray-800">
        <div className="px-3 py-2">
          {/* Title and Price Row */}
          <div className="flex items-start justify-between mb-1.5">
            {/* Left: Logo and Title */}
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-lg flex items-center justify-center shadow-lg shadow-yellow-500/20">
                <span className="text-gray-900 text-lg font-bold">₿</span>
              </div>
              <div className="flex flex-col">
                <h1 className="text-xl font-bold bg-gradient-to-r from-yellow-500 via-yellow-300 to-yellow-500 text-transparent bg-clip-text tracking-tight leading-none">
                  Bit Beats
                </h1>
                <p className={clsx(
                  "text-[10px] text-gray-400 transition-opacity duration-500",
                  isTransitioning ? "opacity-0" : "opacity-100"
                )}>
                  {SLOGANS[currentSlogan]}
                </p>
              </div>
            </div>
            {/* Right: Price and Status */}
            <div className="flex flex-col items-end">
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-medium text-gray-400 bg-gray-800/50 px-1.5 py-0.5 rounded-full">
                  BTC/USD
                </span>
                <div className="flex items-center gap-1">
                  <div className={clsx(
                    "w-1.5 h-1.5 rounded-full",
                    isLoading ? "bg-yellow-500 animate-pulse" : "bg-green-500"
                  )} />
                  <span className="text-[10px] text-gray-400">
                    {isLoading ? "Updating" : "Live"}
                  </span>
                </div>
              </div>
              <span className="text-[10px] text-gray-500 mt-0.5">
                {new Date().toLocaleDateString()}
              </span>
            </div>
          </div>

          {/* Price Display */}
          <div className="bg-gray-800/30 rounded-lg p-2.5">
            {error ? (
              <span className="text-sm text-red-400">{error}</span>
            ) : (
              <div className="space-y-1">
                <div className="flex items-baseline justify-between">
                  <div className="flex items-baseline gap-2">
                    <span className="text-xl font-bold text-white">
                      ${formatPrice(currentPrice)}
                    </span>
                    {priceChange !== null && (
                      <div className="flex items-center gap-1.5">
                        <span className={clsx(
                          "text-sm font-medium",
                          priceChange >= 0 ? "text-green-500" : "text-red-500"
                        )}>
                          {priceChange >= 0 ? "+" : ""}{priceChange.toFixed(2)}%
                        </span>
                        <span className={clsx(
                          "text-[10px] px-1.5 py-0.5 rounded-full font-medium",
                          priceChange >= 0 ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"
                        )}>
                          {priceChange >= 0 ? "Bullish ↑" : "Bearish ↓"}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex justify-end">
                  <span className="text-[10px] text-gray-500">
                    Updated: {new Date().toLocaleTimeString()}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="space-y-4">
        {/* Chart Section */}
        <div className="relative">
          <div className="h-[130px] w-full">
            <MobileBitcoinChart selectedTimeframe={selectedTimeframe} />
          </div>
          <MobileTimeframeSelector
              selectedTimeframe={selectedTimeframe}
              onTimeframeChange={setSelectedTimeframe}
            />
        </div>
        
        {/* Top Assets */}
        <div className="pb-safe-area-inset-bottom">
          <MobileTopAssets />
        </div>
      </div>
    </main>
  );
}
