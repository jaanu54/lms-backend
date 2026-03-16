import api from './api';

const dashboardService = {
  getDashboardStats: async () => {
    try {
      // Try multiple endpoints
      const [courses, students, enrollments] = await Promise.all([
        api.get('/courses').catch(() => ({ total: 0 })),
        api.get('/students').catch(() => ({ total: 0 })),
        api.get('/enrollments/stats/overview').catch(() => ({}))
      ]);

      return {
        totalCourses: courses.length || 0,
        totalStudents: students.length || 0,
        activeEnrollments: enrollments.activeEnrollments || 0,
        completionRate: enrollments.completionRate || 0,
        enrollmentTrends: null,
        popularCourses: null
      };
    } catch (error) {
      console.error('Dashboard service error:', error);
      // Return default values
      return {
        totalCourses: 0,
        totalStudents: 0,
        activeEnrollments: 0,
        completionRate: 0,
        enrollmentTrends: null,
        popularCourses: null
      };
    }
  },

  getEnrollmentTrends: async (period = 'month') => {
    try {
      const response = await api.get(`/enrollments/trends/${period}`);
      return response;
    } catch (error) {
      console.error('Error fetching trends:', error);
      return null;
    }
  },

  getCoursePopularity: async () => {
    try {
      const response = await api.get('/courses/popularity');
      return response;
    } catch (error) {
      console.error('Error fetching course popularity:', error);
      return null;
    }
  }
};

export default dashboardService;
