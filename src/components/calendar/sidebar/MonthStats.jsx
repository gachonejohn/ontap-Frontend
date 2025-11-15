// import React, { useMemo } from 'react';
// import { useCalendarContext } from '../context/CalendarContext';

// const MonthStats = () => {
//   const { events } = useCalendarContext();

//   const stats = useMemo(() => {
//     const totalEvents = events.length;
//     const meetings = events.filter(e => e.type === 'meeting').length;
//     const deadlines = events.filter(e => e.type === 'payroll_deadline').length;

//     return {
//       totalEvents,
//       meetings,
//       deadlines
//     };
//   }, [events]);

//   return (
//     <div className="bg-gray-50 rounded-lg p-4">
//       <h3 className="text-sm font-semibold text-gray-900 mb-3">This Month</h3>
//       <div className="space-y-3">
//         <div className="flex justify-between items-center p-3 bg-white rounded-lg">
//           <span className="text-sm text-gray-600">Total Events</span>
//           <span className="text-lg font-bold text-gray-900">{stats.totalEvents}</span>
//         </div>
//         <div className="flex justify-between items-center p-3 bg-white rounded-lg">
//           <span className="text-sm text-gray-600">Meetings</span>
//           <span className="text-lg font-bold text-gray-900">{stats.meetings}</span>
//         </div>
//         <div className="flex justify-between items-center p-3 bg-white rounded-lg">
//           <span className="text-sm text-gray-600">Deadlines</span>
//           <span className="text-lg font-bold text-gray-900">{stats.deadlines}</span>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default MonthStats;


// const MonthStats = () =>{
//   return (
//     <div>monthly stats </div>
//   )
// }

// export default MonthStats;