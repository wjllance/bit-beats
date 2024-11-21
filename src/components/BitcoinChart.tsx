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
  Filler,
} from 'chart.js';

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
  const gradientFill = (context: any) => {
    if (!context) return null;
    const chart = context.chart;
    const {ctx, chartArea} = chart;
    if (!chartArea) return null;

    const gradient = ctx.createLinearGradient(0, chartArea.bottom, 0, chartArea.top);
    gradient.addColorStop(0, 'rgba(22, 163, 74, 0)');
    gradient.addColorStop(1, 'rgba(22, 163, 74, 0.2)');
    return gradient;
  };

  const chartData = {
    labels: priceData.labels,
    datasets: [
      {
        label: 'Bitcoin Price (USD)',
        data: priceData.prices,
        borderColor: '#16a34a',
        backgroundColor: gradientFill,
        borderWidth: 2,
        tension: 0.4,
        fill: true,
        pointRadius: 0,
        pointHoverRadius: 6,
        pointHoverBackgroundColor: '#16a34a',
        pointHoverBorderColor: '#ffffff',
        pointHoverBorderWidth: 2,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      intersect: false,
      mode: 'index' as const,
    },
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: `Bitcoin Price (Last ${selectedTimeframe.label})`,
        color: '#1e293b',
        font: {
          size: 16,
          weight: '500',
          family: 'system-ui',
        },
        padding: 20,
      },
      tooltip: {
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        titleColor: '#0f172a',
        bodyColor: '#334155',
        borderColor: '#e2e8f0',
        borderWidth: 1,
        padding: 12,
        displayColors: false,
        titleFont: {
          size: 14,
          weight: '600',
          family: 'system-ui',
        },
        bodyFont: {
          size: 14,
          family: 'system-ui',
        },
        callbacks: {
          label: (context: any) => {
            return `$${context.parsed.y.toLocaleString(undefined, {
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
        },
        ticks: {
          maxTicksLimit: getMaxTicksLimit(selectedTimeframe.days),
          color: '#64748b',
          font: {
            size: 12,
            family: 'system-ui',
          },
        },
        border: {
          display: false,
        },
      },
      y: {
        grid: {
          color: 'rgba(203, 213, 225, 0.4)',
          drawBorder: false,
        },
        ticks: {
          color: '#64748b',
          font: {
            size: 12,
            family: 'system-ui',
          },
          callback: (value: any) => {
            return `$${value.toLocaleString()}`;
          },
        },
        border: {
          display: false,
        },
      },
    },
  };

  if (isLoading) {
    return (
      <div className="chart-container min-h-[400px] flex items-center justify-center animate-fade-in">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-10 w-10 border-4 border-primary-500/20 border-l-primary-500"></div>
          <p className="mt-4 text-secondary-600 font-medium">Loading price data...</p>
        </div>
      </div>
    );
  }

  if (priceData.prices.length === 0) {
    return (
      <div className="chart-container min-h-[400px] flex items-center justify-center animate-fade-in">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-secondary-100 mb-4">
            <svg className="w-8 h-8 text-secondary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-secondary-600 font-medium">No price data available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="chart-container animate-scale-in">
      <div className="h-[400px]">
        <Line data={chartData} options={chartOptions} />
      </div>
    </div>
  );
}
