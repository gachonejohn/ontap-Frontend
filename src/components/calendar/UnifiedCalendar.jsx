import React from 'react';
import { CalendarProvider } from './context/CalendarContext';
import CalendarHeader from './CalendarHeader';
import CalendarGrid from './CalendarGrid';
import Sidebar from './sidebar/Sidebar';
import EventModal from './EventModal';
import CalendarPageHeader from './CalendarPageHeader';

const UnifiedCalendar = () =>  {
  return (
    <CalendarProvider>
      <div className="h-full flex flex-col">
      <CalendarPageHeader />
        <CalendarHeader />
        <div className="flex flex-1 min-h-0">
          <Sidebar />
          
          <div className="flex-1 flex flex-col bg-white">
            <CalendarGrid />
          </div>
        </div>
        
        <EventModal />
      </div>
    </CalendarProvider>
  );
}

export default UnifiedCalendar;