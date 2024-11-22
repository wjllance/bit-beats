'use client';

import { useMarketDataContext } from '@/context/MarketDataContext';
import clsx from 'clsx';
import { formatMarketCap, formatPrice, formatPercentageChange } from '../../utils/formatters';

export default function MobileTopAssets() {
  const { marketData: assets, isLoading, error } = useMarketDataContext();

  if (error) {
    return (
      <div className="p-4 text-red-400 text-sm text-center">
        {error}
      </div>
    );
  }

  return (
    <div className="w-full px-4">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-base font-semibold text-yellow-500/90">Top 10 Market Assets</h2>
      </div>
      
      <div className="space-y-2.5">
        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="flex flex-col items-center space-y-2">
              <div className="w-6 h-6 border-2 border-yellow-500/20 border-t-yellow-500/90 rounded-full animate-spin" />
              <span className="text-sm text-gray-400">Loading assets...</span>
            </div>
          </div>
        ) : (
          assets.slice(0, 10).map((asset, index) => (
            <div
              key={asset.id}
              className="group relative overflow-hidden p-3 bg-gray-800/50 rounded-lg 
                hover:bg-gray-800/70 active:bg-gray-700/80 transition-all duration-200
                border border-gray-700/50"
            >
              {/* Background gradient effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/0 via-yellow-500/5 to-yellow-500/0 
                translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500" />
              
              <div className="relative flex items-center justify-between">
                {/* Left side: Rank, Symbol, and Type */}
                <div className="flex items-center space-x-3">
                  <div className="flex items-center justify-center w-6 h-6 bg-gray-700/50 rounded-lg">
                    <span className="text-gray-400 text-xs font-medium">#{index + 1}</span>
                  </div>
                  <div className="flex flex-col">
                    <div className="flex items-center space-x-2">
                      <span className="text-white text-sm font-semibold tracking-wide">{asset.symbol}</span>
                      <span className={clsx(
                        "text-[10px] px-1.5 py-0.5 rounded-full font-medium uppercase tracking-wider",
                        {
                          'bg-yellow-500/10 text-yellow-500': asset.type === 'crypto',
                          'bg-blue-500/10 text-blue-500': asset.type === 'stock',
                          'bg-purple-500/10 text-purple-500': asset.type === 'commodity'
                        }
                      )}>
                        {asset.type}
                      </span>
                    </div>
                    <span className="text-xs text-gray-400 mt-0.5">
                      {formatMarketCap(asset.market_cap)}
                    </span>
                  </div>
                </div>

                {/* Right side: Price and Change */}
                <div className="flex flex-col items-end">
                  <span className="text-sm font-medium text-white">
                    {formatPrice(asset.current_price)}
                  </span>
                  <div className="flex items-center space-x-1 mt-0.5">
                    <div className={clsx(
                      "flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium",
                      asset.price_change_percentage_24h >= 0
                        ? "bg-green-500/10 text-green-500"
                        : "bg-red-500/10 text-red-500"
                    )}>
                      <span className="mr-0.5">
                        {asset.price_change_percentage_24h >= 0 ? '↑' : '↓'}
                      </span>
                      {formatPercentageChange(asset.price_change_percentage_24h)}%
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
