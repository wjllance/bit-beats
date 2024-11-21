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

  const priceChange = currentPrice ? (currentPrice - (currentPrice * 0.98)) : null;
  const isPositive = priceChange && priceChange > 0;

  return (
    <div className="flex items-center justify-between bg-gray-800/50 rounded-lg px-6 py-3">
      {/* Logo and Title */}
      <div className="flex items-center">
        <svg
          className="w-8 h-8 text-yellow-500"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M23.638 14.904c-1.602 6.43-8.113 10.34-14.542 8.736C2.67 22.05-1.244 15.525.362 9.105 1.962 2.67 8.475-1.243 14.9.358c6.43 1.605 10.342 8.115 8.738 14.548v-.002zm-6.35-4.613c.24-1.59-.974-2.45-2.64-3.03l.54-2.153-1.315-.328-.525 2.107c-.345-.087-.705-.167-1.064-.25l.526-2.127-1.32-.33-.54 2.165c-.285-.067-.565-.132-.84-.2l-1.815-.45-.35 1.407s.974.225.955.236c.535.136.63.486.615.766l-1.477 5.92c-.075.18-.24.45-.614.35.015.02-.96-.24-.96-.24l-.66 1.51 1.71.426.93.242-.54 2.19 1.32.327.54-2.17c.36.1.705.19 1.05.273l-.51 2.154 1.32.33.545-2.19c2.24.427 3.93.257 4.64-1.774.57-1.637-.03-2.58-1.217-3.196.854-.193 1.5-.76 1.68-1.93h.01zm-3.01 4.22c-.404 1.64-3.157.75-4.05.53l.72-2.9c.896.23 3.757.67 3.33 2.37zm.41-4.24c-.37 1.49-2.662.735-3.405.55l.654-2.64c.744.18 3.137.524 2.75 2.084v.006z" />
        </svg>
        <div className="ml-3">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-yellow-500 via-yellow-300 to-yellow-500 text-transparent bg-clip-text">
            BTC Beats
          </h1>
          <p className="text-yellow-500 text-sm">
            Watch Bitcoin Rise to the Top
          </p>
        </div>
      </div>

      {/* Price Display */}
      <div className="flex items-center space-x-6">
        <div className="flex flex-col items-end">
          {currentPrice ? (
            <>
              <div className="flex items-center space-x-2">
                <span className="text-xl font-bold text-white">
                  {formatPrice(currentPrice)}
                </span>
                <span className={`text-sm ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
                  {isPositive ? '↑' : '↓'}
                  {Math.abs(priceChange || 0).toFixed(2)}%
                </span>
              </div>
              <span className="text-sm text-gray-400">Current Price</span>
            </>
          ) : (
            <div className="text-xl font-bold text-gray-500 animate-pulse">
              Loading...
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
