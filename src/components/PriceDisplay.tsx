"use client";

import clsx from "clsx";
import { useState, useEffect } from "react";

interface PriceDisplayProps {
  currentPrice: number | null;
  priceData: {
    labels: string[];
    prices: number[];
  };
  error?: string | null;
  isLoading?: boolean;
}

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
  "The Beat of Digital Currency",
];

const formatDateTime = (dateStr: string): { time: string; date: string } => {
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) {
    return {
      time: "Invalid time",
      date: "Invalid date",
    };
  }
  // Force current year
  const currentYear = new Date().getFullYear();
  date.setFullYear(currentYear);

  return {
    time: date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    }),
    date: date.toLocaleDateString("en-US"),
  };
};

const formatPrice = (price: number | undefined): string => {
  if (typeof price !== "number") return "-.--";
  return price.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

const calculatePriceChange = (
  priceData: { labels: string[]; prices: number[] },
  currentPrice: number | null
) => {
  if (!currentPrice || !priceData.prices.length) return null;
  const startPrice = priceData.prices[0];
  const change = ((currentPrice - startPrice) / startPrice) * 100;
  return change;
};

export default function PriceDisplay({
  currentPrice,
  priceData,
  error,
  isLoading,
}: PriceDisplayProps) {
  const [currentSlogan, setCurrentSlogan] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentSlogan((prev) => (prev + 1) % SLOGANS.length);
        setIsTransitioning(false);
      }, 500); // Half of the transition duration
    }, 5000); // Change slogan every 5 seconds

    return () => clearInterval(interval);
  }, []);

  const priceChange = calculatePriceChange(priceData, currentPrice);
  const isPositive = priceChange !== null && priceChange > 0;

  return (
    <div className="flex items-center justify-between bg-gray-800/50 backdrop-blur-sm rounded-lg px-8 py-6 hover:bg-gray-800/60 transition-all duration-300 shadow-lg hover:shadow-xl">
      {error ? (
        <span className="text-sm text-red-400">{error}</span>
      ) : (
        <>
          {/* Left: Logo and Title */}
          <div className="flex items-center group cursor-pointer">
            <svg
              className="w-10 h-10 text-yellow-500 transform transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M23.638 14.904c-1.602 6.43-8.113 10.34-14.542 8.736C2.67 22.05-1.244 15.525.362 9.105 1.962 2.67 8.475-1.243 14.9.358c6.43 1.605 10.342 8.115 8.738 14.548v-.002zm-6.35-4.613c.24-1.59-.974-2.45-2.64-3.03l.54-2.153-1.315-.328-.525 2.107c-.345-.087-.705-.167-1.064-.25l.526-2.127-1.32-.33-.54 2.165c-.285-.067-.565-.132-.84-.2l-1.815-.45-.35 1.407s.974.225.955.236c.535.136.63.486.615.766l-1.477 5.92c-.075.18-.24.45-.614.35.015.02-.96-.24-.96-.24l-.66 1.51 1.71.426.93.242-.54 2.19 1.32.327.54-2.17c.36.1.705.19 1.05.273l-.51 2.154 1.32.33.545-2.19c2.24.427 3.93.257 4.64-1.774.57-1.637-.03-2.58-1.217-3.196.854-.193 1.5-.76 1.68-1.93h.01zm-3.01 4.22c-.404 1.64-3.157.75-4.05.53l.72-2.9c.896.23 3.757.67 3.33 2.37zm.41-4.24c-.37 1.49-2.662.735-3.405.55l.654-2.64c.744.18 3.137.524 2.75 2.084v.006z" />
            </svg>
            <h1 className="ml-4 text-3xl font-bold bg-gradient-to-r from-yellow-500 via-yellow-300 to-yellow-500 text-transparent bg-clip-text group-hover:from-yellow-400 group-hover:via-yellow-200 group-hover:to-yellow-400 transition-all duration-300">
              Bit Beats
            </h1>
          </div>

          {/* Middle: Price Display */}
          <div className="flex flex-col items-center transform hover:scale-105 transition-all duration-300 cursor-pointer">
            <div className="flex items-center justify-end gap-1 text-sm text-gray-500 mb-2">
              Updated time:
              {priceData.labels && priceData.labels.length > 0 ? (
                (() => {
                  const { time, date } = formatDateTime(
                    priceData.labels[priceData.labels.length - 1]
                  );
                  return (
                    <>
                      <span>{time}</span>
                      <span>•</span>
                      <span>{date}</span>
                    </>
                  );
                })()
              ) : (
                <span>Loading...</span>
              )}
            </div>
            {currentPrice ? (
              <>
                <div className="flex items-center space-x-3">
                  <span className="text-2xl font-bold text-white animate-fade-in">
                    ${formatPrice(currentPrice)}
                  </span>
                  <span
                    className={`text-base flex items-center space-x-1 ${
                      isPositive ? "text-green-400" : "text-red-400"
                    } transition-all duration-300 transform hover:translate-y-[-2px]`}
                  >
                    <span className="transform transition-transform duration-200">
                      {isPositive ? "↑" : "↓"}
                    </span>
                    <span>{Math.abs(priceChange || 0).toFixed(2)}%</span>
                  </span>
                </div>
              </>
            ) : (
              <div className="text-2xl font-bold text-gray-500 animate-pulse">
                Loading...
              </div>
            )}
          </div>

          {/* Right: Rotating Slogan */}
          <div className="w-[300px] flex items-center justify-end overflow-hidden group cursor-pointer">
            <p
              className={`
                text-yellow-500 text-base text-right
                transition-all duration-1000 ease-in-out
                transform group-hover:scale-105
                ${
                  isTransitioning
                    ? "translate-y-8 opacity-0"
                    : "translate-y-0 opacity-100"
                }
              `}
            >
              {SLOGANS[currentSlogan]}
            </p>
          </div>
        </>
      )}
    </div>
  );
}
