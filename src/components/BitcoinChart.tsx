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
        backgroundColor: 'rgba(23, 36, 64, 0.9)',
        titleColor: '#f7931a',
        bodyColor: '#fff',
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
        padding: 12,
        displayColors: false,
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          maxTicksLimit: getMaxTicksLimit(selectedTimeframe.days),
          color: '#9ca3af',
          font: {
            size: 12,
          },
        },
      },
      y: {
        grid: {
          color: 'rgba(255, 255, 255, 0.05)',
        },
        ticks: {
          color: '#9ca3af',
          font: {
            size: 12,
          },
          callback: (value: number) => {
            return new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: 'USD',
              minimumFractionDigits: 0,
              maximumFractionDigits: 0,
            }).format(value);
          },
        },
      },
    },
  };

  const data = {
    labels: priceData.labels,
    datasets: [
      {
        label: 'Bitcoin Price',
        data: priceData.prices,
        borderColor: '#f7931a',
        backgroundColor: 'rgba(247, 147, 26, 0.1)',
        borderWidth: 2,
        fill: true,
        tension: 0.4,
        pointRadius: 0,
        pointHitRadius: 10,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: '#f7931a',
        pointHoverBorderColor: '#fff',
        pointHoverBorderWidth: 2,
      },
    ],
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[400px] text-gray-400">
        Loading chart data...
      </div>
    );
  }

  if (priceData.prices.length === 0) {
    return (
      <div className="flex items-center justify-center h-[400px] text-gray-400">
        No price data available
      </div>
    );
  }

  return (
    <div className="relative h-[400px]">
      <div className="crypto-grid" />
      <Line options={options} data={data} />
    </div>
  );
}
