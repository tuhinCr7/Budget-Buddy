import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const TrendChart = ({ data }) => {
  if (!data || data.length === 0) {
    return <div className="text-gray-500 text-center py-10">No data available for the last 6 months.</div>;
  }

  // Format labels from year and month
  const getMonthName = (monthNumber) => {
    const date = new Date();
    date.setMonth(monthNumber - 1);
    return date.toLocaleString('default', { month: 'short' });
  };

  const labels = data.map(item => `${getMonthName(item._id.month)} ${item._id.year}`);
  const totals = data.map(item => item.total);

  const chartData = {
    labels,
    datasets: [
      {
        label: 'Monthly Spending',
        data: totals,
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value) => '$' + value
        }
      }
    }
  };

  return (
    <div className="h-64 w-full relative">
      <Bar data={chartData} options={options} />
    </div>
  );
};

export default TrendChart;

