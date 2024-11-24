"use client";

import clsx from "clsx";
import { PriceData } from "../../types";
import { formatDateTime } from "@/utils/dateFormat";

interface PriceDisplayProps {
  priceData: PriceData;
  error: string | null;
  isLoading: boolean;
  currentPrice: number;
  priceChange: number | null;
}

const formatPrice = (price: number | undefined): string => {
  if (typeof price !== "number") return "-.--";
  return price.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

export default function PriceDisplay({
  priceData,
  error,
  currentPrice,
  priceChange,
}: PriceDisplayProps) {
  return (
    <div className="bg-gray-800/30 rounded-lg p-2.5">
      {error ? (
        <span className="text-sm text-red-400">{error}</span>
      ) : (
        <div>
          <div className="flex items-center justify-end gap-1 text-[10px] text-gray-500">
            Updated time:
            {priceData.labels && priceData.labels.length > 0 ? (
              (() => {
                const datetime = priceData.labels[priceData.labels.length - 1];
                return (
                  <>
                    <span>{datetime}</span>
                  </>
                );
              })()
            ) : (
              <span>Loading...</span>
            )}
          </div>
          <div className="flex items-baseline justify-between mb-1">
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-bold text-white">
                ${formatPrice(currentPrice)}
              </span>
              {priceChange !== null && (
                <div className="flex items-center gap-1.5">
                  <span
                    className={clsx(
                      "text-sm font-medium",
                      priceChange >= 0 ? "text-green-500" : "text-red-500"
                    )}
                  >
                    {priceChange >= 0 ? "+" : ""}
                    {priceChange.toFixed(2)}%
                  </span>
                  <span
                    className={clsx(
                      "text-[10px] px-1.5 py-0.5 rounded-full font-medium",
                      priceChange >= 0
                        ? "bg-green-500/10 text-green-500"
                        : "bg-red-500/10 text-red-500"
                    )}
                  >
                    {priceChange >= 0 ? "Bullish ↑" : "Bearish ↓"}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
