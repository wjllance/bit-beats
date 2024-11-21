import { useState, useEffect } from 'react';
import axios from 'axios';

// Constants for market data
const REFRESH_INTERVAL = 5 * 60 * 1000; // 5 minutes in milliseconds

// Constants for commodity calculations

const formatMarketCap = (marketCap: number): string => {
  if (marketCap >= 1e12) {
    return `$${(marketCap / 1e12).toFixed(2)}T`;
  } else if (marketCap >= 1e9) {
    return `$${(marketCap / 1e9).toFixed(2)}B`;
  } else if (marketCap >= 1e6) {
    return `$${(marketCap / 1e6).toFixed(2)}M`;
  } else {
    return `$${marketCap.toLocaleString()}`;
  }
};

// Fallback commodity data
const FALLBACK_COMMODITIES = [
  {
    id: 'gold',
    name: 'Gold',
    symbol: 'XAU/USD',
    current_price: 2619.50,
    price_change_percentage_24h: 0.35,
    market_cap: 17500000000000,
    type: 'commodity' as const,
  },
  {
    id: 'silver',
    name: 'Silver',
    symbol: 'XAG/USD',
    current_price: 30.88,
    price_change_percentage_24h: -0.42,
    market_cap: 1730000000000,
    type: 'commodity' as const,
  },
];

// API Configuration
const API_KEYS = {
  FMP: process.env.NEXT_PUBLIC_FMP_API_KEY || 'demo',
  METAL_PRICE: process.env.NEXT_PUBLIC_METAL_PRICE_API_KEY || 'demo',
};

const API_ENDPOINTS = {
  COINGECKO: 'https://api.coingecko.com/api/v3',
  FMP: 'https://financialmodelingprep.com/api/v3',
  METAL_PRICE: 'https://api.metalpriceapi.com/v1',
};

interface Asset {
  id: string;
  name: string;
  symbol: string;
  current_price: number;
  price_change_percentage_24h: number;
  market_cap: number;
  type: 'crypto' | 'stock' | 'commodity';
}

interface SortOption {
  label: string;
  value: keyof Asset | null;
  direction: 'asc' | 'desc';
}

interface TopAssetsProps {
  position: 'left' | 'right';
}

export default function TopAssets({ position }: TopAssetsProps) {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sortConfig, setSortConfig] = useState<SortOption>({
    label: 'Market Cap',
    value: 'market_cap',
    direction: 'desc'
  });

  const sortOptions: SortOption[] = [
    { label: 'Market Cap', value: 'market_cap', direction: 'desc' },
    { label: 'Price', value: 'current_price', direction: 'desc' },
    { label: '24h Change', value: 'price_change_percentage_24h', direction: 'desc' },
  ];

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch crypto data
        const cryptoResponse = await axios.get(
          `${API_ENDPOINTS.COINGECKO}/coins/markets`,
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
        
        const cryptoAssets = cryptoResponse.data.map((coin: any) => ({
          id: coin.id,
          name: coin.name,
          symbol: coin.symbol.toUpperCase(),
          current_price: coin.current_price,
          price_change_percentage_24h: coin.price_change_percentage_24h,
          market_cap: coin.market_cap,
          type: 'crypto' as const,
        }));

        // Fetch stocks and commodities from our cached API
        const marketResponse = await axios.get('/api/market-data');
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

  const sortedAssets = [...assets].sort((a, b) => {
    if (!sortConfig.value) return 0;
    const aValue = a[sortConfig.value];
    const bValue = b[sortConfig.value];
    return sortConfig.direction === 'desc' ? 
      (bValue as number) - (aValue as number) : 
      (aValue as number) - (bValue as number);
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
        {displayedAssets.map((asset, index) => {
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
        })}
      </div>
    </div>
  );
}