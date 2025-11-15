import React from 'react';
import { useCalendarContext } from './context/CalendarContext';

const CalendarPageHeader = () => {
  const { openCreateModal } = useCalendarContext();

  const handleExportRecords = () => {
    // TODO
    // console.log('Export records');
  };

  const handleCreateEvent = () => {
    openCreateModal(new Date());
  };

  return (
    <div className="flex justify-between items-start px-6 py-5">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Calendar</h1>
        <p className="text-sm text-gray-500 mt-1">
          Manage events, meetings, and important dates
        </p>
      </div>
      
      <div className="flex items-center gap-3">
        <button
          onClick={handleExportRecords}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 rounded-lg transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Export Records
        </button>
        
        <button
          onClick={handleCreateEvent}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-teal-500 hover:bg-teal-600 rounded-lg transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Create Event
        </button>
      </div>
    </div>
  );
};

export default CalendarPageHeader;