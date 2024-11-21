import { useMarketData } from '../../hooks/useMarketData';

const formatMarketCap = (marketCap: number): string => {
  if (marketCap === null || marketCap === undefined) {
    return '';
  } else if (marketCap >= 1e12) {
    return `$${(marketCap / 1e12).toFixed(2)}T`;
  } else if (marketCap >= 1e9) {
    return `$${(marketCap / 1e9).toFixed(2)}B`;
  } else if (marketCap >= 1e6) {
    return `$${(marketCap / 1e6).toFixed(2)}M`;
  } else {
    return `$${marketCap.toLocaleString()}`;
  }
};

export default function MobileTopAssets() {
  const { assets, isLoading, error } = useMarketData();

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
        <h2 className="text-base font-semibold text-yellow-500/90">Top Assets</h2>
        <span className="text-xs text-gray-400">Market Cap</span>
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
          assets.map((asset, index) => (
            <div
              key={asset.id}
              className="group relative overflow-hidden p-3 bg-gray-800/70 rounded-lg 
                active:bg-gray-700/80 transition-all duration-200
                border border-transparent active:border-yellow-900/30"
            >
              {/* Background gradient effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/0 via-yellow-500/5 to-yellow-500/0 
                translate-x-[-100%] group-active:translate-x-[100%] transition-transform duration-300" />
              
              <div className="relative flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="flex items-center justify-center w-5 h-5">
                    <span className="text-gray-400 text-xs">{index + 1}</span>
                  </div>
                  <div className="flex flex-col">
                    <div className="flex items-center space-x-2">
                      <span className="text-white text-sm font-medium">{asset.symbol}</span>
                      <span className="text-gray-400 text-xs">{asset.type}</span>
                    </div>
                    <span className="text-gray-400 text-xs">
                      {formatMarketCap(asset.market_cap)}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <div className="flex items-center">
                    <span
                      className="text-sm"
                    >
                      ${asset.current_price.toLocaleString()}
                    </span>
                    <span
                      className="ml-2 text-xs"
                    >
                      {asset.price_change_percentage_24h >= 0 ? '+' : ''}
                      {asset.price_change_percentage_24h.toFixed(2)}%
                    </span>
                  </div>
                  <div 
                    className={`text-xs flex items-center space-x-1 ${
                      asset.price_change_percentage_24h >= 0 
                        ? 'text-green-400' 
                        : 'text-red-400'
                    }`}
                  >
                    <span className="transition-transform group-active:scale-110">
                      {asset.price_change_percentage_24h >= 0 ? '↑' : '↓'}
                    </span>
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
