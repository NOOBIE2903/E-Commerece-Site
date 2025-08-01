import axios from "axios";
import { jwtDecode } from "jwt-decode";

export const BASE_URL = import.meta.env.VITE_BASE_URL || "http://127.0.0.1:8001";

const api = axios.create({
  baseURL: BASE_URL,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access");
    if (token && token !== "undefined") {
      try {
        const decoded = jwtDecode(token);
        const expiryTime = decoded.exp;
        const currentTime = Date.now() / 1000;

        if (expiryTime > currentTime) {
          config.headers.Authorization = `Bearer ${token}`;
        } else {
          localStorage.removeItem("access");
        }
      } catch (err) {
        console.error("Invalid token", err);
        localStorage.removeItem("access");
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
