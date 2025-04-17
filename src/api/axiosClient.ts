import axios from "axios";

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
    sitename: import.meta.env.VITE_SITE_NAME,
    Authorization: `Bearer ${localStorage.getItem("JWT_AUTH_TOKEN")}`,
<<<<<<< HEAD
    // Authorization: `Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoxLCJ1c2VybmFtZSI6ImFkbWluIiwicm9sZXMiOlsiYWRtaW4iXSwiaWF0IjoxNzQ0ODg1NDMyLCJleHAiOjE3NDQ4ODkwMzJ9.N6E8VgKM6bch4DsykqWwKZLxIpBcVjREuYHDJWTMILk`,
=======
    //Authorization: `Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoxLCJ1c2VybmFtZSI6ImFkbWluIiwicm9sZXMiOlsiYWRtaW4iXSwiaWF0IjoxNzQ0ODE3NTYyLCJleHAiOjE3NDQ4MjExNjJ9.vcxPUcTJ1MlFboXPD1l0ZONsSxpfP0x4-1HH3w58DSc`,
>>>>>>> 6cbf5362f3656954434bcb606c834571a28b24fc
  },
});


export default axiosClient;

