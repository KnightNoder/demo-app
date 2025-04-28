import axios, { AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios';

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

// Token management functions
export const setAuthToken = (token: string | null) => {
  console.debug('[Token] Setting auth token:', token ? 'Token present' : 'No token');
  if (token) {
    localStorage.setItem("JWT_AUTH_TOKEN", token);
  } else {
    localStorage.removeItem("JWT_AUTH_TOKEN");
  }
};

export const getToken = () => {
  const token = localStorage.getItem('JWT_AUTH_TOKEN');
  console.debug('[Token] Getting token:', token ? 'Token present' : 'No token');
  return token;
};

// Decode JWT to get payload
const decodeToken = (token: string) => {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch (e) {
    console.error('[Token] Failed to decode token:', e);
    return null;
  }
};

// Check if token is expired
const isTokenExpired = (token: string | null): boolean => {
  if (!token) return true;
  try {
    const { exp } = JSON.parse(atob(token.split('.')[1]));
    return exp * 1000 < Date.now();
  } catch {
    return true;
  }
};

// Refresh the JWT token
const refreshToken = async (): Promise<string> => {
  console.debug('[Token] Starting token refresh');
  if (isRefreshing) {
    console.debug('[Token] Token refresh already in progress, subscribing to refresh');
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
    const response = await axios.post(
      `${import.meta.env.VITE_API_URL}/auth/legacy-bridge`,
      {
        session_id: sessionId,
        username: decoded.username,
      },
      {
        headers: {
          sitename: import.meta.env.VITE_SITE_NAME,
        },
        withCredentials: true,
        timeout: 5000,
      }
    );

    if (!response.data?.token) {
      throw new Error('Refresh endpoint did not return a token');
    }

    const newToken = response.data.token;
    console.debug('[Token] Token refresh successful, new token received');
    setAuthToken(newToken);
    onTokenRefreshed(newToken);
    isRefreshing = false;
    return newToken;
  } catch (error) {
    console.error('[Token] Token refresh failed:', error);
    refreshSubscribers = [];
    isRefreshing = false;
    throw error;
  }
};

// Ensure we have a valid token (refreshing if needed)
export const ensureValidToken = async (): Promise<string | null> => {
  let token = getToken();
  console.debug('[Token] Checking token validity:', {
    token: token ? 'present' : 'none',
    timestamp: new Date().toISOString()
  });

  if (!token || isTokenExpired(token)) {
    console.debug('[Token] Token missing or expired, refreshing...');
    try {
      token = await refreshToken();
      console.debug('[Token] Token refresh successful');
    } catch (e) {
      console.error('[Token] Failed to refresh token:', {
        error: e,
        timestamp: new Date().toISOString()
      });
      return null;
    }
  } else {
    console.debug('[Token] Token is valid, no refresh needed');
  }
  return token;
};

// Create the main Axios instance
const axiosClient: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    sitename: import.meta.env.VITE_SITE_NAME,
    Authorization: `Bearer ${localStorage.getItem("JWT_AUTH_TOKEN")}`,
    // Authorization: `Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoxLCJ1c2VybmFtZSI6ImFkbWluIiwicm9sZXMiOlsidXNlciJdLCJpYXQiOjE3NDU4Mjk4NTYsImV4cCI6MTc0NTgzMzQ1Nn0.r052RKyIu7bhfdwvqLmLf69vLXqoiFmHvNfBXGa0pk0`,
  },
});

// Request interceptor for debug and auth
axiosClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    console.debug('[Axios] Request config:', {
      url: config.url,
      method: config.method,
      headers: config.headers,
      withCredentials: config.withCredentials
    });
    
    const token = await ensureValidToken();
    console.debug('[Axios] Token status:', {
      token: token ? 'present' : 'none',
      url: config.url
    });
    
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
      console.debug('[Axios] Attached Authorization header to request');
    }
    return config;
  },
  (error) => {
    console.error('[Axios] Request error:', {
      error: error.message,
      config: error.config
    });
    return Promise.reject(error);
  }
);

// Response interceptor for debug and token refresh
axiosClient.interceptors.response.use(
  (response: AxiosResponse) => {
    console.debug('[Axios] Response received:', {
      status: response.status,
      url: response.config.url,
      method: response.config.method
    });
    return response;
  },
  async (error) => {
    console.error('[Axios] Response error:', {
      status: error.response?.status,
      message: error.message,
      url: error.config?.url,
      method: error.config?.method
    });
    
    // If it's a 401 and we haven't retried yet
    if (error.response?.status === 401 && !error.config._retry) {
      error.config._retry = true;
      try {
        const newToken = await ensureValidToken();
        if (newToken) {
          error.config.headers.Authorization = `Bearer ${newToken}`;
          return axiosClient(error.config);
        }
      } catch (refreshError) {
        console.error('[Axios] Token refresh failed:', refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default axiosClient;

