import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function DepartmentPayrollChart() {
  const data = {
    labels: ["Engineering", "Design", "Product", "Marketing", "Sales", "HR"],
    datasets: [
      {
        label: "Total Payroll",
        data: [60000, 30000, 45000, 50000, 55000, 40000],
        backgroundColor: "#10B981",
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false, // ✅ Needed
    plugins: {
      legend: {
        position: "bottom",
      },
      title: {
        display: false,
      },
    },
  };

  return (
    <div className="bg-white rounded-lg border border-gray-100 shadow p-4">
      <h2 className="text-md font-semibold text-gray-800 mb-4">Department Payroll Distribution</h2>
      <div className="h-64"> {/* ✅ Chart container height */}
        <Bar data={data} options={options} />
      </div>
    </div>
  );
}
