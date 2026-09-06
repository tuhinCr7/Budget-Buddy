import React, { useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Filler,
  Legend,
  LineController,
  BarController
} from 'chart.js';
import { Chart } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  LineController,
  BarController,
  Title,
  Tooltip,
  Filler,
  Legend
);

const TrendChart = ({ data }) => {
  const [viewType, setViewType] = useState('bar'); // 'bar' or 'line'

  if (!data || data.length === 0) {
    return <div className="text-ink/50 text-sm py-4">No trend data available.</div>;
  }

  const getMonthName = (monthNumber) => {
    const date = new Date();
    date.setMonth(monthNumber - 1);
    return date.toLocaleString('default', { month: 'short' });
  };

  const labels = data.map(item => `${getMonthName(item._id.month)}`);
  const totals = data.map(item => item.total);

  const chartData = {
    labels,
    datasets: [
      {
        label: 'Spent',
        data: totals,
        backgroundColor: 'var(--ink)',
        borderColor: 'var(--ink)',
        borderWidth: viewType === 'bar' ? 0 : 2,
        tension: 0.3,
        pointBackgroundColor: 'var(--paper)',
        pointBorderColor: 'var(--ink)',
        pointBorderWidth: 2,
        pointRadius: 4,
      },
    ],
  };

  const [tooltipData, setTooltipData] = useState({ opacity: 0, top: 0, left: 0, title: '', body: '' });

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        enabled: false,
        external: (context) => {
          const tooltipModel = context.tooltip;
          if (tooltipModel.opacity === 0) {
            setTooltipData(prev => ({ ...prev, opacity: 0 }));
            return;
          }
          const position = context.chart.canvas.getBoundingClientRect();
          const val = tooltipModel.dataPoints[0].parsed.y;

          setTooltipData({
            opacity: 1,
            left: position.left + tooltipModel.caretX,
            top: position.top + tooltipModel.caretY,
            title: tooltipModel.title[0],
            body: `৳${val.toFixed(2)}`
          });
        }
      }
    },
    scales: {
      x: {
        grid: { display: false, drawBorder: false },
        ticks: { font: { family: 'Inter', size: 11 }, color: 'var(--ink)' }
      },
      y: {
        border: { display: false },
        grid: { color: 'var(--line)', borderDash: [4, 4] },
        ticks: { 
          font: { family: 'IBM Plex Mono', size: 11 }, 
          color: 'var(--ink)',
          callback: (value) => `৳${value}` 
        }
      }
    }
  };

  return (
    <div className="w-full">
      <div className="flex justify-between items-end mb-4">
        <h3 className="text-sm font-semibold text-ink uppercase tracking-wider">6-Month Trend</h3>
        <div className="flex gap-2">
          <button 
            onClick={() => setViewType('bar')} 
            className={`text-xs font-semibold px-2 py-1 transition-colors ${viewType === 'bar' ? 'bg-ink text-paper' : 'text-ink/60 hover:text-ink'}`}
          >
            Bar
          </button>
          <button 
            onClick={() => setViewType('line')} 
            className={`text-xs font-semibold px-2 py-1 transition-colors ${viewType === 'line' ? 'bg-ink text-paper' : 'text-ink/60 hover:text-ink'}`}
          >
            Line
          </button>
        </div>
      </div>
      <div className="h-[250px] w-full relative">
        <Chart 
          type={viewType}
          data={chartData} 
          options={options} 
        />

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

export default TrendChart;
