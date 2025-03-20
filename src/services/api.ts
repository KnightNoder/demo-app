// src/services/api.ts
import axios, { AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios';

export const setAuthToken = (token: string | null) => {
  if (token) {
    localStorage.setItem("jwtToken", token);
  } else {
    localStorage.removeItem("jwtToken");
  }
};

const baseURL = 'https://qa-phoenix.drcloudemr.com/api';

const api: AxiosInstance = axios.create({
  baseURL,
});

// Attach token from localStorage to every request
api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = localStorage.getItem('jwtToken');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
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
