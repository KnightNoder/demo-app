// src/services/api.ts
import axios, { AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios';

// Base API URL
const baseURL = 'https://staging.qa-phoenix.drcloudemr.com/api';
// Login redirect URL from .env or fallback
const LOGIN_URL = import.meta.env.VITE_LOGIN_URL || '/login';

// Create the main Axios instance for all API calls
const api: AxiosInstance = axios.create({
  baseURL,
});

// Create a separate Axios instance for token refresh
const refreshApi: AxiosInstance = axios.create({
  baseURL,
});

// Track if a token refresh is already in progress
let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

// Subscribe requests to wait for new token after refresh
const subscribeTokenRefresh = (callback: (token: string) => void) => {
  refreshSubscribers.push(callback);
};

// Notify all subscribers that token has been refreshed
const onTokenRefreshed = (token: string) => {
  refreshSubscribers.forEach(callback => callback(token));
  refreshSubscribers = [];
};

// Decode JWT to get payload
const decodeToken = (token: string) => {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch (e) {
    console.error('Failed to decode token:', e);
    return null;
  }
};

// Function to get token from localStorage
const getToken = () => localStorage.getItem('JWT_AUTH_TOKEN');

// Function to save token to localStorage
export const setAuthToken = (token: string | null) => {
  if (token) {
    localStorage.setItem('JWT_AUTH_TOKEN', token);
  } else {
    localStorage.removeItem('JWT_AUTH_TOKEN');
  }
};

// Refresh the JWT token by calling legacy-bridge API
const refreshToken = async (): Promise<string> => {
  if (isRefreshing) {
    return new Promise(resolve => {
      subscribeTokenRefresh(resolve);
    });
  }

  isRefreshing = true;

  try {
    const oldToken = getToken();
    const decoded = oldToken ? decodeToken(oldToken) : null;

    if (!decoded || !decoded.username) throw new Error('Invalid token');

    const sessionId = sessionStorage.getItem('session_id');
    const response = await refreshApi.post('/auth/legacy-bridge', {
      session_id: sessionId,
      username: decoded.username,
    }, {
      headers: {
        'sitename': 'current', // Add site context header if required
      },
      timeout: 5000,
    });

    if (!response.data?.token) {
      throw new Error('Refresh endpoint did not return a token');
    }

    const newToken = response.data.token;
    setAuthToken(newToken);
    onTokenRefreshed(newToken);
    isRefreshing = false;
    return newToken;
  } catch (error) {
    console.error('Token refresh failed:', error);
    refreshSubscribers = [];
    isRefreshing = false;
    throw error;
  }
};

// Intercept outgoing requests to attach or refresh token
api.interceptors.request.use(async (config: InternalAxiosRequestConfig) => {
  const token = getToken();

  if (token && config.headers) {
    const decoded = decodeToken(token);
    const now = Math.floor(Date.now() / 1000);
    const expiresAt = decoded?.exp || 0;

    if (expiresAt - now < 120 && expiresAt > now) {
      // Token expiring soon; refresh
      const newToken = await refreshToken();
      config.headers.Authorization = `Bearer ${newToken}`;
    } else if (expiresAt <= now) {
      // Token already expired; try refresh anyway
      try {
        const newToken = await refreshToken();
        config.headers.Authorization = `Bearer ${newToken}`;
      } catch (e) {
        console.warn('Proceeding with expired token:', e);
        config.headers.Authorization = `Bearer ${token}`;
      }
    } else {
      // Token is still valid
      config.headers.Authorization = `Bearer ${token}`;
    }
  }

  return config;
});

// Handle unauthorized responses globally
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const newToken = await refreshToken();
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        console.error('Redirecting to login due to failed refresh:', refreshError);
        // Redirect in iframe-safe way
        if (typeof window.top !== 'undefined' && window.top !== window.self && window.top !== null) {
          window.top.location.href = LOGIN_URL;
        } else {
          window.location.href = LOGIN_URL;
        }
      }
    }

    return Promise.reject(error);
  }
);

export default api;
