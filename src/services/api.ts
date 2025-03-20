// src/services/api.ts
import axios, { AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios';

export const setAuthToken = (token: string | null) => {
  if (token) {
    localStorage.setItem("JWT_AUTH_TOKEN", token);
  } else {
    localStorage.removeItem("JWT_AUTH_TOKEN");
  }
};

const baseURL = 'https://qa-phoenix.drcloudemr.com/api';

const api: AxiosInstance = axios.create({
  baseURL,
});

// Attach token from localStorage to every request
api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = localStorage.getItem('JWT_AUTH_TOKEN');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
    console.log('[Axios Interceptor] Attaching token:', token);
  }
  return config;
});

// Handle token expiration
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: any) => {
    if (error.response && error.response.status === 401) {
      console.error('Authentication failed. Please log in again.');
    }
    return Promise.reject(error);
  }
);

export default api;
