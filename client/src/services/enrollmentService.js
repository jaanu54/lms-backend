
import api from './api';

const enrollmentService = {
  // Get all enrollments
  getAllEnrollments: async () => {
    try {
      const response = await api.get('/enrollments');
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Get enrollments by student
  getEnrollmentsByStudent: async (studentId) => {
    try {
      const response = await api.get(`/enrollments/student/${studentId}`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Get enrollments by course
  getEnrollmentsByCourse: async (courseId) => {
    try {
      const response = await api.get(`/enrollments/course/${courseId}`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Create new enrollment
  createEnrollment: async (enrollmentData) => {
    try {
      const response = await api.post('/enrollments', enrollmentData);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Update enrollment
  updateEnrollment: async (id, enrollmentData) => {
    try {
      const response = await api.put(`/enrollments/${id}`, enrollmentData);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Delete enrollment (drop course)
  deleteEnrollment: async (id) => {
    try {
      const response = await api.delete(`/enrollments/${id}`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Get enrollment statistics
  getEnrollmentStats: async () => {
    try {
      const response = await api.get('/enrollments/stats/overview');
      return response;
    } catch (error) {
      throw error;
    }
  }
};

export default enrollmentService;
