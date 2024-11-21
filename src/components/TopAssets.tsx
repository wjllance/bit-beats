import { useState, useEffect } from 'react';
import axios from 'axios';
import { MarketData, CoinGeckoResponse } from '../types';

// Constants for market data
const REFRESH_INTERVAL = 5 * 60 * 1000; // 5 minutes in milliseconds

const formatMarketCap = (marketCap: number): string => {
  if (marketCap >= 1e12) {
    return `$${(marketCap / 1e12).toFixed(1)}T`;
  } else if (marketCap >= 1e9) {
    return `$${(marketCap / 1e9).toFixed(1)}B`;
  } else if (marketCap >= 1e6) {
    return `$${(marketCap / 1e6).toFixed(1)}M`;
  } else {
    return `$${marketCap.toLocaleString()}`;
  }
};

interface TopAssetsProps {
  position: 'left' | 'right';
}

export default function TopAssets({ position }: TopAssetsProps) {
  const [assets, setAssets] = useState<MarketData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch crypto data
        const cryptoResponse = await axios.get<CoinGeckoResponse[]>(
          'https://api.coingecko.com/api/v3/coins/markets',
          {
            params: {
              vs_currency: 'usd',
              order: 'market_cap_desc',
              per_page: 5,
              page: 1,
              sparkline: false,
            },
          }
        );
        
        const cryptoAssets: MarketData[] = cryptoResponse.data.map((coin) => ({
          id: coin.id,
          name: coin.name,
          symbol: coin.symbol.toUpperCase(),
          current_price: coin.current_price,
          price_change_percentage_24h: coin.price_change_percentage_24h,
          market_cap: coin.market_cap,
          type: 'crypto',
        }));

        // Fetch stocks and commodities from our cached API
        const marketResponse = await axios.get<{ stocks: MarketData[]; commodities: MarketData[] }>('/api/market-data');
        const { stocks, commodities } = marketResponse.data;

        const allAssets = [...cryptoAssets, ...stocks, ...commodities]
          .sort((a, b) => b.market_cap - a.market_cap)
          .slice(0, 10); // Take only top 10 assets

        setAssets(allAssets);
      } catch (err) {
        console.error('Error fetching data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllData();
    const interval = setInterval(fetchAllData, REFRESH_INTERVAL);

    return () => clearInterval(interval);
  }, []);

  const sortedAssets = [...assets];
  
  // Get the appropriate slice of assets based on position
  const displayedAssets = position === 'left' ? 
    sortedAssets.slice(0, 5) : 
    sortedAssets.slice(5, 10);

  const startRank = position === 'left' ? 1 : 6;
  const title = position === 'left' ? 'Top 5 Assets' : 'Next 5 Assets';

  return (
    <div className="flex flex-col gap-4 p-4 bg-gray-900 rounded-lg shadow-lg">
      <h2 className="text-xl font-bold text-white">{title}</h2>
      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div className="space-y-4">
          {displayedAssets.map((asset, index) => (
            <div
              key={asset.id}
              className="flex items-center justify-between p-4 bg-gray-800 rounded-lg hover:bg-gray-700 transition-all duration-300 transform hover:scale-105"
            >
              <div className="flex items-center gap-4">
                <span className="text-lg font-semibold text-gray-400">
                  #{startRank + index}
                </span>
                <div>
                  <h3 className="font-bold text-white">{asset.name}</h3>
                  <p className="text-sm text-gray-400">{asset.symbol}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-white">
                  ${asset.current_price.toLocaleString()}
                </p>
                <p
                  className={`text-sm ${
                    asset.price_change_percentage_24h >= 0
                      ? 'text-green-400'
                      : 'text-red-400'
                  }`}
                >
                  {asset.price_change_percentage_24h >= 0 ? '+' : ''}
                  {asset.price_change_percentage_24h.toFixed(2)}%
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  {formatMarketCap(asset.market_cap)}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}