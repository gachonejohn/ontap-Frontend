import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  addMonths,
  subMonths,
  isSameMonth,
  isSameDay,
  isToday,
  parseISO,
  startOfDay
} from 'date-fns';

/**
 * Get all days to display in a month view calendar (including padding days)
 */
export const getMonthDays = (date) => {
  const start = startOfWeek(startOfMonth(date));
  const end = endOfWeek(endOfMonth(date));
  
  const days = [];
  let currentDay = start;
  
  while (currentDay <= end) {
    days.push(currentDay);
    currentDay = addDays(currentDay, 1);
  }
  
  return days;
};

/**
 * Get 7 days for week view starting from Sunday
 */
export const getWeekDays = (date) => {
  const start = startOfWeek(date);
  const days = [];
  
  for (let i = 0; i < 7; i++) {
    days.push(addDays(start, i));
  }
  
  return days;
};

/**
 * Format date for API (YYYY-MM-DD)
 */
export const formatDate = (date, formatStr = 'yyyy-MM-dd') => {
  if (!date) return '';
  return format(date, formatStr);
};

/**
 * Format date for display (e.g., "November 2025")
 */
export const formatDisplayDate = (date) => {
  return format(date, 'MMMM yyyy');
};

/**
 * Format time for display (e.g., "2:00 PM")
 */
export const formatTime = (time) => {
  if (!time) return '';
  const [hours, minutes] = time.split(':');
  const date = new Date();
  date.setHours(parseInt(hours), parseInt(minutes));
  return format(date, 'h:mm a');
};

/**
 * Check if date is in the current month
 */
export const isCurrentMonth = (date, referenceDate) => {
  return isSameMonth(date, referenceDate);
};

/**
 * Check if two dates are the same day
 */
export const isCurrentDay = (date, referenceDate) => {
  return isSameDay(date, referenceDate);
};

/**
 * Check if date is today
 */
export const isTodayDate = (date) => {
  return isToday(date);
};

/**
 * Get next month
 */
export const nextMonth = (date) => {
  return addMonths(date, 1);
};

/**
 * Get previous month
 */
export const prevMonth = (date) => {
  return subMonths(date, 1);
};


export const parseDate = (dateString) => {
  if (!dateString) return null;
  return parseISO(dateString);
};

/**
 * Get start of day
 */
export const getStartOfDay = (date) => {
  return startOfDay(date);
};

/**
 * Check if event falls on a specific date
 */
export const isEventOnDate = (event, date) => {
  if (!event.date) return false;
  const eventDate = typeof event.date === 'string' ? parseISO(event.date) : event.date;
  return isSameDay(eventDate, date);
};

/**
 * Get hour from time string (e.g., "14:30" -> 14)
 */
export const getHourFromTime = (timeString) => {
  if (!timeString) return 0;
  return parseInt(timeString.split(':')[0]);
};

/**
 * Get position in hours (e.g., "14:30" -> 14.5)
 */
export const getTimePosition = (timeString) => {
  if (!timeString) return 0;
  const [hours, minutes] = timeString.split(':').map(Number);
  return hours + minutes / 60;
};

/**
 * Calculate duration in hours between two time strings
 */
export const calculateDuration = (startTime, endTime) => {
  if (!startTime || !endTime) return 1;
  const start = getTimePosition(startTime);
  const end = getTimePosition(endTime);
  return Math.max(end - start, 0.5); // Minimum 30 minutes
};

// Re-export commonly used date-fns functions
// export { 
//   format, 
//   isSameDay, 
//   startOfMonth, 
//   endOfMonth,
//   addDays,
//   subDays: (date, days) => addDays(date, -days)
// } from 'date-fns';