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
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { PriceData, TimeframeOption } from '../types';
import { getMaxTicksLimit } from '../utils/dateFormatter';

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

interface BitcoinChartProps {
  priceData: PriceData;
  selectedTimeframe: TimeframeOption;
  isLoading: boolean;
}

export default function BitcoinChart({
  priceData,
  selectedTimeframe,
  isLoading,
}: BitcoinChartProps) {
  const options = {
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
        backgroundColor: 'rgba(17, 24, 39, 0.9)',
        titleColor: '#F59E0B',
        bodyColor: '#fff',
        borderColor: '#F59E0B',
        borderWidth: 1,
        padding: 12,
        displayColors: false,
        callbacks: {
          title: (tooltipItems: any) => {
            return tooltipItems[0].label;
          },
          label: (context: any) => {
            return `$${context.parsed.y.toLocaleString('en-US', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}`;
          },
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
          callback: (value: any) => {
            return '$' + value.toLocaleString('en-US', {
              minimumFractionDigits: 0,
              maximumFractionDigits: 0,
            });
          },
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
        borderWidth: 2,
        fill: true,
        tension: 0.4,
        pointRadius: 0,
        pointHitRadius: 10,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: '#F59E0B',
        pointHoverBorderColor: '#fff',
        pointHoverBorderWidth: 2,
      },
    ],
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-yellow-500">Price Chart</h2>
        {isLoading && (
          <span className="text-sm text-gray-400 animate-pulse">Updating...</span>
        )}
      </div>
      <div className="relative h-[400px] w-full">
        {priceData.labels.length > 0 ? (
          <Line options={options} data={data} />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-gray-400">Loading chart data...</span>
          </div>
        )}
      </div>
    </div>
  );
}
