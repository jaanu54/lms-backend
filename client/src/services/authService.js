import api from './api';

const authService = {
  // Login user
  login: async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      
      // If login successful, store token and user data
      if (response.token) {
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
      }
      
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Register new user
  register: async (userData) => {
    try {
      const response = await api.post('/auth/register', userData);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Logout user
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  // Get current user
  // Get current user
getCurrentUser: () => {
  const userStr = localStorage.getItem('user');
  if (userStr && userStr !== 'undefined' && userStr !== 'null') {
    try {
      return JSON.parse(userStr);
    } catch (e) {
      console.error('Error parsing user data:', e);
      localStorage.removeItem('user');
      return null;
    }
  }
  return null;
},
  // Check if user is authenticated
  isAuthenticated: () => {
    return localStorage.getItem('token') !== null;
  }
};

export default authService;