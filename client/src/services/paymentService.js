import api from './api';

const paymentService = {
  // Create payment intent
  createPaymentIntent: async (courseId) => {
    try {
      const response = await api.post('/payments/create-intent', { courseId });
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Get payment history
  getPaymentHistory: async () => {
    try {
      const response = await api.get('/payments/history');
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Get invoice
  getInvoice: async (paymentId) => {
    try {
      const response = await api.get(`/payments/invoice/${paymentId}`, {
        responseType: 'blob'
      });
      
      // Download invoice
      const blob = new Blob([response], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `invoice-${paymentId}.pdf`;
      link.click();
      
      return true;
    } catch (error) {
      throw error;
    }
  }
};

export default paymentService;