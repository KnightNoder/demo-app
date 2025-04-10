import axios from "axios";

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
    sitename: "current",
    // Authorization: `Bearer ${localStorage.getItem("JWT_AUTH_TOKEN")}`,
    Authorization: `Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoxLCJ1c2VybmFtZSI6ImFkbWluIiwicm9sZXMiOlsiYWRtaW4iXSwiaWF0IjoxNzQ0MzIwMDI3LCJleHAiOjE3NDQzMjM2Mjd9.fbsretcXR807I5ZwO8GZ2-pIdv2kA2BHDG5QvrFwXyQ`,
  },
});


export default axiosClient;

