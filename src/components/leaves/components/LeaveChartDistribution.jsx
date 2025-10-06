import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const LeaveDistributionChart = () => {
  const leaveTypes = ['Annual', 'Sick', 'Personal', 'Maternity', 'Emergency'];

  const greenValues = [80, 75, 60, 70, 80];
  const orangeValues = [40, 35, 30, 40, 20];

  const data = {
    labels: leaveTypes,
    datasets: [
      {
        label: 'Used',
        data: greenValues,
        backgroundColor: '#00B8A9',
        borderRadius: 6,
      },
      {
        label: 'Remaining',
        data: orangeValues,
        backgroundColor: '#FFA726',
        borderRadius: 6,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top',
        labels: {
          font: {
            size: 12,
            weight: 'bold',
          },
          usePointStyle: true,
        },
      },
      tooltip: {
        enabled: true,
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        stacked: false,
        categoryPercentage: 0.5, 
        barPercentage: 0.4,      
        ticks: {
          font: {
            size: 12,
            weight: '500',
          },
          maxRotation: 0,
          minRotation: 0,
          padding: 10,
        },
      },
      y: {
        beginAtZero: true,
        max: 100,
        ticks: {
          stepSize: 20,
          font: {
            size: 12,
          },
        },
        grid: {
          drawBorder: false,
          color: '#f3f3f3',
        },
      },
    },
  };

  return (
    <div style={{ height: '300px' }}>
      <Bar data={data} options={options} />
    </div>
  );
};

export default LeaveDistributionChart;

