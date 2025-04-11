import axios from "axios";

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
    sitename: "current",
    Authorization: `Bearer ${localStorage.getItem("JWT_AUTH_TOKEN")}`,
    // Authorization: `Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoxLCJ1c2VybmFtZSI6ImFkbWluIiwicm9sZXMiOlsiYWRtaW4iXSwiaWF0IjoxNzQ0MzMyODI1LCJleHAiOjE3NDQzMzY0MjV9.Jk-UCPEyX4j0koOdEF6eBf8UMF9Im1HoTsJX9PisoOA`,
  },
});


export default axiosClient;

