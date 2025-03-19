// src/services/api.js
import axios from 'axios';

// Define the base URL for your Laravel API
const baseURL = 'https://qa-phoenix.drcloudemr.com/api';

const api = axios.create({
  baseURL: baseURL,
});

// Store the JWT token after login
export const setAuthToken = (token) => {
    if (token) {
      localStorage.setItem("jwtToken", token);
    } else {
      localStorage.removeItem("jwtToken"); // Remove token on logout
    }
  };

// Add JWT token to all requests
api.interceptors.request.use(config => {
  //const token = window.JWT_AUTH_TOKEN;
  const token = localStorage.getItem("jwtToken"); // Retrieve from localStorage

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  return config;
});

// Handle token expiration
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response && error.response.status === 401) {
      // Token expired or invalid
      console.error('Authentication failed. Please log in again.');
    }
    
    return Promise.reject(error);
  }
);

export default api;