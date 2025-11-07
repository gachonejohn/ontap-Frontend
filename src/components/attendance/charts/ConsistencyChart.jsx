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
      parentHeightOffset: 0,
    },
    plotOptions: {
      bar: {
        borderRadius: 6,
        borderRadiusApplication: "end",
        columnWidth: "25%",
        distributed: true, 
      },
    },
    dataLabels: {
      enabled: false,
    },
    xaxis: {
      categories,
      labels: { 
        style: { colors: "#6b7280" },
        trim: true
      },
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
    grid: { 
      strokeDashArray: 4,
      padding: {
        left: 0,
        right: 0
      }
    }
  };

  const summaryMetrics = [
    { key: "present", label: "Present", color: colorMap["Present"] },
    { key: "late", label: "Late", color: colorMap["Late"] },
    { key: "absent", label: "Absent", color: colorMap["Absent"] },
    { key: "on_leave", label: "On Leave", color: colorMap["On Leave"] },
  ];

  return (
    <div className="w-full max-w-full">
   
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-3">
        <div className="min-w-0 flex-shrink">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm text-gray-500 whitespace-nowrap">
              {period?.month || "Current Month"}
            </span>
            <span className="text-sm text-gray-500 whitespace-nowrap">
              ({YearMonthCustomDate(period?.start_date)}
            </span>
            <span>
              <FiArrowRight className="text-gray-400 flex-shrink-0" />
            </span>
            <span className="text-sm text-gray-500 whitespace-nowrap">
              {YearMonthCustomDate(period?.end_date)})
            </span>
          </div>
        </div>
        <span className="text-sm text-gray-500 whitespace-nowrap flex-shrink-0">
          Total days: <strong>{period?.days}</strong>
        </span>
      </div>

      <div className="w-full flex justify-center mb-6 overflow-x-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 min-w-0">
          {summaryMetrics.map((metric) => {
            const value = summary[metric.key]?.count ?? 0;
            const percentage = summary[metric.key]?.percentage ?? 0;

            return (
              <div
                key={metric.key}
                className="flex flex-col p-2 items-center justify-center bg-white/80 border border-gray-100 backdrop-blur-sm rounded-lg py-3 shadow-sm min-w-0"
              >
                <span
                  className="w-3 h-3 rounded-full mb-1 flex-shrink-0"
                  style={{ backgroundColor: metric.color }}
                />
                <span className="text-sm text-gray-600 truncate w-full text-center px-1">{metric.label}</span>
                <span className="text-lg font-semibold text-gray-900">{value}</span>
                <span className="text-xs text-gray-500">{percentage}%</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Chart with strict overflow prevention */}
      <div className="w-full overflow-hidden" style={{ maxWidth: '100%' }}>
        <div style={{ width: '100%', minWidth: 0 }}>
          <ReactApexChart
            options={options}
            series={series}
            type="bar"
            height={250}
          />
        </div>
      </div>

      {/* Legend */}
      <div className="mt-4 flex flex-wrap gap-4 items-center justify-center">
        {chartData.map((item) => (
          <div
            key={item.label}
            className="flex items-center gap-2 text-sm text-gray-600"
          >
            <span
              className="w-3 h-3 rounded-full inline-block flex-shrink-0"
              style={{ backgroundColor: colorMap[item.label] }}
            />
            <span className="font-medium whitespace-nowrap">{item.label}</span>
            <span className="text-gray-500">•</span>
            <span className="text-gray-700 font-semibold">{item.count}</span>
          </div>
        ))}
      </div>
    </div>
  );
}