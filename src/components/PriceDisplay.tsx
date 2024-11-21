interface PriceDisplayProps {
  currentPrice: number | null;
}

export default function PriceDisplay({ currentPrice }: PriceDisplayProps) {
  if (!currentPrice) return null;

  const priceChange = Math.random() > 0.5 ? 2.34 : -1.23; // Example price change (replace with real data)

  return (
    <div className="card card-hover mb-8 max-w-lg mx-auto animate-slide-up">
      <div className="flex flex-col items-center">
        <h2 className="text-lg font-medium text-secondary-600 mb-3">
          Current Bitcoin Price
        </h2>
        <div className="relative w-full">
          <div className="absolute inset-0 bg-gradient-to-r from-primary-500/10 to-transparent rounded-lg" />
          <div className="relative flex flex-col items-center py-4">
            <p className="text-5xl font-bold tracking-tight mb-2">
              <span className="text-primary-500">$</span>
              <span className="text-secondary-800">
                {currentPrice.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </span>
            </p>
            <div className="flex items-center space-x-2">
              <span className={`text-sm font-medium ${
                priceChange >= 0 ? 'text-primary-500' : 'text-red-500'
              }`}>
                {priceChange >= 0 ? '↑' : '↓'} {Math.abs(priceChange)}%
              </span>
              <span className="text-secondary-400">•</span>
              <span className="text-sm text-secondary-500">
                Last updated: {new Date().toLocaleTimeString()}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
