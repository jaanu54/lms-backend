import api from './api';

const studentService = {
  // Get all students
  getAllStudents: async () => {
    try {
      const response = await api.get('/students');
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Get single student
  getStudentById: async (id) => {
    try {
      const response = await api.get(`/students/${id}`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Create new student
  createStudent: async (studentData) => {
    try {
      const response = await api.post('/students', studentData);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Update student
  updateStudent: async (id, studentData) => {
    try {
      const response = await api.put(`/students/${id}`, studentData);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Delete student
  deleteStudent: async (id) => {
    try {
      const response = await api.delete(`/students/${id}`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Get student enrollments
  getStudentEnrollments: async (studentId) => {
    try {
      const response = await api.get(`/enrollments/student/${studentId}`);
      return response;
    } catch (error) {
      throw error;
    }
  }
};

export default studentService;