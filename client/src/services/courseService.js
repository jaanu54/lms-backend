import api from './api';

const courseService = {
  // Get all courses with filters
  getAllCourses: async (filters = {}) => {
    try {
      const queryParams = new URLSearchParams(filters).toString();
      const url = queryParams ? `/courses?${queryParams}` : '/courses';
      const response = await api.get(url);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Get featured courses
  getFeaturedCourses: async () => {
    try {
      const response = await api.get('/courses/featured');
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Get course categories
  getCategories: async () => {
    try {
      const response = await api.get('/courses/categories');
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Get single course with full details
  getCourseById: async (id) => {
    try {
      const response = await api.get(`/courses/${id}`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Create new course
  createCourse: async (courseData) => {
    try {
      const response = await api.post('/courses', courseData);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Update course
  updateCourse: async (id, courseData) => {
    try {
      const response = await api.put(`/courses/${id}`, courseData);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Delete course
  deleteCourse: async (id) => {
    try {
      const response = await api.delete(`/courses/${id}`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // ===== Module Methods =====
  
  // Get modules for a course
  getModules: async (courseId) => {
    try {
      const response = await api.get(`/courses/${courseId}/modules`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Add module to course
  addModule: async (courseId, moduleData) => {
    try {
      const response = await api.post(`/courses/${courseId}/modules`, moduleData);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Update module
  updateModule: async (moduleId, moduleData) => {
    try {
      const response = await api.put(`/courses/modules/${moduleId}`, moduleData);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Delete module
  deleteModule: async (moduleId) => {
    try {
      const response = await api.delete(`/courses/modules/${moduleId}`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // ===== Lesson Methods =====
  
  // Get lessons for a module
  getLessons: async (moduleId) => {
    try {
      const response = await api.get(`/courses/modules/${moduleId}/lessons`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Add lesson to module
  addLesson: async (moduleId, lessonData) => {
    try {
      const response = await api.post(`/courses/modules/${moduleId}/lessons`, lessonData);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Update lesson
  updateLesson: async (lessonId, lessonData) => {
    try {
      const response = await api.put(`/courses/lessons/${lessonId}`, lessonData);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Delete lesson
  deleteLesson: async (lessonId) => {
    try {
      const response = await api.delete(`/courses/lessons/${lessonId}`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // ===== Review Methods =====
  
  // Add review to course
  addReview: async (courseId, reviewData) => {
    try {
      const response = await api.post(`/courses/${courseId}/reviews`, reviewData);
      return response;
    } catch (error) {
      throw error;
    }
  }
};

export default courseService;