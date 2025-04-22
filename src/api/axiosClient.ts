import axios from "axios";
import { getToken } from "../services/api";

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
    sitename: import.meta.env.VITE_SITE_NAME,
    Authorization: `Bearer ${localStorage.getItem("JWT_AUTH_TOKEN")}`,
    // Authorization: `Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoiOGUxMjI4Y2NjZGZkMTIyYzQyNzdhNTQ1NmNjODJjYTc1MDI5NTg0Yjk2ZjU5YzhiMjIzNDRlNzU0NjBmNTljNSIsInVzZXJuYW1lIjoiYWRtaW4iLCJyb2xlcyI6WyJ1c2VyIl0sImlhdCI6MTc0NTMyNDE0MSwiZXhwIjoxNzQ1MzI3NzQxfQ.eR_3X6Gy2c_w4F3VNcw2shVvd9bdrsBYPaZ7Lw0wJd8`,
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

