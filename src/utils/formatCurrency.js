/**
 * Format currency utility for Kenya Shillings (KES)
 * Accepts both string and number inputs
 * 
 * @param {string|number} value - The value to format
 * @param {Object} options - Formatting options
 * @param {boolean} options.showSymbol - Whether to show currency symbol (default: true)
 * @param {number} options.decimals - Number of decimal places (default: 2)
 * @param {string} options.locale - Locale for formatting (default: 'en-KE')
 * @returns {string} Formatted currency string
 */
export const formatCurrency = (value, options = {}) => {
  const {
    showSymbol = true,
    decimals = 2,
    locale = 'en-KE',
  } = options;

  // Handle null, undefined, or empty string
  if (value === null || value === undefined || value === '') {
    return showSymbol ? 'KES 0.00' : '0.00';
  }

  // Convert string to number if needed
  let numericValue;
  if (typeof value === 'string') {
    // Remove any existing currency symbols, commas, or spaces
    const cleanedValue = value.replace(/[^0-9.-]/g, '');
    numericValue = parseFloat(cleanedValue);
  } else {
    numericValue = value;
  }

  // Check if conversion resulted in a valid number
  if (isNaN(numericValue)) {
    console.warn(`Invalid currency value: ${value}`);
    return showSymbol ? 'KES 0.00' : '0.00';
  }

  // Format the number
  const formattedNumber = new Intl.NumberFormat(locale, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(numericValue);

  // Return with or without symbol
  return showSymbol ? `KES ${formattedNumber}` : formattedNumber;
};

/**
 * Format currency without symbol (just the number)
 * 
 * @param {string|number} value - The value to format
 * @param {number} decimals - Number of decimal places (default: 2)
 * @returns {string} Formatted number string
 */
export const formatAmount = (value, decimals = 2) => {
  return formatCurrency(value, { showSymbol: false, decimals });
};

/**
 * Format currency with custom symbol
 * 
 * @param {string|number} value - The value to format
 * @param {string} symbol - Currency symbol (default: 'KES')
 * @param {number} decimals - Number of decimal places (default: 2)
 * @returns {string} Formatted currency string
 */
export const formatCurrencyWithSymbol = (value, symbol = 'KES', decimals = 2) => {
  const formatted = formatCurrency(value, { showSymbol: false, decimals });
  return `${symbol} ${formatted}`;
};

/**
 * Parse currency string to number
 * 
 * @param {string|number} value - The value to parse
 * @returns {number} Numeric value
 */
export const parseCurrency = (value) => {
  if (typeof value === 'number') {
    return value;
  }

  if (typeof value === 'string') {
    const cleanedValue = value.replace(/[^0-9.-]/g, '');
    const numericValue = parseFloat(cleanedValue);
    return isNaN(numericValue) ? 0 : numericValue;
  }

  return 0;
};


export default formatCurrency;