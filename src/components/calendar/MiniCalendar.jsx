import React from 'react';
import { useCalendarContext } from './context/CalendarContext';
import { 
  getMonthDays, 
  formatDisplayDate, 
  prevMonth, 
  nextMonth,
  isCurrentMonth,
  isTodayDate 
} from '../../utils/dateHelpers';

const MiniCalendar = () => {
  const { currentDate, setCurrentDate } = useCalendarContext();
  const monthDays = getMonthDays(currentDate);

  const handlePrevMonth = () => {
    setCurrentDate(prevMonth(currentDate));
  };

  const handleNextMonth = () => {
    setCurrentDate(nextMonth(currentDate));
  };

  const handleDateClick = (date) => {
    setCurrentDate(date);
  };

  // Group days into weeks
  const weeks = [];
  for (let i = 0; i < monthDays.length; i += 7) {
    weeks.push(monthDays.slice(i, i + 7));
  }

  return (
    <div className="bg-gray-50 rounded-lg p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <button
          onClick={handlePrevMonth}
          className="p-1 hover:bg-gray-200 rounded transition-colors"
          aria-label="Previous month"
        >
          <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        
        <span className="text-sm font-semibold text-gray-900">
          {formatDisplayDate(currentDate)}
        </span>
        
        <button
          onClick={handleNextMonth}
          className="p-1 hover:bg-gray-200 rounded transition-colors"
          aria-label="Next month"
        >
          <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Weekday Headers */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
          <div key={day} className="text-center text-xs font-semibold text-gray-500 py-1">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Days */}
      <div className="space-y-1">
        {weeks.map((week, weekIndex) => (
          <div key={weekIndex} className="grid grid-cols-7 gap-1">
            {week.map((day, dayIndex) => {
              const isToday = isTodayDate(day);
              const isCurrentMonthDay = isCurrentMonth(day, currentDate);
              
              return (
                <button
                  key={dayIndex}
                  onClick={() => handleDateClick(day)}
                  className={`
                    aspect-square flex items-center justify-center text-xs rounded-full transition-all
                    ${!isCurrentMonthDay ? 'text-gray-300' : 'text-gray-700 hover:bg-gray-200'}
                    ${isToday ? 'bg-blue-600 text-white hover:bg-blue-700 font-semibold' : ''}
                  `}
                  aria-label={`Select ${day.toDateString()}`}
                >
                  {day.getDate()}
                </button>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MiniCalendar;