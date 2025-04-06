const API_BASE_URL = 'http://localhost:8080';

const fetchWithAuth = async (endpoint, options = {}) => {
  const defaultOptions = {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const mergedOptions = {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...options.headers,
    },
  };

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...mergedOptions,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    if (error.name === 'AbortError') {
      throw new Error('Request timed out. Please try again.');
    }
    if (error.name === 'TypeError' && error.message === 'Failed to fetch') {
      throw new Error('Unable to connect to the server. Please check your connection.');
    }
    throw error;
  }
};

export const api = {
  get: (endpoint) => fetchWithAuth(endpoint, { method: 'GET' }),
  post: (endpoint, data) =>
    fetchWithAuth(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  put: (endpoint, data) =>
    fetchWithAuth(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  delete: (endpoint) =>
    fetchWithAuth(endpoint, {
      method: 'DELETE',
    }),
}; 