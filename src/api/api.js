import axios from "axios";

// 🔥 FINAL FIX: Works on both Vercel (frontend) and Render (backend)
const API_URL = import.meta.env.VITE_API_URL || 'https://campusshare-backend-1.onrender.com/api';

console.log('🌐 API Base URL:', API_URL);

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  // Don't set Content-Type for FormData (file uploads)
  if (config.data instanceof FormData) {
    delete config.headers['Content-Type'];
    console.log('📤 Uploading FormData with file');
  }
  
  // Log requests in development
  if (import.meta.env.DEV) {
    console.log(`🚀 ${config.method.toUpperCase()} ${config.baseURL}${config.url}`, config.data || '');
  }
  
  return config;
});

// Response interceptor
api.interceptors.response.use(
  (response) => {
    if (import.meta.env.DEV) {
      console.log('✅ Response:', response.status, response.data);
    }
    return response;
  },
  (error) => {
    console.error('❌ API Error:', {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      data: error.response?.data,
      message: error.message
    });

    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;