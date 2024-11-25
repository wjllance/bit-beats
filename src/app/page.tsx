"use client";

import { useState } from "react";
import { TimeframeOption } from "@/types";
import BitcoinChart from "@/components/BitcoinChart";
import TimeframeSelector from "@/components/TimeframeSelector";
import PriceDisplay from "@/components/PriceDisplay";
import TopAssets from "@/components/TopAssets";
import { usePriceHistory } from "@/hooks/usePriceHistory";
import { getAppVersion } from "@/utils/version";
import { FaTwitter } from "react-icons/fa";
import { MdEmail } from "react-icons/md";

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
                  <h2 className="text-lg font-semibold text-yellow-500">
                    Price Chart
                  </h2>
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

        <footer className="text-center mt-8 text-yellow-500/80 text-sm border-t border-yellow-500/20 pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
            <div className="flex items-center justify-center md:justify-start space-x-2">
              <p>v{getAppVersion()}</p>
              <span className="text-yellow-500/40">•</span>
              <p> {new Date().getFullYear()}</p>
            </div>
            
            <div>
              <p>Data provided by CoinGecko API</p>
              <p className="text-yellow-500/60 text-xs">Updated every 5 minutes</p>
            </div>

            <div className="flex items-center justify-center md:justify-end gap-4">
              <a
                href="mailto:mengmajiang@gmail.com"
                className="flex items-center gap-1.5 hover:text-yellow-500 transition-colors duration-200 group"
                title="Email us"
              >
                <MdEmail className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
                <span className="hidden md:inline">mengmajiang@gmail.com</span>
                <span className="md:hidden">Email</span>
              </a>
              <span className="text-yellow-500/40">•</span>
              <a
                href="https://twitter.com/mengmajiang"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 hover:text-yellow-500 transition-colors duration-200 group"
                title="Follow us on Twitter"
              >
                <FaTwitter className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
                <span className="hidden md:inline">@mengmajiang</span>
                <span className="md:hidden">Twitter</span>
              </a>
            </div>
          </div>
        </footer>
      </div>
    </main>
  );
}
