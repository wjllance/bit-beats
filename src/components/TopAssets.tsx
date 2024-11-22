'use client';

import { useState } from 'react';
import { Asset } from '../types';
import { useMarketDataContext } from '@/context/MarketDataContext';
import { formatMarketCap } from '../utils/formatters';

interface SortOption {
  label: string;
  value: keyof Asset | null;
  direction: 'asc' | 'desc';
}

interface TopAssetsProps {
  position: 'left' | 'right';
}

export default function TopAssets({ position }: TopAssetsProps): JSX.Element {
  const { marketData: assets, isLoading } = useMarketDataContext();
  const [sortConfig] = useState<SortOption>({
    label: 'Market Cap',
    value: 'market_cap',
    direction: 'desc'
  });

  const sortedAssets = [...assets].sort((a, b) => {
    if (!sortConfig.value) return 0;
    const aValue = a[sortConfig.value];
    const bValue = b[sortConfig.value];
    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return sortConfig.direction === 'desc' ? bValue - aValue : aValue - bValue;
    }
    return 0;
  });

  // Get the appropriate slice of assets based on position
  const displayedAssets = position === 'left' ? 
    sortedAssets.slice(0, 5) : 
    sortedAssets.slice(5, 10);

  const startRank = position === 'left' ? 1 : 6;
  const title = position === 'left' ? 'Top 5 Assets' : 'Next 5 Assets';

  return (
    <div className="w-full">
      <h2 className="text-lg font-semibold text-yellow-500/90 mb-4 hover:text-yellow-400/90 transition-colors duration-300">{title}</h2>
      <div className="space-y-4">
        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="flex flex-col items-center space-y-2">
              <div className="w-6 h-6 border-2 border-yellow-500/20 border-t-yellow-500/90 rounded-full animate-spin" />
              <span className="text-sm text-gray-400">Loading assets...</span>
            </div>
          </div>
        ) : (
          displayedAssets.map((asset, index) => {
            const rank = startRank + index;
            return (
              <div
                key={rank}
                className="group flex items-center justify-between p-3 bg-gray-800/70 rounded-lg 
                  hover:bg-gray-700/80 transition-all duration-300 cursor-pointer 
                  hover:shadow-[0_0_15px_rgba(234,179,8,0.1)] hover:shadow-yellow-600/5
                  border border-transparent hover:border-yellow-900/30
                  transform hover:scale-[1.23] hover:-translate-y-0.5 hover:z-10"
              >
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <div className="absolute inset-0 bg-yellow-500/20 rounded-md scale-0 group-hover:scale-100 transition-transform duration-300 ease-out" />
                    <span className="relative text-gray-400 text-sm w-6 transition-colors duration-300 group-hover:text-yellow-500">{rank}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-white font-medium transition-all duration-300 group-hover:text-yellow-500 group-hover:translate-x-1">{asset.symbol}</span>
                    <span className="text-gray-400 text-xs transition-all duration-300 group-hover:text-gray-300 group-hover:translate-x-1">
                      {formatMarketCap(asset.market_cap)}
                    </span>
                  </div>
                </div>
                <div className="flex items-center space-x-6">
                  <div className="text-right">
                    <div className="text-white font-medium transition-all duration-300 group-hover:text-yellow-500">${asset.current_price.toLocaleString('en-US', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}</div>
                    <div 
                      className={`text-xs transform transition-all duration-300 group-hover:translate-y-[-1px] flex items-center justify-end space-x-1 ${
                        asset.price_change_percentage_24h >= 0 
                          ? 'text-green-400 group-hover:text-green-300' 
                          : 'text-red-400 group-hover:text-red-300'
                      }`}
                    >
                      <span className="transition-transform duration-300 group-hover:scale-125">
                        {asset.price_change_percentage_24h >= 0 ? '↑' : '↓'}
                      </span>
                      <span>{Math.abs(asset.price_change_percentage_24h).toFixed(2)}%</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}