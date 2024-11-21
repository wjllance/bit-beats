'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { PriceData, TimeframeOption } from '../types';
import { formatDate } from '../utils/dateFormatter';
import TimeframeSelector from '../components/TimeframeSelector';
import PriceDisplay from '../components/PriceDisplay';
import BitcoinChart from '../components/BitcoinChart';
import TopAssets from '../components/TopAssets';

export default function BitcoinPriceTracker() {
  const [priceData, setPriceData] = useState<PriceData>({
    labels: [],
    prices: [],
  });
  const [currentPrice, setCurrentPrice] = useState<number | null>(null);
  const [selectedTimeframe, setSelectedTimeframe] = useState<TimeframeOption>({ label: '24h', value: '24h', days: 1 });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBitcoinPrices = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(
          `https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?vs_currency=usd&days=${selectedTimeframe.days}`
        );

        const prices = response.data.prices;
        const labels = prices.map((price: [number, number]) => 
          formatDate(price[0], selectedTimeframe.days)
        );
        const priceValues = prices.map((price: [number, number]) => price[1]);

        setPriceData({
          labels,
          prices: priceValues,
        });
        setCurrentPrice(priceValues[priceValues.length - 1]);
      } catch (error) {
        console.error('Error fetching Bitcoin prices:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBitcoinPrices();
    const interval = setInterval(fetchBitcoinPrices, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, [selectedTimeframe]);

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <PriceDisplay currentPrice={currentPrice} priceData={priceData} />
        
        <div className="grid grid-cols-12 gap-6">
          {/* Left side assets */}
          <div className="col-span-3">
            <div className="bg-gray-800/50 rounded-lg p-4 h-full">
              <TopAssets position="left" />
            </div>
          </div>

          {/* Center chart */}
          <div className="col-span-6">
            <div className="bg-gray-800/50 rounded-lg p-6">
              <div className="mb-4">
                <TimeframeSelector
                  selectedTimeframe={selectedTimeframe}
                  onTimeframeChange={setSelectedTimeframe}
                />
              </div>
              <BitcoinChart
                priceData={priceData}
                selectedTimeframe={selectedTimeframe}
                isLoading={isLoading}
              />
            </div>
          </div>

          {/* Right side assets */}
          <div className="col-span-3">
            <div className="bg-gray-800/50 rounded-lg p-4 h-full">
              <TopAssets position="right" />
            </div>
          </div>
        </div>

        <footer className="text-center mt-6 text-yellow-500/80 text-sm">
          <p>Data provided by CoinGecko API • Updated every 5 minutes</p>
        </footer>
      </div>
    </main>
  );
}
