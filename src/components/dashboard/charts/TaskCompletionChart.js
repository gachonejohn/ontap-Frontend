import React, { useMemo, useState, useEffect } from 'react';
import ReactApexChart from 'react-apexcharts';
import { useGetTasksQuery } from '../../../store/services/tasks/tasksService';
import { useGetDepartmentsQuery } from '../../../store/services/companies/departmentsService';
import ContentSpinner from '../../common/spinners/dataLoadingSpinner';
import { PAGE_SIZE } from '@constants/constants';

const TaskCompletionChart = () => {
  const [allTasks, setAllTasks] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingAll, setIsLoadingAll] = useState(true);

  const { data: tasksData, isFetching } = useGetTasksQuery({
    page: currentPage,
    page_size: PAGE_SIZE,
  });

  const { data: departmentsData, isLoading: deptsLoading } = useGetDepartmentsQuery({});

  const departments = departmentsData || [];

  useEffect(() => {
    if (tasksData?.results) {
      if (currentPage === 1) {
        setAllTasks(tasksData.results);
      } else {
        setAllTasks(prev => {
          const newTasks = tasksData.results.filter(
            newTask => !prev.some(existingTask => existingTask.id === newTask.id)
          );
          return [...prev, ...newTasks];
        });
      }
      
      setHasMore(tasksData.next !== null);
      
      if (tasksData.next === null) {
        setIsLoadingAll(false);
      }
    }
  }, [tasksData, currentPage]);

  useEffect(() => {
    if (hasMore && !isFetching && currentPage === 1) {
      setIsLoadingAll(true);
    }
    
    if (hasMore && !isFetching && allTasks.length > 0) {
      setCurrentPage(prev => prev + 1);
    }
  }, [hasMore, isFetching, allTasks.length, currentPage]);

  const departmentStats = useMemo(() => {
    if (!allTasks.length || !departments.length) return [];

    return departments
      .map((dept) => {
        const deptTasks = allTasks.filter(
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
  }, [allTasks, departments]);

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

  if (isLoadingAll || deptsLoading) {
    return (
      <div className="flex items-center justify-center min-h-[300px] h-full">
        <ContentSpinner />
        {isFetching && allTasks.length > 0 && (
          <div className="ml-3 text-sm text-gray-500">
            Loading tasks... ({allTasks.length})
          </div>
        )}
      </div>
    );
  }

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

  return (
    <div className="w-full" style={{ height: '300px' }}>
      <ReactApexChart options={chartOptions} series={series} type="bar" height="100%" />
    </div>
  );
};

export default TaskCompletionChart;