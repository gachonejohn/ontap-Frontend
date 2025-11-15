import React from 'react';
import MiniCalendar from '../MiniCalendar';
import EventTypeFilter from './EventTypeFilter';
// import MonthStats from './MonthStats';

const Sidebar = () => {
  return (
    <aside className="w-72 bg-white ">
      <div className="p-5 space-y-6">
        {/* Quick Navigation */}
        <div>
          <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">
            Quick Navigation
          </h2>
          <MiniCalendar />
        </div>

        {/* Event Types Filter */}
        <div>
          <EventTypeFilter />
        </div>

        {/* Month Statistics */}
        {/* <div>
          <MonthStats />
        </div> */}
      </div>
    </aside>
  );
};

export default Sidebar;