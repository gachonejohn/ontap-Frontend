import React from 'react';
import { useCalendarContext } from '../context/CalendarContext';
import { EVENT_TYPE_META, EVENT_TYPE_OPTIONS } from '../../../constants/constants';

const EventTypeFilter = () => {
  const { selectedEventTypes, toggleEventType } = useCalendarContext();

  return (
    <div className="bg-gray-50 rounded-lg p-4">
      <h3 className="text-sm font-semibold text-gray-900 mb-1">Event Types</h3>
      <div className="space-y-0.2">
        {Object.entries(EVENT_TYPE_META).map(([key, meta]) => {
          const isSelected = selectedEventTypes.includes(key);
          const label = EVENT_TYPE_OPTIONS.find(o => o.value === key)?.label;

          return (
            <label
              key={key}
              className="flex items-center gap-2 p-2 rounded-md hover:bg-gray-100 cursor-pointer transition-colors"
            >
              {/* <input
                type="checkbox"
                checked={isSelected}
                onChange={() => toggleEventType(key)}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
              /> */}
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: meta.color }}
              />
              {/* <span className="text-lg">{meta.icon}</span> */}
              <span className="text-sm text-gray-700 flex-1">{label}</span>
            </label>
          );
        })}
      </div>
    </div>
  );
};

export default EventTypeFilter;
