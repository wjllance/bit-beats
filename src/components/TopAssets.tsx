import { useState, useEffect } from 'react';
import axios from 'axios';

// Constants for market data
const POPULAR_STOCKS = ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'NVDA', 'TSLA', 'TSM', 'META', 'BRK.B', 'JPM', 'UNH', '2222.SR'];
const REFRESH_INTERVAL = 5 * 60 * 1000; // 5 minutes in milliseconds

// Constants for commodity calculations
const GOLD_SUPPLY_TONS = 205000; // Total above-ground gold in metric tons
const SILVER_SUPPLY_TONS = 1740000; // Total above-ground silver in metric tons
const METRIC_TON_TO_OUNCES = 35274; // 1 metric ton = 35,274 ounces

// Asset icons
const ASSET_ICONS = {
  STOCK: {
    AAPL: 'https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg',
    MSFT: 'https://upload.wikimedia.org/wikipedia/commons/9/96/Microsoft_logo_%282012%29.svg',
    GOOGL: 'https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg',
    AMZN: 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg',
    NVDA: 'https://upload.wikimedia.org/wikipedia/sco/2/21/Nvidia_logo.svg',
    TSLA: 'https://upload.wikimedia.org/wikipedia/commons/b/bb/Tesla_T_symbol.svg',
    TSM: 'https://upload.wikimedia.org/wikipedia/commons/7/77/TSMC_Logo.svg',
    META: 'https://upload.wikimedia.org/wikipedia/commons/7/7b/Meta_Platforms_Inc._logo.svg',
    'BRK.B': 'https://upload.wikimedia.org/wikipedia/commons/d/d4/Berkshire_Hathaway_logo.svg',
    JPM: 'https://upload.wikimedia.org/wikipedia/commons/a/af/J_P_Morgan_Logo_2008_1.svg',
    UNH: 'https://upload.wikimedia.org/wikipedia/commons/e/ef/UnitedHealth_Group_logo.svg',
    '2222.SR': 'https://www.aramco.com/images/aramcoLogo.svg',
    DEFAULT: 'https://upload.wikimedia.org/wikipedia/commons/8/83/Circle-icons-dolly.svg'
  },
  COMMODITY: {
    GOLD: 'https://upload.wikimedia.org/wikipedia/commons/6/6f/Gold_coin_icon.svg',
    SILVER: 'https://upload.wikimedia.org/wikipedia/commons/8/8d/Silver_coin_icon.svg',
    DEFAULT: 'https://upload.wikimedia.org/wikipedia/commons/5/53/Commodity_icon.svg'
  },
  DEFAULT: 'https://upload.wikimedia.org/wikipedia/commons/4/46/Bitcoin.svg'
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
  image?: string;
  type: 'crypto' | 'stock' | 'commodity';
}

interface SortOption {
  label: string;
  value: keyof Asset | null;
  direction: 'asc' | 'desc';
}

export default function TopAssets() {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortOption, setSortOption] = useState<SortOption>({
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
          image: coin.image,
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

        console.log("allAssets", allAssets)

        setAssets(allAssets);
        setError(null);
      } catch (err) {
        setError('Failed to fetch market data');
        console.error('Error fetching data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllData();
    const interval = setInterval(fetchAllData, REFRESH_INTERVAL);

    return () => clearInterval(interval);
  }, []);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(price);
  };

  const formatMarketCap = (marketCap: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      notation: 'compact',
      maximumFractionDigits: 3,
    }).format(marketCap);
  };

  const getAssetIcon = (asset: Asset) => {
    if (asset.image) return asset.image;
    
    // Default icons for different asset types
    switch (asset.type) {
      case 'stock':
        return ASSET_ICONS.STOCK[asset.symbol] || ASSET_ICONS.STOCK.DEFAULT;
      case 'commodity':
        return asset.symbol === 'XAU/USD' 
          ? ASSET_ICONS.COMMODITY.GOLD 
          : ASSET_ICONS.COMMODITY.SILVER;
      default:
        return ASSET_ICONS.DEFAULT;
    }
  };

  const sortAssets = (assets: Asset[]) => {
    if (!sortOption.value) return assets;
    
    return [...assets].sort((a, b) => {
      const valueA = a[sortOption.value!];
      const valueB = b[sortOption.value!];
      return sortOption.direction === 'desc' ? valueB - valueA : valueA - valueB;
    });
  };

  if (isLoading) {
    return (
      <div className="crypto-container p-6 animate-fade-in">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="mb-4">
            <div className="h-20 bg-white/5 rounded-lg animate-pulse">
              <div className="flex items-center h-full px-4">
                <div className="w-10 h-10 bg-white/10 rounded-full"></div>
                <div className="ml-3 flex-grow">
                  <div className="h-4 w-24 bg-white/10 rounded"></div>
                  <div className="h-3 w-16 bg-white/10 rounded mt-2"></div>
                </div>
                <div className="text-right">
                  <div className="h-4 w-20 bg-white/10 rounded"></div>
                  <div className="h-3 w-16 bg-white/10 rounded mt-2"></div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="crypto-container p-6 animate-fade-in">
        <div className="text-red-400 text-center mb-4">{error}</div>
        <button
          onClick={() => fetchAllData()}
          className="mx-auto block px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors duration-200 text-gray-200"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="crypto-container p-6 animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-200">
          Top 10 Market Assets
        </h2>
        <select
          value={JSON.stringify(sortOption)}
          onChange={(e) => setSortOption(JSON.parse(e.target.value))}
          className="bg-white/5 text-gray-200 rounded-lg px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {sortOptions.map((option) => (
            <option key={option.label} value={JSON.stringify(option)}>
              Sort by {option.label}
            </option>
          ))}
        </select>
      </div>
      <div className="space-y-4">
        {sortAssets(assets).map((asset, index) => (
          <div
            key={asset.id}
            className="flex items-center justify-between p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-all duration-200 group"
          >
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="absolute -top-3 -left-3 w-6 h-6 bg-white/10 rounded-full flex items-center justify-center text-sm text-gray-400">
                  {index + 1}
                </div>
                <img
                  src={getAssetIcon(asset)}
                  alt={asset.name}
                  className="w-10 h-10 rounded-full object-cover group-hover:scale-110 transition-transform duration-200"
                />
                <div className="absolute -top-1 -right-1">
                  <span className={`inline-flex items-center justify-center w-4 h-4 rounded-full ${
                    asset.type === 'crypto' ? 'bg-yellow-500' :
                    asset.type === 'stock' ? 'bg-blue-500' :
                    'bg-green-500'
                  }`}>
                  </span>
                </div>
              </div>
              <div>
                <div className="font-medium text-gray-200 group-hover:text-white transition-colors duration-200">
                  {asset.name}
                </div>
                <div className="text-sm text-gray-400">
                  <span className="uppercase">{asset.symbol}</span>
                  <span className="ml-2 px-2 py-0.5 rounded-full bg-white/5 text-xs">
                    {asset.type}
                  </span>
                </div>
              </div>
            </div>
            <div className="text-right space-y-1">
              <div className="font-medium text-gray-200 group-hover:text-white transition-colors duration-200">
                {formatPrice(asset.current_price)}
              </div>
              <div
                className={`text-sm ${
                  asset.price_change_percentage_24h >= 0
                    ? 'text-green-400'
                    : 'text-red-400'
                }`}
              >
                {asset.price_change_percentage_24h >= 0 ? '↑' : '↓'} {Math.abs(asset.price_change_percentage_24h).toFixed(2)}%
              </div>
              <div className="text-xs text-gray-400">
                MCap: {formatMarketCap(asset.market_cap)}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}