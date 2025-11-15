import React, { useMemo } from 'react';
import { useCalendarContext } from './context/CalendarContext';
import { useGetEventsQuery } from '@store/services/calendar/eventService';
import { getMonthDays, getWeekDays, formatDate } from '../../utils/dateHelpers';
import { DAYS_OF_WEEK, VIEW_TYPES } from '../../constants/constants';
import { startOfMonth, endOfMonth } from 'date-fns';
import EventCell from './EventCell';
import WeekView from './WeekView';

const CalendarGrid = () => {
  const { 
    currentDate, 
    viewType, 
    openCreateModal, 
    selectedDepartment, 
    selectedEventTypes 
  } = useCalendarContext();

  const fromDate = formatDate(startOfMonth(currentDate));
  const toDate = formatDate(endOfMonth(currentDate));

  const { data: eventsResponse, isLoading } = useGetEventsQuery({
    from_date: fromDate,
    to_date: toDate,
    // event_type: selectedEventTypes.join(','),
  });

  const filteredEvents = useMemo(() => {
    if (!eventsResponse) return [];
    
    return eventsResponse.filter(event => {
      if (selectedDepartment !== 'all' && event.department !== selectedDepartment) {
        return false;
      }
      return selectedEventTypes.includes(event.event_type);
    });
  }, [eventsResponse, selectedDepartment, selectedEventTypes]);

  const monthDays = getMonthDays(currentDate);
  const weekDays = getWeekDays(currentDate);

  const handleCellClick = (date) => {
    openCreateModal(date);
  };

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-gray-500">Loading events...</div>
      </div>
    );
  }

  if (viewType === VIEW_TYPES.WEEK) {
    return (
      <WeekView 
        weekDays={weekDays} 
        events={filteredEvents}
        onCellClick={handleCellClick}
      />
    );
  }

  return (
    <div className="flex-1 p-6">
      <div className="grid grid-cols-7 gap-px bg-gray-200 border border-gray-200 mb-px">
        {DAYS_OF_WEEK.map(day => (
          <div
            key={day}
            className="bg-gray-50 px-4 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider"
          >
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-px bg-gray-200 border border-gray-200">
        {monthDays.map((day, index) => (
          <EventCell
            key={index}
            date={day}
            events={filteredEvents}
            currentDate={currentDate}
            onClick={handleCellClick}
          />
        ))}
      </div>
    </div>
  );
};

export default CalendarGrid;