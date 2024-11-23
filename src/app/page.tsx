"use client";

import { useState } from "react";
import { TimeframeOption } from "@/types";
import BitcoinChart from "@/components/BitcoinChart";
import TimeframeSelector from "@/components/TimeframeSelector";
import PriceDisplay from "@/components/PriceDisplay";
import TopAssets from "@/components/TopAssets";
import { usePriceHistory } from "@/hooks/usePriceHistory";

export default function BitcoinPriceTracker() {
  const [selectedTimeframe, setSelectedTimeframe] = useState<TimeframeOption>({
    label: "24h",
    days: 1,
  });

  const { priceData, isLoading } = usePriceHistory(selectedTimeframe);
  const currentPrice = priceData.prices[priceData.prices.length - 1] || null;

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <PriceDisplay currentPrice={currentPrice} priceData={priceData} />

        <div className="grid grid-cols-12 gap-6">
          {/* Left side assets */}
          <div className="col-span-3">
            <div className="bg-gray-800/50 rounded-lg p-4 h-full">
              <TopAssets position="left" />
            </div>
          </div>

          {/* Center chart */}
          <div className="col-span-6">
            <div className="bg-gray-800/50 rounded-lg p-6">
              <div className="mb-4">
                <TimeframeSelector
                  selectedTimeframe={selectedTimeframe}
                  onTimeframeChange={setSelectedTimeframe}
                />
              </div>
              <BitcoinChart
                priceData={priceData}
                selectedTimeframe={selectedTimeframe}
                isLoading={isLoading}
              />
            </div>
          </div>

          {/* Right side assets */}
          <div className="col-span-3">
            <div className="bg-gray-800/50 rounded-lg p-4 h-full">
              <TopAssets position="right" />
            </div>
          </div>
        </div>

        <footer className="text-center mt-6 text-yellow-500/80 text-sm">
          <p>Data provided by CoinGecko API • Updated every 5 minutes</p>
        </footer>
      </div>
    </main>
  );
}
