interface PriceDisplayProps {
  currentPrice: number | null;
}

export default function PriceDisplay({ currentPrice }: PriceDisplayProps) {
  if (!currentPrice) return null;

  const priceChange = Math.random() > 0.5 ? 2.34 : -1.23; // Example price change (replace with real data)
  const isPositive = priceChange >= 0;

  return (
    <div className="card card-hover max-w-lg mx-auto animate-slide-up relative overflow-hidden group">
      {/* Decorative Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 via-transparent to-secondary-500/5" />
      <div className="absolute -right-16 -top-16 w-32 h-32 bg-primary-500/10 rounded-full blur-2xl group-hover:bg-primary-500/20 transition-all duration-700" />
      <div className="absolute -left-16 -bottom-16 w-32 h-32 bg-secondary-500/10 rounded-full blur-2xl group-hover:bg-secondary-500/20 transition-all duration-700" />

      <div className="relative flex flex-col items-center">
        {/* Title with Icon */}
        <div className="flex items-center space-x-2 mb-6">
          <svg className="w-6 h-6 text-primary-500" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm1-17.93c-4.242.277-7.653 3.688-7.93 7.93h7.93V4.07zM12 14v-2H4.07c.277 4.242 3.688 7.653 7.93 7.93V14zm2 7.93V14h7.93c-.277 4.242-3.688 7.653-7.93 7.93zM14 12V4.07c4.242.277 7.653 3.688 7.93 7.93H14z"/>
          </svg>
          <h2 className="text-xl font-semibold bg-gradient-to-r from-primary-600 to-primary-500 bg-clip-text text-transparent">
            Current Bitcoin Price
          </h2>
        </div>

        {/* Price Display */}
        <div className="flex flex-col items-center w-full mb-4">
          <div className="relative group-hover:scale-105 transition-transform duration-300">
            <p className="text-6xl font-bold tracking-tight mb-2 flex items-center justify-center">
              <span className="text-primary-500 mr-1 text-4xl">$</span>
              <span className="text-secondary-800 tabular-nums">
                {currentPrice.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </span>
            </p>
          </div>

          {/* Price Change and Update Time */}
          <div className="flex items-center space-x-3">
            <div className={`flex items-center px-3 py-1 rounded-full ${
              isPositive ? 'bg-primary-100 text-primary-700' : 'bg-red-100 text-red-700'
            }`}>
              <span className="text-sm font-semibold flex items-center">
                {isPositive ? (
                  <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                )}
                {Math.abs(priceChange)}%
              </span>
            </div>
            <div className="flex items-center text-sm text-secondary-500">
              <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Updated {new Date().toLocaleTimeString()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
