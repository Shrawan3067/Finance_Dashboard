import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8001';

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add role parameter to requests if available
api.interceptors.request.use((config) => {
  const userRole = localStorage.getItem('userRole');
  
  // Don't add role to auth endpoints
  if (!config.url.includes('/api/auth/login') && 
      !config.url.includes('/api/auth/register') && 
      userRole) {
    // Add role as query parameter
    if (config.params) {
      config.params.role = userRole;
    } else {
      config.params = { role: userRole };
    }
  }
  return config;
});

export default api;
