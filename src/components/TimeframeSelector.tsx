import { TimeframeOption, timeframeOptions } from '../types';

interface TimeframeSelectorProps {
  selectedTimeframe: TimeframeOption;
  onTimeframeChange: (timeframe: TimeframeOption) => void;
}

export default function TimeframeSelector({
  selectedTimeframe,
  onTimeframeChange,
}: TimeframeSelectorProps) {
  return (
    <div className="flex justify-center mb-6">
      <div className="inline-flex rounded-md shadow-sm" role="group">
        {timeframeOptions.map((option) => (
          <button
            key={option.value}
            onClick={() => onTimeframeChange(option)}
            className={`px-4 py-2 text-sm font-medium border ${
              selectedTimeframe.value === option.value
                ? 'bg-blue-500 text-white border-blue-600'
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
            } ${
              option === timeframeOptions[0]
                ? 'rounded-l-lg'
                : option === timeframeOptions[timeframeOptions.length - 1]
                ? 'rounded-r-lg'
                : ''
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}
