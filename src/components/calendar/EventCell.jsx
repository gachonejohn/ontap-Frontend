import React from 'react';
import { useCalendarContext } from './context/CalendarContext';
import { EVENT_TYPE_META } from '../../constants/constants';
import { isTodayDate, isCurrentMonth } from '../../utils/dateHelpers';

const EventCell = ({ date, events, currentDate, onClick }) => {
  const { openEditModal } = useCalendarContext();
  const isToday = isTodayDate(date);
  const isCurrentMonthDate = isCurrentMonth(date, currentDate);
  const dayNumber = date.getDate();

  const cellEvents = events.filter(event => {
    const eventDate = new Date(event.date);
    return eventDate.toDateString() === date.toDateString();
  });

  const handleEventClick = (e, event) => {
    e.stopPropagation();
    openEditModal(event);
  };

  return (
    <div
      onClick={() => onClick(date)}
      className={`min-h-[120px] p-2 border border-gray-200 bg-white cursor-pointer transition-colors hover:bg-gray-50 ${
        !isCurrentMonthDate ? 'bg-gray-50/50' : ''
      } ${isToday ? 'bg-blue-50 border-blue-200' : ''}`}
    >
      {/* Date number */}
      <div className="flex justify-center mb-1">
        {isToday ? (
          <div className="w-7 h-7 flex items-center justify-center bg-blue-600 text-white rounded-full text-sm font-semibold">
            {dayNumber}
          </div>
        ) : (
          <div
            className={`text-sm font-medium ${
              isCurrentMonthDate ? 'text-gray-900' : 'text-gray-400'
            }`}
          >
            {dayNumber}
          </div>
        )}
      </div>

      {/* Event previews */}
      <div className="space-y-1">
        {cellEvents.slice(0, 3).map((event, index) => {
          // Normalize event_type (in case backend sends lowercase or null)
          const key = event.event_type?.toUpperCase() || 'OTHER';
          const meta = EVENT_TYPE_META[key] || EVENT_TYPE_META.OTHER;

          return (
            <div
              key={event.id || index}
              className="px-2 py-1 rounded text-xs text-white truncate flex items-center gap-1"
              style={{ backgroundColor: meta.color }}
              title={`${event.title}${event.start_time ? ` at ${event.start_time}` : ''}`}
              onClick={(e) => handleEventClick(e, event)}
            >
              {/* <span>{meta.icon}</span> */}
              <span className="truncate">{event.title}</span>
            </div>
          );
        })}

        {cellEvents.length > 3 && (
          <div className="text-xs text-gray-500 px-2 hover:text-gray-700 cursor-pointer">
            +{cellEvents.length - 3} more
          </div>
        )}
      </div>
    </div>
  );
};

export default EventCell;
