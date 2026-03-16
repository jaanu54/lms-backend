import axios from 'axios';

// Use the Render backend URL directly - make sure this is correct
const API_URL = 'https://lms-backend-api-427k.onrender.com/api';

const api = axios.create({
  baseURL: API_URL,
  // Temporarily disable withCredentials for debugging
  withCredentials: false, // CHANGE THIS FROM true TO false
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Log the full request URL for debugging
    console.log('🚀 Request:', {
      url: `${config.baseURL}${config.url}`,
      method: config.method,
      data: config.data,
      withCredentials: config.withCredentials
    });
    
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle responses
api.interceptors.response.use(
  (response) => {
    console.log('✅ Response:', response.data);
    return response.data;
  },
  (error) => {
    console.error('❌ Error:', {
      message: error.message,
      code: error.code,
      response: error.response?.data,
      status: error.response?.status,
      config: {
        url: error.config?.url,
        method: error.config?.method,
        withCredentials: error.config?.withCredentials
      }
    });
    
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
    return Promise.reject(error);
  }
);

export default api;
