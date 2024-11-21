import { useState, useEffect } from 'react';
import axios from 'axios';

// Constants for market data
const POPULAR_STOCKS = ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'NVDA', 'TSLA', 'TSM', 'META', 'BRK.B', 'JPM', 'UNH', '2222.SR'];
const REFRESH_INTERVAL = 5 * 60 * 1000; // 5 minutes in milliseconds

// Constants for commodity calculations
const GOLD_SUPPLY_TONS = 205000; // Total above-ground gold in metric tons
const SILVER_SUPPLY_TONS = 1740000; // Total above-ground silver in metric tons
const METRIC_TON_TO_OUNCES = 35274; // 1 metric ton = 35,274 ounces

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

  const fetchCryptoData = async () => {
    try {
      const response = await axios.get(
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
      return response.data.map((coin: any) => ({
        id: coin.id,
        name: coin.name,
        symbol: coin.symbol.toUpperCase(),
        current_price: coin.current_price,
        price_change_percentage_24h: coin.price_change_percentage_24h,
        market_cap: coin.market_cap,
        type: 'crypto' as const,
      }));
    } catch (error) {
      console.error('Error fetching crypto data:', error);
      return [];
    }
  };

  const fetchStockData = async () => {
    try {
      const response = await axios.get(`${API_ENDPOINTS.FMP}/quote/${POPULAR_STOCKS.join(',')}`, {
        params: { apikey: API_KEYS.FMP }
      });
      return response.data.map((stock: any) => ({
        id: stock.symbol,
        name: stock.name,
        symbol: stock.symbol,
        current_price: stock.price,
        price_change_percentage_24h: stock.changesPercentage,
        market_cap: stock.marketCap,
        type: 'stock' as const,
      }));
    } catch (error) {
      console.error('Error fetching stock data:', error);
      return [];
    }
  };

  const fetchCommodityData = async () => {
    try {
      // Get yesterday's date for price change
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 2);

      const formatDate = (date: Date) => {
        return date.toISOString().split('T')[0];
      };

      const calculateMarketCap = (pricePerOunce: number, supplyTons: number) => {
        const marketCap = pricePerOunce * supplyTons * METRIC_TON_TO_OUNCES;
        return marketCap;
      };

      const calculatePriceChange = (currentPrice: number, previousPrice: number) => {
        const change = ((currentPrice - previousPrice) / previousPrice) * 100;
        return change;
      };

      const [goldPrice, silverPrice, yesterdayGold, yesterdaySilver] = await Promise.all([
        axios.get(`${API_ENDPOINTS.METAL_PRICE}/latest`, {
          params: {
            api_key: API_KEYS.METAL_PRICE,
            currencies: 'XAU'
          }
        }),
        axios.get(`${API_ENDPOINTS.METAL_PRICE}/latest`, {
          params: {
            api_key: API_KEYS.METAL_PRICE,
            currencies: 'XAG'
          }
        }),
        axios.get(`${API_ENDPOINTS.METAL_PRICE}/${formatDate(yesterday)}`, {
          params: {
            api_key: API_KEYS.METAL_PRICE,
            currencies: 'XAU',
          }
        }),
        axios.get(`${API_ENDPOINTS.METAL_PRICE}/${formatDate(yesterday)}`, {
          params: {
            api_key: API_KEYS.METAL_PRICE,
            currencies: 'XAG',
          }
        })
      ]);

      const commodityData = [
        {
          id: 'gold',
          name: 'Gold',
          symbol: 'XAU/USD',
          current_price: goldPrice.data.rates.USDXAU,
          market_cap: calculateMarketCap(goldPrice.data.rates.USDXAU, GOLD_SUPPLY_TONS),
          price_change_percentage_24h: calculatePriceChange(goldPrice.data.rates.USDXAU, yesterdayGold.data.rates.USDXAU),
          type: 'commodity' as const,
        },
        {
          id: 'silver',
          name: 'Silver',
          symbol: 'XAG/USD',
          current_price: silverPrice.data.rates.USDXAG,
          market_cap: calculateMarketCap(silverPrice.data.rates.USDXAG, SILVER_SUPPLY_TONS),
          price_change_percentage_24h: calculatePriceChange(silverPrice.data.rates.USDXAG, yesterdaySilver.data.rates.USDXAG),
          type: 'commodity' as const,
        }
      ];

      return commodityData;
    } catch (error) {
      console.error('Error fetching commodity data:', error);
      console.log('Using fallback commodity data');
      return FALLBACK_COMMODITIES;
    }
  };

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setIsLoading(true);
        const [cryptoAssets, stockAssets, commodityAssets] = await Promise.all([
          fetchCryptoData(),
          fetchStockData(),
          fetchCommodityData()
        ]);

        const allAssets = [...cryptoAssets, ...stockAssets, ...commodityAssets]
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
      <h2 className="text-lg font-semibold text-yellow-500/90 mb-4">{title}</h2>
      <div className="space-y-4">
        {displayedAssets.map((asset, index) => {
          const rank = startRank + index;
          return (
            <div
              key={rank}
              className="flex items-center justify-between p-3 bg-gray-800/70 rounded-lg hover:bg-gray-700/70 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <span className="text-gray-400 text-sm w-6">{rank}</span>
                <span className="text-white font-medium">{asset.symbol}</span>
              </div>
              <div className="text-right">
                <div className="text-white">${asset.current_price.toLocaleString('en-US', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}</div>
                <div className={`text-xs ${
                  asset.price_change_percentage_24h >= 0 ? 'text-green-400' : 'text-red-400'
                }`}>
                  {asset.price_change_percentage_24h >= 0 ? '+' : ''}
                  {asset.price_change_percentage_24h.toFixed(2)}%
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}