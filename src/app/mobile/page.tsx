"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import MobileBitcoinChart from "@/components/mobile/MobileBitcoinChart";
import MobileTopAssets from "@/components/mobile/MobileTopAssets";
import MobileTimeframeSelector from "@/components/mobile/MobileTimeframeSelector";
import MobileHeader from "@/components/mobile/MobileHeader";
import PriceStatusBadge from "@/components/mobile/PriceStatusBadge";
import PriceDisplay from "@/components/mobile/PriceDisplay";
import { usePriceHistory } from "@/hooks/usePriceHistory";

const INITIAL_CHART_HEIGHT = 150;
const MIN_CHART_HEIGHT = 80;
const SCROLL_RANGE = 100;

export default function MobilePage() {
  const [selectedTimeframe, setSelectedTimeframe] = useState({
    label: "24h",
    days: 1,
  });
  const { priceData, isLoading, error } = usePriceHistory(selectedTimeframe);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const [chartHeight, setChartHeight] = useState(INITIAL_CHART_HEIGHT);

  useEffect(() => {
    const container = scrollContainerRef.current;
    const chartContainer = chartContainerRef.current;
    if (!container || !chartContainer) return;

    let ticking = false;
    let lastScrollY = 0;

    const updateChartHeight = () => {
      const scrollTop = container.scrollTop;
      const progress = Math.min(Math.max(scrollTop / SCROLL_RANGE, 0), 1);
      const heightDiff = INITIAL_CHART_HEIGHT - MIN_CHART_HEIGHT;
      const newHeight = INITIAL_CHART_HEIGHT - (progress * heightDiff);
      
      // Update both height and transform
      setChartHeight(Math.max(newHeight, MIN_CHART_HEIGHT));
      const scale = newHeight / INITIAL_CHART_HEIGHT;
      chartContainer.style.transform = `scaleY(${scale})`;
      ticking = false;
    };

    const onScroll = () => {
      lastScrollY = container.scrollTop;
      if (!ticking) {
        requestAnimationFrame(() => {
          updateChartHeight();
          ticking = false;
        });
        ticking = true;
      }
    };

    container.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      container.removeEventListener("scroll", onScroll);
    };
  }, []);

  // Calculate 24h price change
  const currentPrice = priceData.prices[priceData.prices.length - 1];
  const priceChange =
    !isLoading && priceData.prices.length > 0
      ? (() => {
          const startPrice = priceData.prices[0];
          return ((currentPrice - startPrice) / startPrice) * 100;
        })()
      : null;

  return (
    <main className="h-screen bg-gray-900 text-white flex flex-col overflow-hidden">
      {/* Header - Fixed */}
      <div
        ref={headerRef}
        className="bg-gray-900/95 backdrop-blur-sm border-b border-gray-800 sticky top-0 z-20"
      >
        <div className="px-3 py-2">
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

      {/* Chart Section - Fixed */}
      <div 
        className="bg-gray-900 sticky top-[72px] z-10 overflow-hidden"
        style={{
          height: `${chartHeight}px`,
          minHeight: `${MIN_CHART_HEIGHT}px`,
          transition: 'height 0.1s linear'
        }}
      >
        <div 
          ref={chartContainerRef}
          className="h-full origin-top"
          style={{
            transform: 'scaleY(1)',
            transition: 'transform 0.1s linear',
          }}
        >
          <MobileBitcoinChart
            selectedTimeframe={selectedTimeframe}
            height={INITIAL_CHART_HEIGHT}
          />
        </div>
        <div className="absolute bottom-0 left-0 right-0 z-10">
          <MobileTimeframeSelector
            selectedTimeframe={selectedTimeframe}
            onTimeframeChange={setSelectedTimeframe}
          />
        </div>
      </div>

      {/* Scrollable Container */}
      <div
        ref={scrollContainerRef}
        className="flex-1 overflow-y-auto"
        style={{
          WebkitOverflowScrolling: "touch",
        }}
      >
        <div className="relative">
          <div className="pb-safe-area-inset-bottom">
            <MobileTopAssets />
          </div>
        </div>
      </div>
    </main>
  );
}
