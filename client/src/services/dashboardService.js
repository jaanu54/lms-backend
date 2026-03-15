
import api from './api';

const dashboardService = {
  // Get all dashboard stats in one call
  getDashboardStats: async () => {
    try {
      const [courses, students, enrollments] = await Promise.all([
        api.get('/courses'),
        api.get('/students'),
        api.get('/enrollments/stats/overview')
      ]);
      
      return {
        courses: courses.length || 0,
        students: students.length || 0,
        enrollments: enrollments || { total: 0, active: 0, completed: 0, dropped: 0 }
      };
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      throw error;
    }
  },

  // Get enrollment trends over time
  getEnrollmentTrends: async () => {
    try {
      const enrollments = await api.get('/enrollments');
      
      // Process enrollments by month
      const trends = enrollments.reduce((acc, enrollment) => {
        const date = new Date(enrollment.enrollmentDate);
        const monthYear = `${date.getMonth() + 1}/${date.getFullYear()}`;
        
        if (!acc[monthYear]) {
          acc[monthYear] = 0;
        }
        acc[monthYear]++;
        return acc;
      }, {});
      
      return trends;
    } catch (error) {
      console.error('Error fetching trends:', error);
      throw error;
    }
  },

  // Get course popularity data
  getCoursePopularity: async () => {
    try {
      const enrollments = await api.get('/enrollments');
      
      const courseCounts = enrollments.reduce((acc, enrollment) => {
        const courseTitle = enrollment.course?.title || 'Unknown';
        if (!acc[courseTitle]) {
          acc[courseTitle] = 0;
        }
        acc[courseTitle]++;
        return acc;
      }, {});
      
      return courseCounts;
    } catch (error) {
      console.error('Error fetching course popularity:', error);
      throw error;
    }
  },

  // Get student status distribution
  getStudentStatusDistribution: async () => {
    try {
      const students = await api.get('/students');
      
      const statusCounts = students.reduce((acc, student) => {
        const status = student.status || 'active';
        acc[status] = (acc[status] || 0) + 1;
        return acc;
      }, { active: 0, inactive: 0, graduated: 0, suspended: 0 });
      
      return statusCounts;
    } catch (error) {
      console.error('Error fetching student status:', error);
      throw error;
    }
  }
};

export default dashboardService;
