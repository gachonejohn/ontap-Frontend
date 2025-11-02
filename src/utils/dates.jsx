import dayjs from 'dayjs';

/**
 * Formats a given date to "YYYY-MM-DD"
 */
export const formattDate = (date) => {
  if (!date) return '';
  return dayjs(date).format('YYYY-MM-DD');
};

/**
 * Returns the ordinal suffix of a given number
 */
const getOrdinalSuffix = (n) => {
  const s = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;
  return s[(v - 20) % 10] || s[v] || s[0];
};

/**
 * Formats a given date to "D[st|nd|rd|th] MMMM YYYY"
 */
export const formatDetailedDate = (date) => {
  if (!date) return '';
  const day = dayjs(date).date();
  const suffix = getOrdinalSuffix(day);
  return dayjs(date).format(`D[${suffix}] MMMM YYYY`);
};

export const formattedDate = (date) => {
  if (!date) return '';
  return dayjs(date).format('DD-MM-YYYY');
};

export const formatYear = (date) => {
  if (!date) return '';
  return dayjs(date).format('YYYY');
};

export const YearMonthCustomDate = (date, formatString = 'MMMM D, YYYY') => {
  if (!date) return '';
  const dayjsDate = dayjs(date);
  const format = formatString.replace('MMMM', 'MMM');
  const formatted = dayjsDate.format(format);
  return formatted.replace('AM', 'a.m.').replace('PM', 'p.m.');
};

export const CustomDate = (date, formatString = 'MMM D, YYYY, h:mm A') => {
  if (!date) return '';
  const formatted = dayjs(date).format(formatString);
  return formatted.replace('AM', 'a.m.').replace('PM', 'p.m.');
};

/**
 * Formats clock-in/clock-out times like "9:05 a.m."
 * Accepts either a full Date string or a "HH:mm:ss" style time.
 */
export const formatClockTime = (time) => {
  if (!time) return '';
  // If it's only a time string (e.g., "09:05:00"), prepend a fixed date so dayjs parses it.
  const parsed = time.match(/^\d{2}:\d{2}/) ? dayjs(`1970-01-01T${time}`) : dayjs(time);
  return parsed.format('h:mm A').replace('AM', 'a.m.').replace('PM', 'p.m.');
};

/**
 * Converts decimal hours into a string like "Xh Ym Zs"
 * Example: 1.5 → "1h 30m 0s"
 */
export const formatHoursWorked = (hoursDecimal) => {
  if (hoursDecimal === null || hoursDecimal === undefined || isNaN(hoursDecimal)) {
    return '';
  }

  // total seconds
  const totalSeconds = Math.floor(hoursDecimal * 3600);

  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;

  // Build readable string (skip zero parts if you want)
  const parts = [];
  if (h > 0) parts.push(`${h}h`);
  if (m > 0) parts.push(`${m}m`);
  if (s > 0 || parts.length === 0) parts.push(`${s}s`);

  return parts.join(' ');
};
