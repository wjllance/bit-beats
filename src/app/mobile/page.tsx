"use client";

import { useState } from "react";
import MobileBitcoinChart from "../../components/mobile/MobileBitcoinChart";
import MobileTopAssets from "../../components/mobile/MobileTopAssets";
import MobileTimeframeSelector from "../../components/mobile/MobileTimeframeSelector";
import MobileHeader from "../../components/mobile/MobileHeader";
import PriceStatusBadge from "../../components/mobile/PriceStatusBadge";
import PriceDisplay from "../../components/mobile/PriceDisplay";
import { usePriceHistory } from "../../hooks/usePriceHistory";

export default function MobilePage() {
  const [selectedTimeframe, setSelectedTimeframe] = useState({
    label: "24h",
    days: 1,
  });
  const { priceData, isLoading, error } = usePriceHistory(selectedTimeframe);

  // Calculate 24h price change
  const currentPrice = priceData.prices[priceData.prices.length - 1];
  const priceChange =
    !isLoading && priceData.prices.length > 0
      ? (() => {
          // For 24h timeframe, compare first and last price
          const startPrice = priceData.prices[0];
          return ((currentPrice - startPrice) / startPrice) * 100;
        })()
      : null;

  return (
    <main className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-gray-900/95 backdrop-blur-sm border-b border-gray-800">
        <div className="px-3 py-2">
          {/* Title and Price Row */}
          <div className="flex items-center justify-between mb-1.5">
            <MobileHeader />
            <PriceStatusBadge isLoading={isLoading} />
          </div>

          <PriceDisplay
            priceData={priceData}
            error={error}
            isLoading={isLoading}
            currentPrice={currentPrice}
            priceChange={priceChange}
          />
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
