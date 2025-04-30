import axios from "axios";
import { getToken } from "../services/api";

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
    sitename: import.meta.env.VITE_SITE_NAME,
    Authorization: `Bearer ${localStorage.getItem("JWT_AUTH_TOKEN")}`,
    // Authorization: `Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoxLCJ1c2VybmFtZSI6ImFkbWluIiwicm9sZXMiOlsidXNlciJdLCJpYXQiOjE3NDU4Mjk4NTYsImV4cCI6MTc0NTgzMzQ1Nn0.r052RKyIu7bhfdwvqLmLf69vLXqoiFmHvNfBXGa0pk0`,
  },
});

// Add request interceptor to set the token
axiosClient.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axiosClient;

