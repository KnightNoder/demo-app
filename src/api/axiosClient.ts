import axios from "axios";

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
    sitename: "current",
    // Authorization: `Bearer ${localStorage.getItem("JWT_AUTH_TOKEN")}`,
    Authorization: `Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoxLCJ1c2VybmFtZSI6ImFkbWluIiwicm9sZXMiOlsiYWRtaW4iXSwiaWF0IjoxNzQzNTg4NjU2LCJleHAiOjE3NDM1OTIyNTZ9.q5dDAnNt3lQXE2Qqs3qRR8chO-epU9-5bF_E9G_p-fs`,
  },
});


export default axiosClient;

