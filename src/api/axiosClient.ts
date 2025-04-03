import axios from "axios";

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
    sitename: "current",
    Authorization: `Bearer ${localStorage.getItem("JWT_AUTH_TOKEN")}`,
    // Authorization: `Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoxLCJ1c2VybmFtZSI6ImFkbWluIiwicm9sZXMiOlsiYWRtaW4iXSwiaWF0IjoxNzQzNjcxNDIxLCJleHAiOjE3NDM2NzUwMjF9.mgm0g-GmiCixbAhh4YT4m_yK7MU7RVZ2Rmlk8Xvmngk`,
  },
});


export default axiosClient;

