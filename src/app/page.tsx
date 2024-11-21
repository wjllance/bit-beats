'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { PriceData, TimeframeOption, timeframeOptions } from '../types';
import { formatDate } from '../utils/dateFormatter';
import TimeframeSelector from '../components/TimeframeSelector';
import PriceDisplay from '../components/PriceDisplay';
import BitcoinChart from '../components/BitcoinChart';

export default function BitcoinPriceTracker() {
  const [priceData, setPriceData] = useState<PriceData>({
    labels: [],
    prices: [],
  });

  const [currentPrice, setCurrentPrice] = useState<number | null>(null);
  const [selectedTimeframe, setSelectedTimeframe] = useState<TimeframeOption>(timeframeOptions[2]); // Default to 30d
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
    const interval = setInterval(fetchBitcoinPrices, 5 * 60 * 1000); // Refresh every 5 minutes

    return () => clearInterval(interval);
  }, [selectedTimeframe]);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-center mb-6">
        Bitcoin Price Tracker
      </h1>
      
      <PriceDisplay currentPrice={currentPrice} />
      
      <TimeframeSelector
        selectedTimeframe={selectedTimeframe}
        onTimeframeChange={setSelectedTimeframe}
      />

      <div className="max-w-4xl mx-auto">
        <BitcoinChart
          priceData={priceData}
          selectedTimeframe={selectedTimeframe}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}
