import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const Payment = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [course, setCourse] = useState(null);

  useEffect(() => {
    // If there's a courseId, fetch course details
    if (courseId) {
      // Mock fetch course
      setCourse({
        id: courseId,
        title: 'Sample Course',
        price: 49.99
      });
    } else {
      // No courseId, show sample payment
      setCourse({
        id: 'sample',
        title: 'Sample Course',
        price: 49.99
      });
    }
  }, [courseId]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate payment processing
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      setTimeout(() => navigate('/courses'), 2000);
    }, 2000);
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
          <div className="text-green-500 text-5xl mb-4">✓</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment Successful!</h2>
          <p className="text-gray-600 mb-4">Thank you for your purchase.</p>
          <p className="text-sm text-gray-500">Redirecting to courses...</p>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-md mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Payment Details</h1>
          
          <form onSubmit={handleSubmit}>
            <div className="mb-4 p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">Course: <span className="font-semibold">{course.title}</span></p>
              <p className="text-sm text-gray-600">Amount: <span className="font-semibold text-primary-600">${course.price}</span></p>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Card Number
              </label>
              <input
                type="text"
                placeholder="4242 4242 4242 4242"
                className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-primary-500"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Expiry
                </label>
                <input
                  type="text"
                  placeholder="MM/YY"
                  className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-primary-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  CVV
                </label>
                <input
                  type="text"
                  placeholder="123"
                  className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-primary-500"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50"
            >
              {loading ? 'Processing...' : `Pay $${course.price}`}
            </button>
          </form>

          <p className="text-xs text-gray-500 text-center mt-4">
            Test card: 4242 4242 4242 4242 | Any future expiry | Any CVV
          </p>
        </div>
      </div>
    </div>
  );
};

export default Payment;