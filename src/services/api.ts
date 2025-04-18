// src/services/api.ts
import axios, { AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios';

export const setAuthToken = (token: string | null) => {
  console.log('Setting auth token:', token ? 'Token present' : 'No token');
  if (token) {
    localStorage.setItem("JWT_AUTH_TOKEN", token);
  } else {
    localStorage.removeItem("JWT_AUTH_TOKEN");
  }
};

// const baseURL = 'https://qa-phoenix.drcloudemr.com/api';
const baseURL = import.meta.env.VITE_API_URL;

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
export const getToken = () => {
  const token = localStorage.getItem('JWT_AUTH_TOKEN');
  console.log('[Token Status] Getting token:', token ? 'Token present' : 'No token');
  return token;
};


// Refresh the JWT token by calling legacy-bridge API
const refreshToken = async (): Promise<string> => {
  console.log('[Token Status] Starting token refresh');
  if (isRefreshing) {
    console.log('[Token Status] Token refresh already in progress, subscribing to refresh');
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
    const response = await refreshApi.post(
      "/auth/legacy-bridge",
      {
        session_id: sessionId,
        username: decoded.username,
      },
      {
        headers: {
          sitename: import.meta.env.VITE_SITE_NAME, // Add site context header if required
        },
        timeout: 5000,
      }
    );

    if (!response.data?.token) {
      throw new Error('Refresh endpoint did not return a token');
    }

    const newToken = response.data.token;
    console.log('Token refresh successful, new token received');
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

    console.log(`[API Request] ${config.method?.toUpperCase()} ${config.url}`);
    console.log(`[Token Status] Current time: ${now}`);
    console.log(`[Token Status] Token expires at: ${expiresAt}`);
    console.log(`[Token Status] Time until expiration: ${expiresAt - now} seconds`);

    if (expiresAt - now < 120 && expiresAt > now) {
      console.log('[Token] About to expire, refreshing...');
      const newToken = await refreshToken();
      config.headers.Authorization = `Bearer ${newToken}`;
      console.log('[Token] Refreshed successfully');
    } else if (expiresAt <= now) {
      console.log('[Token] Already expired, attempting refresh...');
      try {
        const newToken = await refreshToken();
        config.headers.Authorization = `Bearer ${newToken}`;
        console.log('[Token] Refreshed after expiration');
      } catch (e) {
        console.warn('[Token] Failed to refresh expired token:', e);
        config.headers.Authorization = `Bearer ${token}`;
      }
    } else {
      console.log('[Token] Valid, using existing token');
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
        console.error('Redirect to login due to failed refresh:', refreshError);
        // Redirect in iframe-safe way
        // if (typeof window.top !== 'undefined' && window.top !== window.self && window.top !== null) {
        //   window.top.location.href = LOGIN_URL;
        // } else {
        //   window.location.href = LOGIN_URL;
        // }
      }
    }

    return Promise.reject(error);
  }
);

export default api;
