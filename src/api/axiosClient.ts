import axios from "axios";

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
    sitename: "current",
    // Authorization: `Bearer ${localStorage.getItem("JWT_AUTH_TOKEN")}`,
    Authorization: `Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoxLCJ1c2VybmFtZSI6ImFuaWwiLCJyb2xlcyI6WyJhZG1pbiJdLCJpYXQiOjE3NDM2Nzg4MTksImV4cCI6MTc0MzY4MjQxOX0.9qxRpye_ouH6hFM_AglGXEf3NfdSNBBiSXpxJh20-4c`,
  },
});


export default axiosClient;

