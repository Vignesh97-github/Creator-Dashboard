import axios from 'axios';

/**
 * Creates an axios instance with default configuration
 * @param {string} baseURL - The base URL for the API
 * @param {Object} headers - Default headers to include
 * @returns {Object} Axios instance
 */
export const createApiClient = (baseURL, headers = {}) => {
  return axios.create({
    baseURL,
    headers: {
      'Content-Type': 'application/json',
      ...headers
    }
  });
};

/**
 * Handles API errors and formats them consistently
 * @param {Error} error - The error object
 * @returns {Object} Formatted error object
 */
export const handleApiError = (error) => {
  if (error.response) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    return {
      status: error.response.status,
      message: error.response.data.message || 'An error occurred',
      data: error.response.data
    };
  } else if (error.request) {
    // The request was made but no response was received
    return {
      status: 503,
      message: 'No response received from server',
      data: null
    };
  } else {
    // Something happened in setting up the request that triggered an Error
    return {
      status: 500,
      message: error.message || 'An unexpected error occurred',
      data: null
    };
  }
};

/**
 * Validates API response data against a schema
 * @param {Object} data - The data to validate
 * @param {Object} schema - The validation schema
 * @returns {boolean} Whether the data is valid
 */
export const validateResponse = (data, schema) => {
  try {
    // Basic schema validation
    for (const [key, type] of Object.entries(schema)) {
      if (data[key] === undefined) {
        throw new Error(`Missing required field: ${key}`);
      }
      if (typeof data[key] !== type) {
        throw new Error(`Invalid type for field ${key}: expected ${type}, got ${typeof data[key]}`);
      }
    }
    return true;
  } catch (error) {
    console.error('Validation error:', error);
    return false;
  }
};

/**
 * Retries a failed API request
 * @param {Function} apiCall - The API call function to retry
 * @param {number} maxRetries - Maximum number of retry attempts
 * @param {number} delay - Delay between retries in milliseconds
 * @returns {Promise} The API call result
 */
export const retryApiCall = async (apiCall, maxRetries = 3, delay = 1000) => {
  let lastError;
  
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await apiCall();
    } catch (error) {
      lastError = error;
      if (i < maxRetries - 1) {
        await new Promise(resolve => setTimeout(resolve, delay * (i + 1)));
      }
    }
  }
  
  throw lastError;
};

/**
 * Formats API response data
 * @param {Object} data - The response data
 * @param {Object} options - Formatting options
 * @returns {Object} Formatted response data
 */
export const formatResponse = (data, options = {}) => {
  const {
    snakeToCamel = true,
    removeNulls = true,
    dateFields = []
  } = options;

  const formatValue = (value) => {
    if (value === null && removeNulls) {
      return undefined;
    }
    if (value instanceof Date) {
      return value.toISOString();
    }
    if (Array.isArray(value)) {
      return value.map(formatValue);
    }
    if (typeof value === 'object' && value !== null) {
      return formatResponse(value, options);
    }
    return value;
  };

  const formatted = {};
  for (const [key, value] of Object.entries(data)) {
    if (value === null && removeNulls) {
      continue;
    }

    let newKey = key;
    if (snakeToCamel) {
      newKey = key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
    }

    formatted[newKey] = formatValue(value);
  }

  return formatted;
}; 