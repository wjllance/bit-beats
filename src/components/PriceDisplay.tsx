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

  return (
    <div className="flex flex-col items-center justify-center space-y-2">
      <span className="price-label">Current Price</span>
      {currentPrice ? (
        <div className="price-value animate-glow">
          {formatPrice(currentPrice)}
        </div>
      ) : (
        <div className="price-value opacity-50">Loading...</div>
      )}
    </div>
  );
}
