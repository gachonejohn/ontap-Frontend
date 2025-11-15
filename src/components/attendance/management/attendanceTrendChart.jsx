import React from 'react';
import ReactApexChart from 'react-apexcharts';
import ContentSpinner from '../../common/spinners/dataLoadingSpinner';

export default function CompanyAttendanceTrendsChart({ data = {}, isLoading }) {

  const attendanceData = data.data || [];

  
  const categories = attendanceData.map((item) => `${item.month} ${item.year}`);


  const series = [
    {
      name: data.label || 'Attendance',
      data: attendanceData.map((item) => item.present),
    },
  ];

  const options = {
    chart: {
      type: 'line',
      fontFamily: 'Outfit, sans-serif',
      toolbar: { show: false },
      zoom: { enabled: false },
    },
    dataLabels: { enabled: false },
    stroke: { curve: 'smooth', width: 3 },
    xaxis: {
      categories,
      title: { text: 'Month' },
      labels: { rotate: -45 },
    },
    yaxis: {
      title: { text: 'Present' },
      min: 0,
      labels: { formatter: (val) => Math.round(val) },
    },
    colors: ['#17AE9E'],
    markers: { size: 4 },
    tooltip: { y: { formatter: (val) => `${val} Present` } },
    legend: { position: 'top', horizontalAlign: 'right' },
    grid: { borderColor: '#f3f4f6', row: { opacity: 0.5 } },
  };

  return (
    // <div className="bg-white rounded-xl border shadow-sm p-6 min-h-[300px] h-full">
    <div className="bg-white p-6  min-h-[250px] h-full">
      {isLoading ? (
        <ContentSpinner />
      ) : (
        <ReactApexChart options={options} series={series} type="line" height={250} />
      )}
    </div>
  );
}
