import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:5000", // ✅ NOT ending in /api
  withCredentials: true, // ✅ important for sending cookies or JWT with CORS
});

instance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default instance;
