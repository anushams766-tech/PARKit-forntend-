import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
export const IS_DEMO_MODE = import.meta.env.VITE_DEMO_MODE !== 'false';

// Central Axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor: Attach Auth Token if available
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('parkit_auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: Normalize errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // When backend is unreachable or returns 404/500
    if (!error.response) {
      console.warn('[PARKit API] Network error / Backend unreachable. Falling back if Demo Mode enabled.');
    }
    return Promise.reject(error);
  }
);

export default apiClient;

