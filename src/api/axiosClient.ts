import axios from "axios";

const axiosClient = axios.create({
  baseURL: "https://dummyjson.com", // REST API base URL
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosClient;
