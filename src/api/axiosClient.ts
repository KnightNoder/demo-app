import axios from "axios";

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
    sitename: "current",
<<<<<<< Updated upstream

    // Authorization: `Bearer ${localStorage.getItem("JWT_AUTH_TOKEN")}`,
    Authorization: `Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoxLCJ1c2VybmFtZSI6ImFkbWluIiwicm9sZXMiOlsiYWRtaW4iXSwiaWF0IjoxNzQ0NDU3Njc5LCJleHAiOjE3NDQ0NjEyNzl9.XeyhtJbGzpGt_-720ZsfM15BA82fL5Ih4GZkq--7khY`,

=======
    //Authorization: `Bearer ${localStorage.getItem("JWT_AUTH_TOKEN")}`,
     Authorization: `Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoxLCJ1c2VybmFtZSI6ImFkbWluIiwicm9sZXMiOlsiYWRtaW4iXSwiaWF0IjoxNzQ0NDYyNTM4LCJleHAiOjE3NDQ0NjYxMzh9.AWd2EpUBEPfKEo_2NN76pq0A42_rObr6waE_5n1R0bg`,
>>>>>>> Stashed changes
  },
});


export default axiosClient;

