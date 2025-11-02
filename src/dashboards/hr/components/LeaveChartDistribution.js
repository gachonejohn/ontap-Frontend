import React from 'react';
import ReactApexChart from 'react-apexcharts';

const LeaveDistributionChart = () => {
  const leaveTypes = ['Annual', 'Sick', 'Personal', 'Maternity', 'Emergency'];
  const greenValues = [80, 75, 60, 70, 80];
  const orangeValues = [40, 35, 30, 40, 20];

  const series = [
    {
      name: 'Used',
      data: greenValues,
    },
    {
      name: 'Remaining',
      data: orangeValues,
    },
  ];

  const options = {
    chart: {
      type: 'bar',
      stacked: false,
      toolbar: { show: false },
      fontFamily: 'Outfit, sans-serif',
    },
    plotOptions: {
      bar: { borderRadius: 6, borderRadiusApplication: 'end', columnWidth: '65%' },
    },
    dataLabels: { enabled: false },
    xaxis: {
      categories: leaveTypes,
      labels: {
        style: { fontSize: '12px', fontWeight: 500 },
      },
    },
    yaxis: {
      max: 100,
      min: 0,
      tickAmount: 5,
      labels: { style: { fontSize: '12px' } },
      title: { text: 'Percentage' },
    },
    colors: ['#00B8A9', '#FFA726'],
    legend: {
      position: 'top',
      labels: { useSeriesColors: true },
    },
    tooltip: {
      y: {
        formatter: (val) => `${val}%`,
      },
    },
  };

  return (
    <div className="bg-white rounded-xl shadow-md border p-6 min-h-[300px]">
      <h2 className="text-md font-semibold text-gray-800 mb-4">Leave Type Distribution</h2>
      <ReactApexChart options={options} series={series} type="bar" height={300} />
    </div>
  );
};

export default LeaveDistributionChart;
