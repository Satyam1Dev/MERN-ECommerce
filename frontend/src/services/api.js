import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api',
});

// Request interceptor to add auth token
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling - NO AUTOMATIC REDIRECT
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Just clear tokens, don't redirect automatically
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      console.log('🔐 Session expired - tokens cleared');
    }
    return Promise.reject(error);
  }
);

export default API;