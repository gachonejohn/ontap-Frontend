import React, { useState } from "react";
import ReactApexChart from "react-apexcharts";
import Select from "react-select";
import ContentSpinner from "../../common/spinners/dataLoadingSpinner";

export default function AttendanceTrendsChart({ data = [], isLoading }) {
  const [selectedDept, setSelectedDept] = useState(null);

  const baseColors = ["#ef4444", "#3b82f6", "#10b981", "#f59e0b", "#8b5cf6"];

  const categories = data.length > 0 ? data[0].dates : [];

  const departmentOptions = data.map((dept, index) => ({
    value: dept.label,
    label: dept.label,
    color: baseColors[index % baseColors.length],
  }));

  const filteredSeries = selectedDept
    ? data
        .filter((dept) => dept.label === selectedDept.value)
        .map((dept) => ({
          name: dept.label,
          data: dept.data,
        }))
    : data.map((dept) => ({
        name: dept.label,
        data: dept.data,
      }));

  const selectedColor = selectedDept
    ? [selectedDept.color]
    : departmentOptions.map((dept) => dept.color);

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
      title: { text: "Weekday" },
    },
    yaxis: {
      title: { text: "Attendance" },
      min: 0,
      max: 100,
    },
    colors: selectedColor,
    legend: { show: false },
    tooltip: {
      y: {
        formatter: (val) => val,
      },
    },
  };

  return (
    <div className="bg-white rounded-xl border shadow-sm p-6 min-h-[300px] h-full">
      <div className="flex justify-between items-center mb-4 gap-4">
        <h2 className="text-gray-700 font-semibold text-lg">
          Attendance Trends
        </h2>
      </div>
      <div className="flex items-center gap-3 mb-4 justify-end">
        <div className=" md:min-w-[40%] w-auto">
          <Select
            options={departmentOptions}
            value={selectedDept}
            onChange={(option) => setSelectedDept(option)}
            placeholder="Select Department..."
            menuPortalTarget={document.body}
            menuPlacement="auto"
            isClearable
            styles={{
              menuPortal: (base) => ({ ...base, zIndex: 9999 }),
              control: (base) => ({
                ...base,
                minHeight: "34px",
                height: "34px",
                minWidth: "40px",
                borderColor: "#d1d5db",
                boxShadow: "none",
                cursor: "pointer",
                "&:hover": { borderColor: "#9ca3af" },
              }),
              option: (base, state) => ({
                ...base,
                fontSize: "0.875rem",
                color: state.isSelected ? "#ffffff" : "#333333",
                cursor: "pointer",
                backgroundColor: state.isSelected
                  ? "#4f46e5"
                  : state.isFocused
                  ? "#e5e7eb"
                  : "#ffffff",
                "&:hover": {
                  backgroundColor: "#e5e7eb",
                },
                padding: "8px 12px",
              }),
              valueContainer: (base) => ({
                ...base,
                padding: "0 8px",
              }),
              indicatorsContainer: (base) => ({
                ...base,
                height: "34px",
              }),
              dropdownIndicator: (base) => ({
                ...base,
                padding: "0 6px",
              }),
              indicatorSeparator: () => ({
                display: "none",
              }),
            }}
          />
        </div>
      </div>

      {isLoading ? (
        <ContentSpinner />
      ) : (
        <ReactApexChart
          options={options}
          series={filteredSeries}
          type="area"
          height={300}
        />
      )}
    </div>
  );
}
