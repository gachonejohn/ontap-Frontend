import React from "react";
import ReactApexChart from "react-apexcharts";
import ContentSpinner from "../../common/spinners/dataLoadingSpinner";
import { YearMonthCustomDate } from "@utils/dates";
import { FiArrowRight } from "react-icons/fi";

export default function AttendanceSummaryChart({ data, isLoading }) {
  if (isLoading) return <ContentSpinner />;

  if (!data || !data.chart_data) {
    return (
      <div className="flex justify-center items-center h-40 text-gray-500">
        No attendance data available
      </div>
    );
  }

  const chartData = data.chart_data || [];
  const summary = data.summary || {};
  const period = data.period || {};

  // Define consistent colors per label (frontend controlled)
  const colorMap = {
    Present: "#10B981",
    Late: "#F59E0B",
    Absent: "#EF4444",
    "On Leave": "#3B82F6",
  };

  const categories = chartData.map((item) => item.label);
  const colors = chartData.map((item) => colorMap[item.label] || "#6B7280");
  const series = [
    {
      name: "Days",
      data: chartData.map((item) => item.count),
    },
  ];

  const options = {
    chart: {
      type: "bar",
      toolbar: { show: false },
      fontFamily: "Outfit, sans-serif",
    },
    plotOptions: {
           bar: { borderRadius: 6, borderRadiusApplication: 'end', columnWidth: '35%' },

    },
    dataLabels: {
      enabled: false,
      style: { fontSize: "12px", fontWeight: "600" },
    },
    xaxis: {
      categories,
      labels: { style: { colors: "#6b7280" } },
      title: { text: "Status", style: { fontWeight: 500 } },
    },
    yaxis: {
      title: { text: "Days", style: { fontWeight: 500 } },
      min: 0,
      tickAmount: 4,
      labels: { style: { colors: "#6b7280" } },
    },
    colors,
    tooltip: {
      y: { formatter: (val) => `${val} days` },
    },
    legend: { show: false },
    grid: { strokeDashArray: 4 },
  };

  // Helper for summary display
  const summaryMetrics = [
    { key: "present", label: "Present", color: colorMap["Present"] },
    { key: "late", label: "Late", color: colorMap["Late"] },
    { key: "absent", label: "Absent", color: colorMap["Absent"] },
    { key: "on_leave", label: "On Leave", color: colorMap["On Leave"] },
  ];

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <div>
          {/* <h2 className="text-base font-semibold text-gray-800">
            Monthly Attendance Summary
          </h2> */}
          <div className="mt-4 flex items-center gap-3">
            <span className="text-sm text-gray-500">
              {period?.month || "Current Month"} &nbsp;
            </span>
            <span className="text-sm text-gray-500">
              ({YearMonthCustomDate(period?.start_date)}
            </span>
            <span>
              <FiArrowRight className="text-gray-400" />
            </span>
            <span className="text-sm text-gray-500">
              {YearMonthCustomDate(period?.end_date)})
            </span>
          </div>
        </div>
        <span className="text-sm text-gray-500">
          Total days: <strong>{period?.days}</strong>
        </span>
      </div>

      {/* Summary Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {summaryMetrics.map((metric) => {
          const value = summary[metric.key]?.count ?? 0;
          const percentage = summary[metric.key]?.percentage ?? 0;

          return (
            <div
              key={metric.key}
              className="flex flex-col items-center justify-center bg-gray-50 rounded-lg py-3 shadow-sm"
            >
              <span
                className="w-3 h-3 rounded-full mb-1"
                style={{ backgroundColor: metric.color }}
              ></span>
              <span className="text-sm text-gray-600">{metric.label}</span>
              <span className="text-lg font-semibold text-gray-900">
                {value}
              </span>
              <span className="text-xs text-gray-500">{percentage}%</span>
            </div>
          );
        })}
      </div>

      {/* Chart */}
      <ReactApexChart
        options={options}
        series={series}
        type="bar"
        height={320}
      />

      {/* Legend */}
      <div className="mt-4 flex flex-wrap gap-4 items-center justify-center">
        {chartData.map((item) => (
          <div
            key={item.label}
            className="flex items-center gap-2 text-sm text-gray-600"
          >
            <span
              className="w-3 h-3 rounded-full inline-block"
              style={{ backgroundColor: colorMap[item.label] }}
            />
            <span className="font-medium">{item.label}</span>
            <span className="text-gray-500">•</span>
            <span className="text-gray-700 font-semibold">{item.count}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
