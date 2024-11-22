'use client';

import { TimeframeOption } from '../../types';

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

export default function MobileTimeframeSelector({
  selectedTimeframe,
  onTimeframeChange,
}: TimeframeSelectorProps) {
  return (
    <div className="flex justify-center items-center space-x-1.5 py-2">
      {timeframeOptions.map((timeframe) => (
        <button
          key={timeframe.label}
          onClick={() => onTimeframeChange(timeframe)}
          className={`px-2.5 py-1 text-xs font-medium rounded-full transition-all duration-200
            ${timeframe.label === selectedTimeframe?.label
              ? 'bg-yellow-500/90 text-gray-900'
              : 'bg-gray-800/50 text-gray-400 hover:bg-gray-800/70 hover:text-gray-300'
            }
          `}
        >
          {timeframe.label}
        </button>
      ))}
    </div>
  );
}
