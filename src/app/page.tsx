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
              <div className="flex flex-col items-center gap-4 mb-6">
                <div className="flex items-center justify-between w-full">
                  <h2 className="text-lg font-semibold text-yellow-500">Price Chart</h2>
                  {isLoading && (
                    <span className="text-sm text-gray-400 animate-pulse">
                      Updating...
                    </span>
                  )}
                </div>
                <TimeframeSelector
                  selectedTimeframe={selectedTimeframe}
                  onTimeframeChange={setSelectedTimeframe}
                />
              </div>
              <BitcoinChart
                priceData={priceData}
                selectedTimeframe={selectedTimeframe}
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
