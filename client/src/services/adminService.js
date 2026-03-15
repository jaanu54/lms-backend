import api from './api';

const adminService = {
  // Get dashboard statistics
  getStats: async () => {
    try {
      const response = await api.get('/admin/stats');
      return response;
    } catch (error) {
      console.error('getStats error:', error);
      // Return default structure to prevent UI crashes
      return {
        overview: { totalUsers: 0, totalCourses: 0, totalStudents: 0, totalEnrollments: 0 },
        recentEnrollments: [],
        popularCourses: []
      };
    }
  },

  // Get all users
  getUsers: async () => {
    try {
      const response = await api.get('/admin/users');
      return response || [];
    } catch (error) {
      console.error('getUsers error:', error);
      return [];
    }
  },

  // Update user role
  updateUserRole: async (userId, role) => {
    try {
      const response = await api.put(`/admin/users/${userId}/role`, { role });
      return response;
    } catch (error) {
      console.error('updateUserRole error:', error);
      throw error;
    }
  },

  // Toggle user status
  toggleUserStatus: async (userId, isActive) => {
    try {
      const response = await api.put(`/admin/users/${userId}/status`, { isActive });
      return response;
    } catch (error) {
      console.error('toggleUserStatus error:', error);
      throw error;
    }
  },

  // Get system logs
  getLogs: async () => {
    try {
      const response = await api.get('/admin/logs');
      return response || [];
    } catch (error) {
      console.error('getLogs error:', error);
      return []; // Return empty array instead of throwing
    }
  }
};

export default adminService;
