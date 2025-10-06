import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
} from 'chart.js';

ChartJS.register(BarElement, CategoryScale, LinearScale);

const TaskCompletionChart = ({ data }) => {
  const chartData = {
    labels: data.map((d) => d.department),
    datasets: [
      {
        label: 'Completion %',
        data: data.map((d) => d.completion),
        backgroundColor: '#00b5ad',
        borderRadius: 6, 
        barPercentage: 0.9,      
        categoryPercentage: 0.8, 
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        grid: {
          display: false, 
        },
        border: {
          display: true, 
        },
        ticks: {
          font: {
            size: 12,
            weight: '500',
           

          },
          color: '#333',
        },
      },
      y: {
        beginAtZero: true,
        max: 100,
        grid: {
          display: false, 
        },
        border: {
          display: true, 
        },
        ticks: {
          stepSize: 20,
          font: {
            size: 12,
          },
          color: '#333',
         

        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: true,
      },
    },
  };

  return (
<div style={{ height: '250px', width: '300px' }}> 
  <Bar data={chartData} options={options} />
    </div>
  );
};

export default TaskCompletionChart;
