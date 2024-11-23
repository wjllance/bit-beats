"use client";

import clsx from "clsx";

interface PriceStatusBadgeProps {
  isLoading: boolean;
}

export default function PriceStatusBadge({ isLoading }: PriceStatusBadgeProps) {
  return (
    <div className="flex items-center">
      <div className="flex items-center gap-1.5">
        <span className="text-[10px] font-medium text-gray-400 bg-gray-800/50 px-1.5 py-0.5 rounded-full">
          BTC/USD
        </span>
        <div className="flex items-center gap-1">
          <div
            className={clsx(
              "w-1.5 h-1.5 rounded-full",
              isLoading ? "bg-yellow-500 animate-pulse" : "bg-green-500"
            )}
          />
          <span className="text-[10px] text-gray-400">
            {isLoading ? "Updating" : "Live"}
          </span>
        </div>
      </div>
    </div>
  );
}
