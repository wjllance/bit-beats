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
    <div className="flex justify-center gap-2 mb-8 animate-fade-in">
      <div className="timeframe-group inline-flex" role="group">
        {timeframeOptions.map((option, index) => (
          <button
            key={option.value}
            onClick={() => onTimeframeChange(option)}
            className={`
              relative
              ${index === 0 ? 'rounded-l-lg' : ''}
              ${index === timeframeOptions.length - 1 ? 'rounded-r-lg' : ''}
              ${
                selectedTimeframe.value === option.value
                  ? 'btn-timeframe-active'
                  : 'btn-timeframe'
              }
              ${index > 0 ? '-ml-px' : ''}
            `}
          >
            {option.label}
            {selectedTimeframe.value === option.value && (
              <span className="absolute inset-0 rounded-lg ring-1 ring-white/50" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
