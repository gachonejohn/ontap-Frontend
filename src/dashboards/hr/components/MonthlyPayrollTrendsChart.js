import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function MonthlyPayrollTrends() {
  const data = {
    labels: ["Aug", "Sep", "Oct", "Nov", "Dec"],
    datasets: [
      {
        label: "Payroll Total",
        data: [7000, 7200, 7400, 7300, 7500],
        borderColor: "#1C64F2",
        backgroundColor: "#1C64F2",
        tension: 0.4,
      },
      {
        label: "Overtime",
        data: [500, 600, 550, 580, 620],
        borderColor: "#16BDCA",
        backgroundColor: "#16BDCA",
        tension: 0.4,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "top" },
      title: { display: false },
    },
  };

  return (
    <div className="bg-white rounded-lg border border-gray-100 shadow p-4">
      <h2 className="text-md font-semibold text-gray-800 mb-4">Monthly Payroll Trends</h2>
      <div className="h-64"> 
        <Line data={data} options={options} />
      </div>
    </div>
  );
}

