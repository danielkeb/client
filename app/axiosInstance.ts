import axios from "axios";
import { getCookie } from "./lib/cookies";

const axiosInstance = axios.create();

axiosInstance.interceptors.request.use(
  (config) => {
    const token = getCookie("token");

    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

export default axiosInstance;
