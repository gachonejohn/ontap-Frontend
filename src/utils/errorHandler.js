// utils/errorHandler.js

/**
 * Extracts a human-readable error message from an RTK Query unwrap() error.
 * @param {any} error - The caught error
 * @param {string} fallbackMessage - Message to return if nothing found
 * @returns {string} - The message you can show in toast/alert/etc.
 */
export function getApiErrorMessage(error, fallbackMessage = 'An unexpected error occurred.') {
  if (error && typeof error === 'object' && 'data' in error && error.data) {
    return error.data.error || fallbackMessage;
  }
  return fallbackMessage;
}
