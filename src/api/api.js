import axios from "axios";

// 🔥 FIXED: Get the FULL backend URL based on environment
const getBaseURL = () => {
  // Production - use your Render backend URL
  if (import.meta.env.PROD) {
    return 'https://campusshare-backend.onrender.com/api';
  }
  
  // Development - use environment variable or localhost
  return import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
};

const api = axios.create({
  baseURL: getBaseURL(),
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  // 🔥 IMPORTANT: Don't set Content-Type for FormData (file uploads)
  if (config.data instanceof FormData) {
    delete config.headers['Content-Type'];
  }
  
  console.log(`🚀 API Request: ${config.method.toUpperCase()} ${config.baseURL}${config.url}`);
  return config;
});

api.interceptors.response.use(
  (response) => {
    console.log(`✅ API Response: ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error(`❌ API Error:`, {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      message: error.response?.data?.message || error.message
    });

    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = '/login';
    }
    
    return Promise.reject(error);
  }
);

export default api;