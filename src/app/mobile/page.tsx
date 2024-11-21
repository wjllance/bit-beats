'use client';

import { useState } from 'react';
import MobileBitcoinChart from '../../components/mobile/MobileBitcoinChart';
import MobileTopAssets from '../../components/mobile/MobileTopAssets';
import TimeframeSelector from '../../components/TimeframeSelector';
import { usePriceHistory } from '../../hooks/usePriceHistory';

const timeframeOptions = [
  { label: '24H', days: 1, interval: 'hourly' },
  { label: '7D', days: 7, interval: 'daily' },
  { label: '30D', days: 30, interval: 'daily' },
  { label: '90D', days: 90, interval: 'daily' },
];

export default function MobilePage() {
  const [selectedTimeframe, setSelectedTimeframe] = useState(timeframeOptions[0]);
  const { priceData, isLoading } = usePriceHistory(selectedTimeframe);

  const currentPrice = priceData.prices[priceData.prices.length - 1];
  const previousPrice = priceData.prices[priceData.prices.length - 2];
  const priceChange = currentPrice && previousPrice 
    ? ((currentPrice - previousPrice) / previousPrice) * 100
    : 0;

  return (
    <main className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-gray-900/95 backdrop-blur-sm border-b border-gray-800">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <h1 className="text-lg font-semibold text-yellow-500">Bitcoin</h1>
            <span className="text-sm text-gray-400">BTC/USD</span>
          </div>
          
          {/* Current Price */}
          <div className="mt-2 flex items-baseline space-x-2">
            <span className="text-2xl font-bold">
              ${currentPrice?.toLocaleString('en-US', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              }) || '-.--'}
            </span>
            {!isLoading && currentPrice && (
              <span className={`text-sm font-medium ${
                priceChange >= 0 ? 'text-green-400' : 'text-red-400'
              }`}>
                {priceChange >= 0 ? '↑' : '↓'}
                {Math.abs(priceChange).toFixed(2)}%
              </span>
            )}
          </div>
        </div>

        {/* Timeframe Selector */}
        <div className="px-4 pb-3">
          <TimeframeSelector
            options={timeframeOptions}
            selected={selectedTimeframe}
            onChange={setSelectedTimeframe}
            className="grid grid-cols-4 gap-2 text-sm"
            buttonClassName="py-1.5 font-medium"
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="space-y-6">
        {/* Chart Section */}
        <div className="mt-4">
          <MobileBitcoinChart selectedTimeframe={selectedTimeframe} />
        </div>
        
        {/* Divider */}
        <div className="px-4">
          <div className="h-px bg-gradient-to-r from-transparent via-gray-800 to-transparent" />
        </div>
        
        {/* Top Assets */}
        <div className="pb-safe-area-inset-bottom">
          <MobileTopAssets />
        </div>
      </div>
    </main>
  );
}
