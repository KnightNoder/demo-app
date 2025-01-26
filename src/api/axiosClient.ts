import axios from "axios";
import { CONFIG } from "../constants";

const axiosClient = axios.create({
  baseURL: CONFIG.REST_API_ENDPOINT, 
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosClient;
