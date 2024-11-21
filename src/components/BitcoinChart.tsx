import { Line } from 'react-chartjs-2';
import { PriceData, TimeframeOption } from '../types';
import { getMaxTicksLimit } from '../utils/dateFormatter';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
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
  const chartData = {
    labels: priceData.labels,
    datasets: [
      {
        label: 'Bitcoin Price (USD)',
        data: priceData.prices,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: `Bitcoin Price (Last ${selectedTimeframe.label})`,
      },
    },
    scales: {
      x: {
        ticks: {
          maxTicksLimit: getMaxTicksLimit(selectedTimeframe.days),
        },
      },
    },
  };

  if (isLoading) {
    return (
      <div className="text-center py-8">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"></div>
        <p className="mt-2">Loading price data...</p>
      </div>
    );
  }

  if (priceData.prices.length === 0) {
    return <p className="text-center">No price data available</p>;
  }

  return <Line data={chartData} options={chartOptions} />;
}
