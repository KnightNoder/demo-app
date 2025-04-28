import axios from "axios";
import { getToken } from "../services/api";

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,               // ← send and receive HttpOnly cookies
  headers: {
    "Content-Type": "application/json",
    sitename: import.meta.env.VITE_SITE_NAME,
  },
});

// Request interceptor for debug and auth
axiosClient.interceptors.request.use(
  async (config) => {
    console.debug('[Axios] Request config:', config);
    const token = getToken();
    console.debug('[Axios] Retrieved token:', token ? 'present' : 'none');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
      console.debug('[Axios] Attached Authorization header');
    }
    return config;
  },
  (error) => {
    console.error('[Axios] Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for debug
axiosClient.interceptors.response.use(
  (response) => {
    console.debug('[Axios] Response:', response);
    return response;
  },
  (error) => {
    console.error('[Axios] Response error:', error);
    return Promise.reject(error);
  }
);

export default axiosClient;

