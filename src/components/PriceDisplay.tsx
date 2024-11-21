interface PriceDisplayProps {
  currentPrice: number | null;
}

export default function PriceDisplay({ currentPrice }: PriceDisplayProps) {
  if (!currentPrice) return null;

  return (
    <div className="text-center mb-6">
      <p className="text-2xl font-semibold">
        Current Bitcoin Price:
        <span className="text-green-600 ml-2">
          ${currentPrice.toLocaleString()}
        </span>
      </p>
    </div>
  );
}
