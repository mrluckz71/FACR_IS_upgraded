// Utility functions for Netlify serverless functions

/**
 * Generate a unique ID using uniqid pattern (like PHP)
 * @returns {string} Unique ID
 */
function generateId() {
  // Mimic PHP's uniqid() - 8 hex chars + 8 more hex chars
  const timestamp = Date.now().toString(16);
  const random = Math.random().toString(16).substring(2, 10);
  return (timestamp + random).substring(0, 13).padEnd(13, '0');
}

/**
 * Parse pagination parameters from request
 * @param {object} queryStringParameters - Query params from request
 * @param {number} itemsPerPage - Items per page (default 5)
 * @returns {object} {page, offset, limit}
 */
function getPaginationParams(queryStringParameters, itemsPerPage = 5) {
  let page = parseInt(queryStringParameters?.page) || 1;
  
  // Ensure page is at least 1
  if (page < 1) page = 1;
  
  const offset = (page - 1) * itemsPerPage;
  
  return {
    page,
    offset,
    limit: itemsPerPage,
  };
}

/**
 * Calculate pagination info
 * @param {number} totalCount - Total number of items
 * @param {number} page - Current page
 * @param {number} itemsPerPage - Items per page
 * @returns {object} Pagination info
 */
function getPaginationInfo(totalCount, page, itemsPerPage = 5) {
  const totalPages = Math.ceil(totalCount / itemsPerPage);
  
  return {
    page,
    itemsPerPage,
    totalCount,
    totalPages,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1,
  };
}

/**
 * Format date like PHP: 'd.m H:i' or 'd.m.Y H:i'
 * @param {string|Date} dateStr - Date string or Date object
 * @param {string} format - Format string
 * @returns {string} Formatted date
 */
function formatDate(dateStr, format = 'd.m H:i') {
  const date = typeof dateStr === 'string' ? new Date(dateStr) : dateStr;
  
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  
  if (format === 'd.m H:i') {
    return `${day}.${month} ${hours}:${minutes}`;
  } else if (format === 'd.m.Y H:i') {
    return `${day}.${month}.${year} ${hours}:${minutes}`;
  }
  
  return date.toISOString();
}

/**
 * Escape HTML special characters
 * @param {string} str - String to escape
 * @returns {string} Escaped string
 */
function htmlspecialchars(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} True if valid email
 */
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Send JSON response
 * @param {number} statusCode - HTTP status code
 * @param {object} body - Response body
 * @param {object} headers - Additional headers
 * @returns {object} Lambda response
 */
function sendResponse(statusCode, body, headers = {}) {
  return {
    statusCode,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
    body: JSON.stringify(body),
  };
}

/**
 * Send error response
 * @param {number} statusCode - HTTP status code
 * @param {string} message - Error message
 * @param {object} details - Additional error details
 * @returns {object} Lambda response
 */
function sendError(statusCode, message, details = {}) {
  return sendResponse(statusCode, {
    error: message,
    ...details,
  });
}

module.exports = {
  generateId,
  getPaginationParams,
  getPaginationInfo,
  formatDate,
  htmlspecialchars,
  isValidEmail,
  sendResponse,
  sendError,
};
