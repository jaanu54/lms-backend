import api from './api';

const emailService = {
  // Send enrollment confirmation
  sendEnrollmentConfirmation: async (enrollmentId) => {
    try {
      const response = await api.post('/email/enrollment-confirmation', { enrollmentId });
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Send course completion certificate
  sendCertificateEmail: async (enrollmentId) => {
    try {
      const response = await api.post('/email/send-certificate', { enrollmentId });
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Send course reminder
  sendCourseReminder: async (courseId) => {
    try {
      const response = await api.post('/email/course-reminder', { courseId });
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Get email settings
  getEmailSettings: async () => {
    try {
      const response = await api.get('/email/settings');
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Update email settings
  updateEmailSettings: async (settings) => {
    try {
      const response = await api.put('/email/settings', settings);
      return response;
    } catch (error) {
      throw error;
    }
  }
};

export default emailService;