import axios from "axios";

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
    sitename: import.meta.env.VITE_SITE_NAME,
    Authorization: `Bearer ${localStorage.getItem("JWT_AUTH_TOKEN")}`,
<<<<<<< HEAD
    //Authorization: `Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoxLCJ1c2VybmFtZSI6ImFkbWluIiwicm9sZXMiOlsiYWRtaW4iXSwiaWF0IjoxNzQ0ODE3NTYyLCJleHAiOjE3NDQ4MjExNjJ9.vcxPUcTJ1MlFboXPD1l0ZONsSxpfP0x4-1HH3w58DSc`,
=======
    // Authorization: `Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoxLCJ1c2VybmFtZSI6ImFkbWluIiwicm9sZXMiOlsiYWRtaW4iXSwiaWF0IjoxNzQ0ODg1NDMyLCJleHAiOjE3NDQ4ODkwMzJ9.N6E8VgKM6bch4DsykqWwKZLxIpBcVjREuYHDJWTMILk`,
>>>>>>> aad76383cb6e74f1b8002a5ba1fe16cf85a31914
  },
});


export default axiosClient;

