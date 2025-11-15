import React from 'react';
import { useCalendarContext } from './context/CalendarContext';
import { formatDisplayDate, nextMonth, prevMonth } from '../../utils/dateHelpers';
import { VIEW_TYPES } from '../../constants/constants';
import { useGetDepartmentsQuery } from '@store/services/companies/companiesService';
import FilterSelect from '@components/common/FilterSelect';

const CalendarHeader = () => {
  const {
    currentDate,
    setCurrentDate,
    viewType,
    setViewType,
    selectedDepartment,
    setSelectedDepartment
  } = useCalendarContext();

  const handlePrevMonth = () => {
    setCurrentDate(prevMonth(currentDate));
  };

  const handleNextMonth = () => {
    setCurrentDate(nextMonth(currentDate));
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  const filters = {};

  const queryParams = {
    department: selectedDepartment !== 'all' ? selectedDepartment : undefined,
    ...filters,
  };

  const { data: departmentsData } = useGetDepartmentsQuery(
    {},
    {
      refetchOnMountOrArgChange: true,
    }
  );

  const departmentsOptions =
    departmentsData?.map((item) => ({
      value: item.id,
      label: `${item.name}`,
    })) || [];

  const handleDepartmentChange = (selectedOption) => {
    setSelectedDepartment(selectedOption ? selectedOption.value : 'all');
  };

  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 px-6 py-4 bg-white">
      {/* Left Section - Date Navigation */}
      <div className="flex items-center gap-3">
        <button
          onClick={handleToday}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
        >
          Today
        </button>
        
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrevMonth}
            className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Previous month"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          <button
            onClick={handleNextMonth}
            className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Next month"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
        
        <h2 className="text-xl font-semibold text-gray-900">
          {formatDisplayDate(currentDate)}
        </h2>
      </div>

      {/* Right Section - Filters and View Toggle */}
      <div className="flex items-center gap-3 w-full sm:w-auto">
        {/* Department Filter */}
        <FilterSelect
          options={departmentsOptions}
          value={
            departmentsOptions.find((option) => option.value === filters.department) || {
              value: '',
              label: 'All Departments',
            }
          }
          onChange={handleDepartmentChange}
          placeholder=""
          defaultLabel="All Departments"
        />

        {/* All Types Dropdown */}
        <select
          className="flex-1 sm:flex-none px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white"
        >
          <option value="all">All Types</option>
        </select>

        {/* View Toggle */}
        <div className="flex bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setViewType(VIEW_TYPES.MONTH)}
            className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${
              viewType === VIEW_TYPES.MONTH
                ? 'bg-teal-500 text-white shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Month
          </button>
          <button
            onClick={() => setViewType(VIEW_TYPES.WEEK)}
            className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${
              viewType === VIEW_TYPES.WEEK
                ? 'bg-teal-500 text-white shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Week
          </button>
        </div>
      </div>
    </div>
  );
};

export default CalendarHeader;