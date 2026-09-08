/**
 * Utility for making REST API calls between microservices
 */
const serviceCall = async (url, options = {}) => {
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Inter-service call failed with status ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`[Inter-Service Call Error] ${url}:`, error.message);
    throw error;
  }
};

module.exports = { serviceCall };
