import axios from 'axios';

// Use relative URL to go through Vite proxy
const API_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Add token to requests
api.interceptors.request.use((config) => {
  // Get token from localStorage
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  // Don't set Content-Type for FormData (let browser set it with boundary)
  if (config.data instanceof FormData) {
    delete config.headers['Content-Type'];
  }

  return config;
}, (error) => {
  return Promise.reject(error);
});

// Handle errors and token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Handle 401 Unauthorized - token expired or invalid
    if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
      // Avoid retrying the refresh request itself
      if (originalRequest.url === '/auth/refresh/') {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        if (!window.location.pathname.includes('/login')) {
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }

      if (isRefreshing) {
        // Wait until the refresh attempt finishes, then retry
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken) {
        localStorage.removeItem('accessToken');
        if (!window.location.pathname.includes('/login')) {
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }

      try {
        const response = await axios.post(
          `${API_URL}/auth/refresh/`,
          { refresh: refreshToken },
          { withCredentials: true }
        );

        const { accessToken, refreshToken: newRefreshToken } = response.data;
        if (!accessToken) {
          throw new Error('No access token in refresh response');
        }

        localStorage.setItem('accessToken', accessToken);
        if (newRefreshToken) {
          localStorage.setItem('refreshToken', newRefreshToken);
        }

        api.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        processQueue(null, accessToken);

        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        if (!window.location.pathname.includes('/login')) {
          window.location.href = '/login';
        }
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // Handle 403 Forbidden - rate limit exceeded
    if (error.response?.status === 429) {
      console.warn('Rate limit exceeded. Please try again later.');
    }

    return Promise.reject(error);
  }
);

export default api;
