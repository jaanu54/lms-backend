import api from './api';

const reportsService = {
  // Get enrollment reports
  getEnrollmentReports: async () => {
    try {
      const response = await api.get('/reports/enrollments');
      return response.data || response;
    } catch (error) {
      console.error('Error fetching enrollment reports:', error);
      throw error;
    }
  },

  // Get revenue reports
  getRevenueReports: async () => {
    try {
      const response = await api.get('/reports/revenue');
      return response.data || response;
    } catch (error) {
      console.error('Error fetching revenue reports:', error);
      throw error;
    }
  },

  // Get completion rates
  getCompletionRates: async () => {
    try {
      const response = await api.get('/reports/completion-rates');
      return response.data || response;
    } catch (error) {
      console.error('Error fetching completion rates:', error);
      throw error;
    }
  },

  // Dashboard analytics
  getDashboardAnalytics: async () => {
    try {
      const [courses, students, enrollments] = await Promise.all([
        api.get('/courses').catch(() => []),
        api.get('/students').catch(() => []),
        api.get('/enrollments').catch(() => [])
      ]);
      
      return {
        totalCourses: courses.length || 0,
        totalStudents: students.length || 0,
        totalEnrollments: enrollments.length || 0,
        activeEnrollments: enrollments.filter(e => e.status === 'active').length || 0
      };
    } catch (error) {
      console.error('Error fetching dashboard analytics:', error);
      return {
        totalCourses: 0,
        totalStudents: 0,
        totalEnrollments: 0,
        activeEnrollments: 0
      };
    }
  }
};

export default reportsService;
