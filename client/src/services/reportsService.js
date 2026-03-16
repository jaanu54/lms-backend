import api from './api';

const reportsService = {
  getEnrollmentReports: async () => {
    try {
      const response = await api.get('/reports/enrollments');
      return response.data;
    } catch (error) {
      console.error('Error fetching enrollment reports:', error);
      return { data: { overview: {}, recentEnrollments: [], trends: {} } };
    }
  },

  getRevenueReports: async () => {
    try {
      const response = await api.get('/reports/revenue');
      return response.data;
    } catch (error) {
      console.error('Error fetching revenue reports:', error);
      return { data: { totalRevenue: 0, courseRevenue: [], monthlyRevenue: [] } };
    }
  },

  getCompletionReports: async () => {
    try {
      const response = await api.get('/reports/completion');
      return response.data;
    } catch (error) {
      console.error('Error fetching completion reports:', error);
      return { data: [] };
    }
  }
};

export default reportsService;
