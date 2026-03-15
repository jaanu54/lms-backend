import api from './api';

const reportsService = {
  // Get enrollment reports
  getEnrollmentReports: async (filters = {}) => {
    try {
      const queryParams = new URLSearchParams(filters).toString();
      const url = queryParams ? `/reports/enrollments?${queryParams}` : '/reports/enrollments';
      const response = await api.get(url);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Get student progress reports
  getStudentProgress: async (filters = {}) => {
    try {
      const queryParams = new URLSearchParams(filters).toString();
      const url = queryParams ? `/reports/student-progress?${queryParams}` : '/reports/student-progress';
      const response = await api.get(url);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Get course completion rates
  getCompletionRates: async () => {
    try {
      const response = await api.get('/reports/completion-rates');
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Get revenue reports (if you have payments)
  getRevenueReports: async (period = 'monthly') => {
    try {
      const response = await api.get(`/reports/revenue?period=${period}`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Export data to CSV
  exportToCSV: async (reportType, filters = {}) => {
    try {
      const queryParams = new URLSearchParams(filters).toString();
      const url = queryParams 
        ? `/reports/export/${reportType}?${queryParams}` 
        : `/reports/export/${reportType}`;
      
      const response = await api.get(url, {
        responseType: 'blob'
      });
      
      // Create download link
      const blob = new Blob([response], { type: 'text/csv' });
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = `${reportType}-report-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      return true;
    } catch (error) {
      throw error;
    }
  },

  // Get dashboard analytics
  getDashboardAnalytics: async () => {
    try {
      const response = await api.get('/reports/dashboard-analytics');
      return response;
    } catch (error) {
      throw error;
    }
  }
};

export default reportsService;