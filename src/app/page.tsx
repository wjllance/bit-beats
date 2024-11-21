'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { PriceData, TimeframeOption } from '../types';
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
    <main className="min-h-screen p-6 sm:p-8 md:p-12" id="bitcoin-tracker-app">
      <div className="max-w-6xl mx-auto">
        {/* Crypto Header */}
        <header className="crypto-header">
          <div className="flex items-center justify-center mb-2">
            <svg
              className="w-12 h-12 text-[#f7931a] mr-3"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M23.638 14.904c-1.602 6.43-8.113 10.34-14.542 8.736C2.67 22.05-1.244 15.525.362 9.105 1.962 2.67 8.475-1.243 14.9.358c6.43 1.605 10.342 8.115 8.738 14.548v-.002zm-6.35-4.613c.24-1.59-.974-2.45-2.64-3.03l.54-2.153-1.315-.328-.525 2.107c-.345-.087-.705-.167-1.064-.25l.526-2.127-1.32-.33-.54 2.165c-.285-.067-.565-.132-.84-.2l-1.815-.45-.35 1.407s.974.225.955.236c.535.136.63.486.615.766l-1.477 5.92c-.075.18-.24.45-.614.35.015.02-.96-.24-.96-.24l-.66 1.51 1.71.426.93.242-.54 2.19 1.32.327.54-2.17c.36.1.705.19 1.05.273l-.51 2.154 1.32.33.545-2.19c2.24.427 3.93.257 4.64-1.774.57-1.637-.03-2.58-1.217-3.196.854-.193 1.5-.76 1.68-1.93h.01zm-3.01 4.22c-.404 1.64-3.157.75-4.05.53l.72-2.9c.896.23 3.757.67 3.33 2.37zm.41-4.24c-.37 1.49-2.662.735-3.405.55l.654-2.64c.744.18 3.137.524 2.75 2.084v.006z" />
            </svg>
            <h1 className="crypto-title">
              Bitcoin Price Tracker
            </h1>
          </div>
          <p className="crypto-subtitle">
            Real-time Bitcoin price data with historical charts
          </p>
        </header>

        {/* Main Content */}
        <div className="space-y-8">
          <section className="price-display animate-fade-in">
            <PriceDisplay currentPrice={currentPrice} />
          </section>
          
          <section className="flex justify-center animate-fade-in">
            <TimeframeSelector
              selectedTimeframe={selectedTimeframe}
              onTimeframeChange={setSelectedTimeframe}
            />
          </section>

          <section className="chart-container animate-fade-in">
            <BitcoinChart
              priceData={priceData}
              selectedTimeframe={selectedTimeframe}
              isLoading={isLoading}
            />
          </section>
        </div>

        <footer className="text-center mt-12 text-gray-400 text-sm">
          <p>Data provided by CoinGecko API • Updated every 5 minutes</p>
        </footer>
      </div>
    </main>
  );
}
