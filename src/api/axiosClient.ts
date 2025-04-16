import axios from "axios";

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
    sitename: import.meta.env.VITE_SITE_NAME,
    Authorization: `Bearer ${localStorage.getItem("JWT_AUTH_TOKEN")}`,
    // Authorization: `Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoxLCJ1c2VybmFtZSI6ImFkbWluIiwicm9sZXMiOlsiYWRtaW4iXSwiaWF0IjoxNzQ0Nzg1MDkzLCJleHAiOjE3NDQ3ODg2OTN9.NRcyT0iouuquHrB4j0llG8ldWHHCLyyymQQtzJ8qvHk`,
  },
});


export default axiosClient;

