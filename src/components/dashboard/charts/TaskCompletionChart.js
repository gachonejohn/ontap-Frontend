import React, { useMemo } from 'react';
import ReactApexChart from 'react-apexcharts';
import { useGetTasksQuery } from '../../../store/services/tasks/tasksService';
import { useGetDepartmentsQuery } from '../../../store/services/companies/departmentsService';
import ContentSpinner from '../../common/spinners/dataLoadingSpinner';

const TaskCompletionChart = () => {
  // Fetch all tasks
  const { data: tasksData, isLoading: tasksLoading } = useGetTasksQuery({
    page_size: 1000,
  });

  // Fetch departments
  const { data: departmentsData, isLoading: deptsLoading } = useGetDepartmentsQuery({});

  const tasks = tasksData?.results || [];
  const departments = departmentsData || [];

  // Calculate completion percentage per department
  const departmentStats = useMemo(() => {
    if (!tasks.length || !departments.length) return [];

    return departments
      .map((dept) => {
        const deptTasks = tasks.filter(
          (task) => task.department === dept.id || task.department_name === dept.name
        );
        const completedTasks = deptTasks.filter((task) => task.status === 'COMPLETED').length;
        const completionRate =
          deptTasks.length > 0 ? Math.round((completedTasks / deptTasks.length) * 100) : 0;

        return {
          department: dept.name,
          completion: completionRate,
          totalTasks: deptTasks.length,
          completedTasks: completedTasks,
        };
      })
      .filter((dept) => dept.totalTasks > 0);
  }, [tasks, departments]);

  // ApexCharts configuration
  const chartOptions = {
    chart: {
      type: 'bar',
      fontFamily: 'Inter, sans-serif',
      toolbar: { show: false },
      animations: { enabled: true, easing: 'easeinout', speed: 800 },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '60%',
        borderRadius: 6,
        dataLabels: { position: 'top' },
      },
    },
    dataLabels: {
      enabled: true,
      formatter: (val) => `${val}%`,
      offsetY: -20,
      style: { fontSize: '12px', colors: ['#333'], fontWeight: 600 },
    },
    colors: ['#14b8a6'],
    xaxis: {
      categories: departmentStats.map((d) => d.department),
      labels: {
        style: { fontSize: '12px', fontWeight: 500, colors: '#333' },
      },
      axisBorder: { show: true, color: '#e5e7eb' },
      axisTicks: { show: false },
    },
    yaxis: {
      min: 0,
      max: 100,
      tickAmount: 5,
      labels: {
        formatter: (val) => `${val}%`,
        style: { fontSize: '12px', colors: '#333' },
      },
      axisBorder: { show: true, color: '#e5e7eb' },
    },
    grid: { show: false },
    tooltip: {
      enabled: true,
      y: {
        formatter: (val, { dataPointIndex }) => {
          const dept = departmentStats[dataPointIndex];
          return `${val}% (${dept.completedTasks}/${dept.totalTasks} tasks completed)`;
        },
      },
      style: { fontSize: '12px' },
    },
    legend: { show: false },
  };

  const series = [
    {
      name: 'Completion Rate',
      data: departmentStats.map((d) => d.completion),
    },
  ];

  // Loading State
  if (tasksLoading || deptsLoading) {
    return (
      <div className="flex items-center justify-center min-h-[300px] h-full">
        <ContentSpinner />
      </div>
    );
  }

  // No data
  if (departmentStats.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[300px] h-full">
        <div className="text-center text-gray-500">
          <p className="text-lg font-medium mb-2">No Task Data Available</p>
          <p className="text-sm">
            Tasks will appear here once they are created and assigned to departments.
          </p>
        </div>
      </div>
    );
  }

  // Render chart
  return (
    <div className="w-full" style={{ height: '300px' }}>
      <ReactApexChart options={chartOptions} series={series} type="bar" height="100%" />
    </div>
  );
};

export default TaskCompletionChart;
