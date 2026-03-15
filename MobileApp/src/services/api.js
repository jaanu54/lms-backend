import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'https://lilylike-nannie-dandiacally.ngrok-free.dev/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'ngrok-skip-browser-warning': 'true',
  },
  timeout: 10000,
});

// Transform response to map instructor IDs to names
api.interceptors.response.use(
  (response) => {
    // If this is a courses request, transform instructor IDs
    if (response.config.url.includes('/courses')) {
      const instructorMap = {
        '69b4edbeddd13e32c520fb24': 'Dr. Sarah Johnson',
        '69b4f1ddddd13e32c520fb31': 'Prof. Michael Chen',
        'default': 'Instructor'
      };
      
      const transformCourse = (course) => ({
        ...course,
        instructorName: instructorMap[course.instructor] || instructorMap.default,
        displayDuration: course.duration ? `${course.duration} weeks` : '8 weeks',
      });
      
      if (Array.isArray(response.data)) {
        response.data = response.data.map(transformCourse);
      } else if (Array.isArray(response)) {
        response = response.map(transformCourse);
      }
    }
    return response;
  },
  (error) => Promise.reject(error)
);

api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
