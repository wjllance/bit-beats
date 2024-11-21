import { TimeframeOption } from '../types';

interface TimeframeSelectorProps {
  selectedTimeframe: TimeframeOption;
  onTimeframeChange: (timeframe: TimeframeOption) => void;
}

const timeframeOptions: TimeframeOption[] = [
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
    <div className="timeframe-container">
      {timeframeOptions.map((timeframe) => (
        <button
          key={timeframe.label}
          onClick={() => onTimeframeChange(timeframe)}
          className={`timeframe-button ${
            timeframe.label === selectedTimeframe?.label ? 'active' : ''
          }`}
        >
          {timeframe.label}
        </button>
      ))}
    </div>
  );
}
