import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const TrainingProgressChart = ({ data, onSegmentClick }) => {
  const chartData = {
    labels: data.map((d) => d.label),
    datasets: [
      {
        data: data.map((d) => d.value),
        backgroundColor: data.map((d) => d.color),
        borderWidth: 1,
      },
    ],
  };

  const options = {
    cutout: '70%',
    plugins: {
      legend: {
        display: false,
      },
    },
    onClick: (event, elements) => {
      if (elements.length > 0 && onSegmentClick) {
        const index = elements[0].index;
        const segment = data[index];
        onSegmentClick(segment); 
      }
    },
  };

  return (
    <div className="w-40 h-40">
    <div className="flex justify-center items-center h-full">
      <Doughnut data={chartData} options={options} />
    </div>
    </div>
  );
};

export default TrainingProgressChart;
