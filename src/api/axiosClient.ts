import axios from "axios";

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
    sitename: "current",
    Authorization: `Bearer ${localStorage.getItem("JWT_AUTH_TOKEN")}`,
    // Authorization: `Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoxLCJ1c2VybmFtZSI6ImFuaWwiLCJyb2xlcyI6WyJhZG1pbiJdLCJpYXQiOjE3NDM2ODU5MDEsImV4cCI6MTc0MzY4OTUwMX0.OmJ6symnsf5H_dOqQkMfYwRA-DcwB1sWzXr5smL--K8`,
  },
});


export default axiosClient;

