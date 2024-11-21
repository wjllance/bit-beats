import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  ChartOptions,
  TooltipItem,
} from 'chart.js';
import { TimeframeOption } from '../../types';
import { usePriceHistory } from '../../hooks/usePriceHistory';
import { getMaxTicksLimit } from '../../utils/dateFormatter';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface MobileBitcoinChartProps {
  selectedTimeframe: TimeframeOption;
}

export default function MobileBitcoinChart({ selectedTimeframe }: MobileBitcoinChartProps): JSX.Element {
  const { priceData, isLoading, error } = usePriceHistory(selectedTimeframe);

  const options: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index' as const,
      intersect: false,
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: true,
        backgroundColor: 'rgba(17, 24, 39, 0.9)',
        titleColor: '#F59E0B',
        bodyColor: '#fff',
        borderColor: '#F59E0B',
        borderWidth: 1,
        padding: 8,
        displayColors: false,
        titleFont: {
          size: 12,
        },
        bodyFont: {
          size: 12,
        },
        callbacks: {
          title: (tooltipItems: TooltipItem<'line'>[]) => tooltipItems[0].label,
          label: (context: TooltipItem<'line'>) =>
            `$${context.parsed.y.toLocaleString('en-US', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}`,
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
          drawBorder: false,
        },
        ticks: {
          maxTicksLimit: getMaxTicksLimit(selectedTimeframe.days),
          color: '#9CA3AF',
          font: {
            size: 10,
          },
        },
      },
      y: {
        position: 'right' as const,
        grid: {
          color: 'rgba(75, 85, 99, 0.1)',
          drawBorder: false,
        },
        ticks: {
          color: '#9CA3AF',
          font: {
            size: 10,
          },
          callback: (value: number) =>
            '$' + value.toLocaleString('en-US', {
              minimumFractionDigits: 0,
              maximumFractionDigits: 0,
            }),
        },
      },
    },
  };

  const data = {
    labels: priceData.labels,
    datasets: [
      {
        data: priceData.prices,
        borderColor: '#F59E0B',
        backgroundColor: 'rgba(245, 158, 11, 0.1)',
        borderWidth: 1.5,
        fill: true,
        tension: 0.4,
        pointRadius: 0,
        pointHitRadius: 8,
        pointHoverRadius: 4,
        pointHoverBackgroundColor: '#F59E0B',
        pointHoverBorderColor: '#fff',
        pointHoverBorderWidth: 2,
      },
    ],
  };

  if (error) {
    return (
      <div className="flex items-center justify-center h-[200px] bg-gray-800/30 rounded-lg mx-4">
        <div className="flex flex-col items-center space-y-2 p-4 text-center">
          <span className="text-red-400 text-sm">{error}</span>
          <span className="text-gray-400 text-xs">Please try again later</span>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="relative h-[200px] w-full px-4">
        {isLoading ? (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-800/30 rounded-lg">
            <div className="flex flex-col items-center space-y-2">
              <div className="w-6 h-6 border-2 border-yellow-500/20 border-t-yellow-500/90 rounded-full animate-spin" />
              <span className="text-gray-400 text-sm">Loading chart...</span>
            </div>
          </div>
        ) : (
          <div className="h-full rounded-lg overflow-hidden bg-gray-800/30">
            <Line options={options} data={data} />
          </div>
        )}
      </div>
    </div>
  );
}
