import React from 'react';
import { Line } from 'react-chartjs-2';
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

const AttendanceTrendsChart = ({ dataPoints }) => {
  const months = ['Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  const chartData = {
    labels: months,
    datasets: [
      {
        label: 'Engineering',
        data: dataPoints.engineering,
        borderColor: 'red',
        backgroundColor: 'red',
        tension: 0.4,
        fill: false,
      },
      {
        label: 'Design',
        data: dataPoints.design,
        borderColor: 'blue',
        backgroundColor: 'blue',
        tension: 0.4,
        fill: false,
      },
      {
        label: 'Product',
        data: dataPoints.product,
        borderColor: 'green',
        backgroundColor: 'green',
        tension: 0.4,
        fill: false,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
      },
    },
  };

  return <Line data={chartData} options={options} />;
};

export default AttendanceTrendsChart;
