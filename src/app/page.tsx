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
  const [selectedTimeframe, setSelectedTimeframe] = useState<TimeframeOption>({ label: '30d', days: 30 });
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
    <main className="min-h-screen bg-gray-900 text-white p-4">
      <div className="max-w-7xl mx-auto space-y-4">
        <PriceDisplay currentPrice={currentPrice} />
        
        <div className="grid grid-cols-12 gap-4">
          {/* Left side assets */}
          <div className="col-span-3">
            <TopAssets position="left" />
          </div>

          {/* Center chart */}
          <div className="col-span-6 bg-gray-800 rounded-lg p-4">
            <div className="mb-3">
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

          {/* Right side assets */}
          <div className="col-span-3">
            <TopAssets position="right" />
          </div>
        </div>

        <footer className="text-center mt-4 text-yellow-500 text-xs">
          <p>Data provided by CoinGecko API • Updated every 5 minutes</p>
        </footer>
      </div>
    </main>
  );
}
