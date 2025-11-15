import React from 'react';
import { format } from 'date-fns';
import { useCalendarContext } from './context/CalendarContext';
import { EVENT_TYPE_META, HOURS } from '../../constants/constants';
import { 
  isTodayDate, 
  isEventOnDate, 
  calculateDuration,
  getHourFromTime 
} from '../../utils/dateHelpers';

const WeekView = ({ weekDays, events, onCellClick }) => {
  const { openEditModal } = useCalendarContext();

  const getEventsForDay = (day) => {
    return events.filter(event => isEventOnDate(event, day));
  };

  const handleEventClick = (e, event) => {
    e.stopPropagation();
    openEditModal(event);
  };

  return (
    <div className="flex-1 overflow-auto scrollbar-thin">
      <div className="min-w-[800px]">
        <div className="grid grid-cols-8 border-b border-gray-200 bg-white sticky top-0 z-10">
          <div className="p-4 border-r border-gray-200 bg-gray-50"></div>
          
          {weekDays.map((day) => {
            const isToday = isTodayDate(day);
            return (
              <div
                key={day.toISOString()}
                className={`p-4 text-center border-r border-gray-200 ${
                  isToday ? 'bg-blue-50' : ''
                }`}
              >
                <div className="text-sm font-semibold text-gray-600">
                  {format(day, 'EEE')}
                </div>
                <div
                  className={`mt-1 text-2xl font-bold ${
                    isToday
                      ? 'w-10 h-10 mx-auto flex items-center justify-center bg-blue-600 text-white rounded-full'
                      : 'text-gray-900'
                  }`}
                >
                  {format(day, 'd')}
                </div>
              </div>
            );
          })}
        </div>

        <div className="relative">
          {HOURS.map((hour) => (
            <div key={hour} className="grid grid-cols-8 border-b border-gray-200">
              <div className="p-2 text-xs text-gray-500 text-right border-r border-gray-200 bg-gray-50 min-h-[64px]">
                {format(new Date().setHours(hour, 0), 'ha')}
              </div>

              {weekDays.map((day) => {
                const dayEvents = getEventsForDay(day);
                const hourEvents = dayEvents.filter(event => 
                  event.start_time && getHourFromTime(event.start_time) === hour
                );

                return (
                  <div
                    key={`${day.toISOString()}-${hour}`}
                    onClick={() => onCellClick(day)}
                    className="min-h-[64px] border-r border-gray-100 hover:bg-gray-50 cursor-pointer relative"
                  >
                    {hourEvents.map((event, index) => {
                      const key = event.event_type?.toUpperCase() || 'OTHER';
                      const meta = EVENT_TYPE_META[key] || EVENT_TYPE_META.OTHER;
                      const minutePosition = event.start_time 
                        ? (parseInt(event.start_time.split(':')[1]) / 60) 
                        : 0;
                      
                      const duration = calculateDuration(event.start_time, event.end_time);

                      return (
                        <div
                          key={event.id || index}
                          className="absolute left-1 right-1 rounded px-2 py-1 text-xs text-white overflow-hidden z-10 shadow-sm"
                          style={{
                            backgroundColor: meta.color,
                            top: `${minutePosition * 64}px`,
                            height: `${duration * 64}px`,
                            minHeight: '32px'
                          }}
                          onClick={(e) => handleEventClick(e, event)}
                        >
                          <div className="font-semibold truncate">
                            {event.title}
                          </div>
                          {/* {event.start_time && event.end_time && (
                            <div className="text-xs opacity-90 truncate">
                              {event.start_time} - {event.end_time}
                            </div>
                          )} */}
                          <div className="text-xs opacity-90 truncate">
                            {event.description}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WeekView;