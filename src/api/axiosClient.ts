import axios from "axios";

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${localStorage.getItem("JWT_AUTH_TOKEN")}`,
    // "Authorization": `Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoxLCJ1c2VybmFtZSI6ImFkbWluIiwicm9sZXMiOlsiYWRtaW4iXSwiaWF0IjoxNzQyNDY0NDM0LCJleHAiOjE3NDI0NjgwMzR9.rbfo6P0aE4Qd93MghYaad4hVYyTLQwuLQVGRyB1E5zY`,
  },
});


// Attach token from localStorage to every request


export default axiosClient;

