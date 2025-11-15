import React from "react";

export default function WeeklyAttendanceChart({ data, isLoading }) {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-56">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!data || !data.data?.length) {
    return (
      <div className="flex justify-center items-center h-56 text-gray-500">
        No attendance data available
      </div>
    );
  }

  const dailyData = data.data;
  const period = data.period || {};
  const summary = data.summary || {};

  const colorMap = {
    present: "#10B981",
    late: "#F59E0B",
    absent: "#EF4444",
    leave: "#3B82F6",
    upcoming: "#E5E7EB",
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

const getBarSegments = (day) => {
 
    const dayDate = new Date(day.date);
    const dayOfWeek = dayDate.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    if (day.is_present) {
      if (day.is_late) {
        return [
          { color: colorMap.present, label: "Present", height: "50%" },
          { color: colorMap.late, label: "Late", height: "50%" },
        ];
      } else {
        return [{ color: colorMap.present, label: "On Time", height: "100%" }];
      }
    }
    

    if (day.is_on_leave)
      return [{ color: colorMap.leave, label: "Leave", height: "100%" }];
    
    if (isWeekend)
      return [{ color: colorMap.upcoming, label: "Weekend", height: "100%" }];

    if (day.is_absent)
      return [{ color: colorMap.absent, label: "Absent", height: "100%" }];
    
    return [{ color: colorMap.upcoming, label: "Upcoming", height: "20%" }];
  };

  return (
    <div className="w-full bg-white rounded-lg shadow-sm p-5">
      {/* Period */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-5">
        <p className="text-xs text-gray-500">
          {formatDate(period.start_date)} - {formatDate(period.end_date)}
        </p>
      </div>

      {/* Summary Grid */}
      <div className="flex justify-around items-center mb-5 text-center">
        <div>
          <div className="text-lg font-semibold text-gray-900">{summary.on_time_rate || 0}%</div>
          <div className="text-xs text-gray-500">On-Time Rate</div>
        </div>
        <div>
          <div className="text-lg font-semibold text-gray-900">{summary.perfect_days || 0}</div>
          <div className="text-xs text-gray-500">Perfect Attendance Days</div>
        </div>
        <div>
          <div className="text-lg font-semibold text-gray-900">{summary.absent || 0}</div>
          <div className="text-xs text-gray-500">Absent Days</div>
        </div>
      </div>

      {/* Bars */}
      <div className="flex items-end justify-center flex-wrap gap-[2px] pb-8">
        {dailyData.map((day, idx) => {
          const segments = getBarSegments(day);
          const dayDate = new Date(day.date);
          const today = new Date();
          const isToday = dayDate.toDateString() === today.toDateString();
          const isFuture = dayDate > today;

          // Skip future days
          if (isFuture) return null;

          return (
            <div key={idx} className="flex-1 flex flex-col items-center">
              {/* Bar */}
              <div className="relative w-full max-w-[100px] h-[200px] flex flex-col-reverse overflow-hidden border border-gray-200 bg-gray-50 shadow-sm hover:shadow-md transition">
                {segments.map((seg, sIdx) => (
                  <div
                    key={sIdx}
                    className="w-full relative transition-all"
                    style={{ height: seg.height, backgroundColor: seg.color }}
                  >
                    <div
                      className="absolute inset-0 bg-black/30 opacity-0 hover:opacity-100 transition flex items-center justify-center text-[10px] text-white"
                      title={seg.label}
                    >
                      {seg.label}
                    </div>
                  </div>
                ))}
              </div>

              {/* Label */}
              <div className="text-center mt-4">
                <div className={`text-xs font-semibold ${isToday ? "text-blue-600" : "text-gray-700"}`}>
                  {day.day_short}
                </div>
                <div className="text-[10px] text-gray-500 mt-0.5">{formatDate(day.date)}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="mt-8 pt-3 flex flex-wrap justify-center gap-4 text-sm">
        {[
          { label: "Present (On Time)", color: colorMap.present },
          { label: "Late", color: colorMap.late },
          { label: "Absent", color: colorMap.absent },
          { label: "Leave", color: colorMap.leave },
          { label: "Weekend", color: colorMap.upcoming },
        ].map((item, idx) => (
          <div key={idx} className="flex items-center gap-2">
            <div className="w-4 h-4 rounded" style={{ backgroundColor: item.color }} />
            <span className="text-gray-700 text-xs">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}