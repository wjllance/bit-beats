import { TimeframeOption } from '../types';

interface TimeframeSelectorProps {
  selectedTimeframe: TimeframeOption;
  onTimeframeChange: (timeframe: TimeframeOption) => void;
}

export const timeframeOptions: TimeframeOption[] = [
  { label: '24h', days: 1 },
  { label: '7d', days: 7 },
  { label: '30d', days: 30 },
  { label: '90d', days: 90 },
  { label: '1y', days: 365 },
];

export default function TimeframeSelector({
  selectedTimeframe,
  onTimeframeChange,
}: TimeframeSelectorProps) {
  return (
    <div className="inline-flex bg-gray-900/50 rounded-lg p-1 gap-1">
      {timeframeOptions.map((timeframe) => (
        <button
          key={timeframe.label}
          onClick={() => onTimeframeChange(timeframe)}
          className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all duration-200 ${
            timeframe.label === selectedTimeframe?.label
              ? 'bg-yellow-500 text-gray-900 shadow-lg'
              : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800'
          }`}
        >
          {timeframe.label.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
