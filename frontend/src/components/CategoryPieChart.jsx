import React, { useRef, useState } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie, getElementAtEvent } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

const CategoryPieChart = ({ data, onCategoryClick, selectedCategory }) => {
  const chartRef = useRef();

  if (!data || data.length === 0) {
    return <div className="text-ink/50 text-sm py-4">No category data available.</div>;
  }

  // Exact hex colors matching our CSS variables to use in JS
  const categoryColors = {
    Food: '#0C3B2E',         // bottle-green
    Transport: '#1F5C46',    // bottle-green-light
    Rent: '#367A5E',         // custom green 1
    Entertainment: '#4F9B78',// custom green 2
    Utilities: '#6FB593',    // custom green 3
    Other: '#E4EDE8'         // bottle-green-pale
  };

  const chartData = {
    labels: data.map(item => item._id),
    datasets: [
      {
        data: data.map(item => item.total),
        backgroundColor: data.map(item => {
          // If a category is selected, dim others
          if (selectedCategory && selectedCategory !== item._id) {
            return 'var(--line)';
          }
          return categoryColors[item._id] || categoryColors.Other;
        }),
        borderWidth: 2,
        borderColor: 'var(--paper)',
        hoverOffset: 0,
      },
    ],
  };

  const [tooltipData, setTooltipData] = useState({ opacity: 0, top: 0, left: 0, title: '', body: '' });

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    onClick: (event) => {
      if (!chartRef.current) return;
      const elements = getElementAtEvent(chartRef.current, event);
      if (elements.length > 0) {
        const dataIndex = elements[0].index;
        const clickedCategory = chartData.labels[dataIndex];
        if (onCategoryClick) {
          // Toggle off if clicking already selected
          onCategoryClick(clickedCategory === selectedCategory ? '' : clickedCategory);
        }
      } else if (onCategoryClick) {
        onCategoryClick(''); // Click outside resets
        onCategoryClick('');
      }
    },
    plugins: {
      legend: {
        position: 'right',
        labels: {
          font: { family: 'Inter', size: 12 },
          color: 'var(--ink)',
          usePointStyle: true,
          boxWidth: 8
        },
      },
      tooltip: {
        enabled: false,
        external: (context) => {
          const tooltipModel = context.tooltip;
          if (tooltipModel.opacity === 0) {
            setTooltipData(prev => ({ ...prev, opacity: 0 }));
            return;
          }
          const position = context.chart.canvas.getBoundingClientRect();
          
          const dataIndex = tooltipModel.dataPoints[0].dataIndex;
          const val = chartData.datasets[0].data[dataIndex];
          const total = chartData.datasets[0].data.reduce((a, b) => a + b, 0);
          const percent = ((val / total) * 100).toFixed(1);

          setTooltipData({
            opacity: 1,
            left: position.left + tooltipModel.caretX,
            top: position.top + tooltipModel.caretY,
            title: tooltipModel.title[0] || chartData.labels[dataIndex],
            body: `৳${val.toFixed(2)} (${percent}%)`
          });
        }
      }
    },
  };

  return (
    <div className="w-full">
      <div className="flex justify-between items-end mb-4">
        <h3 className="text-sm font-semibold text-ink uppercase tracking-wider">By Category</h3>
        {selectedCategory && (
          <button 
            onClick={() => onCategoryClick('')}
            className="text-xs font-semibold text-bottle-green hover:underline"
          >
            Clear Filter
          </button>
        )}
      </div>
      <div className="h-48 w-full relative cursor-pointer">
        <Pie ref={chartRef} data={chartData} options={options} />
        
        {/* Custom HTML Tooltip */}
        <div 
          className="fixed pointer-events-none transition-all duration-100 z-50 bg-ink text-paper px-3 py-2 text-sm shadow-lg border border-line"
          style={{
            opacity: tooltipData.opacity,
            left: tooltipData.left + 15 + 'px',
            top: tooltipData.top + 'px',
            transform: 'translateY(-50%)'
          }}
        >
          <div className="font-semibold mb-1">{tooltipData.title}</div>
          <div className="font-mono-numbers">{tooltipData.body}</div>
        </div>
      </div>
    </div>
  );
};

export default CategoryPieChart;
