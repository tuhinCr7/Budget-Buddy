import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

const CategoryPieChart = ({ data }) => {
  if (!data || data.length === 0) {
    return <div className="text-gray-500 text-center py-10">No data available for categories.</div>;
  }

  // Define colors for categories
  const categoryColors = {
    Food: '#FF6384',
    Transport: '#36A2EB',
    Rent: '#FFCE56',
    Entertainment: '#4BC0C0',
    Utilities: '#9966FF',
    Other: '#C9CBCF'
  };

  const chartData = {
    labels: data.map(item => item._id),
    datasets: [
      {
        data: data.map(item => item.total),
        backgroundColor: data.map(item => categoryColors[item._id] || categoryColors.Other),
        hoverOffset: 4,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
      },
    },
  };

  return (
    <div className="h-64 w-full relative">
      <Pie data={chartData} options={options} />
    </div>
  );
};

export default CategoryPieChart;

