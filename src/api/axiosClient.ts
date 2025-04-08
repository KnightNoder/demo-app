import axios from "axios";

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
    sitename: "current",
    // Authorization: `Bearer ${localStorage.getItem("JWT_AUTH_TOKEN")}`,
    Authorization: `Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoxLCJ1c2VybmFtZSI6ImFkbWluIiwicm9sZXMiOlsiYWRtaW4iXSwiaWF0IjoxNzQ0MTQyNjkzLCJleHAiOjE3NDQxNDYyOTN9.lNwp4C-Ky2WQhdgYf7KrZ1lyJL8p3LCY7InYmGHgVh8`,
  },
});


export default axiosClient;

