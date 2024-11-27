"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import MobileBitcoinChart from "@/components/mobile/MobileBitcoinChart";
import MobileTopAssets from "@/components/mobile/MobileTopAssets";
import MobileTimeframeSelector from "@/components/mobile/MobileTimeframeSelector";
import MobileHeader from "@/components/mobile/MobileHeader";
import PriceStatusBadge from "@/components/mobile/PriceStatusBadge";
import PriceDisplay from "@/components/mobile/PriceDisplay";
import { usePriceHistory } from "@/hooks/usePriceHistory";

// Debounce helper
function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

export default function MobilePage() {
  const [selectedTimeframe, setSelectedTimeframe] = useState({
    label: "24h",
    days: 1,
  });
  const { priceData, isLoading, error } = usePriceHistory(selectedTimeframe);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);
  const [chartHeight, setChartHeight] = useState(130);
  const INITIAL_CHART_HEIGHT = 130;
  const MIN_CHART_HEIGHT = 80;
  const SCROLL_RANGE = 100;

  // Debounced chart update
  const debouncedChartUpdate = useCallback(
    debounce(() => {
      setIsScrolling(false);
    }, 150),
    []
  );

  const calculateChartHeight = useCallback((scrollTop: number) => {
    const headerHeight = headerRef.current?.offsetHeight || 0;
    const viewportHeight = window.innerHeight;
    const scrollableHeight = viewportHeight - headerHeight;

    // Calculate progress based on scroll position relative to viewport
    const scrollProgress = Math.min(Math.max(scrollTop / SCROLL_RANGE, 0), 1);

    // Calculate new height with easing
    const heightDiff = INITIAL_CHART_HEIGHT - MIN_CHART_HEIGHT;
    const newHeight =
      INITIAL_CHART_HEIGHT - heightDiff * easeOutQuad(scrollProgress);

    return Math.max(Math.round(newHeight), MIN_CHART_HEIGHT);
  }, []);

  // Easing function for smoother height transition
  const easeOutQuad = (t: number): number => {
    return t * (2 - t);
  };

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    let touchStartY = 0;
    let lastScrollTop = 0;
    let rafId: number;

    const handleScroll = () => {
      const scrollTop = container.scrollTop;

      // Use requestAnimationFrame for smooth updates
      if (rafId) {
        cancelAnimationFrame(rafId);
      }

      rafId = requestAnimationFrame(() => {
        const newHeight = calculateChartHeight(scrollTop);
        console.log("newHeight", newHeight);
        setChartHeight(newHeight);
        setIsScrolling(true);
        setScrollProgress(scrollTop / SCROLL_RANGE);
        lastScrollTop = scrollTop;
        debouncedChartUpdate();
      });
    };

    const handleTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY;
      setIsScrolling(true);
    };

    const handleTouchEnd = () => {
      debouncedChartUpdate();
    };

    container.addEventListener("scroll", handleScroll, { passive: true });
    container.addEventListener("touchstart", handleTouchStart, {
      passive: true,
    });
    container.addEventListener("touchend", handleTouchEnd, { passive: true });

    return () => {
      container.removeEventListener("scroll", handleScroll);
      container.removeEventListener("touchstart", handleTouchStart);
      container.removeEventListener("touchend", handleTouchEnd);
      if (rafId) {
        cancelAnimationFrame(rafId);
      }
    };
  }, [debouncedChartUpdate, calculateChartHeight]);

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
        className="bg-gray-900 sticky top-[72px] z-10"
        style={{
          height: `${chartHeight}px`,
          minHeight: `${MIN_CHART_HEIGHT}px`,
          transition: isScrolling ? "none" : "height 0.2s ease-out",
        }}
      >
        {!isScrolling && (
          <div className="h-full" style={{ minHeight: `${MIN_CHART_HEIGHT}px` }}>
            <MobileBitcoinChart
              selectedTimeframe={selectedTimeframe}
              height={chartHeight}
            />
          </div>
        )}
        <div className="absolute bottom-0 left-0 right-0 z-10">
          <MobileTimeframeSelector
            selectedTimeframe={selectedTimeframe}
            onTimeframeChange={setSelectedTimeframe}
          />
        </div>
      </div>

      {/* Scrollable Container */}
      <div ref={scrollContainerRef} className="flex-1 overflow-y-auto">
        {/* Content that scrolls under the fixed sections */}
        <div className="relative">
          <div className="pb-safe-area-inset-bottom">
            <MobileTopAssets />
          </div>
        </div>
      </div>
    </main>
  );
}
