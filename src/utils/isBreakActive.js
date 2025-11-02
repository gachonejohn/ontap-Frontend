// utils/isBreakActive.js

/**
 * Determines whether a break is still active (not yet ended).
 * @param {string | null} breakEnd - The break end time string, e.g. "16:15:00".
 * @returns {boolean} True if break is ongoing (end time > now), false otherwise.
 */
export const isBreakActive = (breakEnd) => {
  if (!breakEnd) return false; // if break_end is null, not active

  const now = new Date();
  const [endHour, endMinute, endSecond] = breakEnd.split(':').map(Number);
  const endTime = new Date();
  endTime.setHours(endHour, endMinute, endSecond || 0, 0);

  return endTime > now;
};
