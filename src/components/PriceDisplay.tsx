"use client";

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
            <div className="w-8 h-8 rounded-lg flex items-center justify-center overflow-hidden">
              <img src="/images/logo.png" alt="Logo" className="w-8 h-8" />
            </div>

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
                  const datetime =
                    priceData.labels[priceData.labels.length - 1];
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
