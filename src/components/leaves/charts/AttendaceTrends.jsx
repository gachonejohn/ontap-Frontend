import React from "react";
import ReactApexChart from "react-apexcharts";
import ContentSpinner from "../../common/spinners/dataLoadingSpinner";

export default function AttendanceTrendsChart({ data = [], isLoading }) {
 
  const categories = data.length > 0 ? data[0].dates : [];

 
  const series = data.map((dept) => ({
    name: dept.label,
    data: dept.data,
  }));

  const options = {
    chart: {
      type: "area", 
      fontFamily: "Outfit, sans-serif",
      toolbar: { show: false },
    },
    dataLabels: { enabled: false },
    stroke: {
      curve: "smooth",
      width: 3,
    },
    xaxis: {
      categories: categories,
      title: { text: "Month" },
    },
    yaxis: {
      title: { text: "Attendance" },
      min: 0,
      max: 100,
    },
    colors: ["#ef4444", "#3b82f6", "#10b981"], 
    legend: { position: "top" },
    tooltip: {
      y: {
        formatter: (val) => val, 
      },
    },
  };

  return (
    <div className="bg-white rounded-xl border shadow-md p-6 min-h-[300px]">
      <h2 className="text-gray-700 font-semibold text-lg mb-4">
        Attendance Trends
      </h2>

      {isLoading ? (
        <ContentSpinner />
      ) : (
        <ReactApexChart
          options={options}
          series={series}
          type="area" // change to "line" for line chart
          height={300}
        />
      )}
    </div>
  );
}
