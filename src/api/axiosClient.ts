import axios from "axios";

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${localStorage.getItem("JWT_AUTH_TOKEN")}`,
  },
});


// Attach token from localStorage to every request


export default axiosClient;
