interface PriceDisplayProps {
  currentPrice: number | null;
}

export default function PriceDisplay({ currentPrice }: PriceDisplayProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(price);
  };

  const priceChange = currentPrice ? (currentPrice - (currentPrice * 0.98)) : null; // Example 24h change
  const isPositive = priceChange && priceChange > 0;

  return (
    <div className="flex flex-col items-center justify-center p-6">
      <h2 className="text-lg font-semibold text-yellow-500 mb-2">Bitcoin Price</h2>
      <div className="relative">
        {currentPrice ? (
          <>
            <div className="text-4xl md:text-5xl font-bold text-white mb-2 relative">
              <span className="opacity-90">{formatPrice(currentPrice)}</span>
              <div className="absolute -right-4 top-0 h-full flex items-center">
                <div className={`flex items-center text-sm ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
                  <span className="ml-2">{isPositive ? '↑' : '↓'}</span>
                </div>
              </div>
            </div>
            <div className="text-sm text-gray-400 text-center">
              24h Change: <span className={isPositive ? 'text-green-400' : 'text-red-400'}>
                {isPositive ? '+' : ''}{priceChange?.toFixed(2)}%
              </span>
            </div>
          </>
        ) : (
          <div className="text-4xl md:text-5xl font-bold text-gray-500 animate-pulse">
            Loading...
          </div>
        )}
      </div>
    </div>
  );
}
