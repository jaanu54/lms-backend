import { useState, useEffect } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import studentService from '../../services/studentService';

const StudentModal = ({ isOpen, onClose, student, mode }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    status: 'active'
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (student && (mode === 'edit' || mode === 'view')) {
      setFormData({
        firstName: student.firstName || '',
        lastName: student.lastName || '',
        email: student.email || '',
        phone: student.phone || '',
        dateOfBirth: student.dateOfBirth ? student.dateOfBirth.split('T')[0] : '',
        address: student.address || '',
        city: student.city || '',
        state: student.state || '',
        zipCode: student.zipCode || '',
        status: student.status || 'active'
      });
    } else {
      // Reset form for add mode
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        dateOfBirth: '',
        address: '',
        city: '',
        state: '',
        zipCode: '',
        status: 'active'
      });
    }
  }, [student, mode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (mode === 'add') {
        await studentService.createStudent(formData);
      } else if (mode === 'edit') {
        await studentService.updateStudent(student._id, formData);
      }
      onClose(true); // Pass true to indicate refresh needed
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save student');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const isViewMode = mode === 'view';

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={() => onClose()}
      ></div>

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b sticky top-0 bg-white">
            <h3 className="text-xl font-semibold text-gray-900">
              {mode === 'add' ? 'Add New Student' : 
               mode === 'edit' ? 'Edit Student' : 
               'Student Details'}
            </h3>
            <button
              onClick={() => onClose()}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          {/* Body */}
          <form onSubmit={handleSubmit} className="p-4">
            {error && (
              <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded text-sm">
                {error}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* First Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  First Name *
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  disabled={isViewMode}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md 
                           focus:outline-none focus:ring-2 focus:ring-primary-500 
                           disabled:bg-gray-100 disabled:text-gray-600"
                  placeholder="Enter first name"
                />
              </div>

              {/* Last Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Last Name *
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  disabled={isViewMode}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md 
                           focus:outline-none focus:ring-2 focus:ring-primary-500 
                           disabled:bg-gray-100 disabled:text-gray-600"
                  placeholder="Enter last name"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={isViewMode}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md 
                           focus:outline-none focus:ring-2 focus:ring-primary-500 
                           disabled:bg-gray-100 disabled:text-gray-600"
                  placeholder="Enter email address"
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone *
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  disabled={isViewMode}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md 
                           focus:outline-none focus:ring-2 focus:ring-primary-500 
                           disabled:bg-gray-100 disabled:text-gray-600"
                  placeholder="Enter phone number"
                />
              </div>

              {/* Date of Birth */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date of Birth
                </label>
                <input
                  type="date"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                  disabled={isViewMode}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md 
                           focus:outline-none focus:ring-2 focus:ring-primary-500 
                           disabled:bg-gray-100 disabled:text-gray-600"
                />
              </div>

              {/* Status - Only for edit/view */}
              {mode !== 'add' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    disabled={isViewMode}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md 
                             focus:outline-none focus:ring-2 focus:ring-primary-500 
                             disabled:bg-gray-100"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="graduated">Graduated</option>
                    <option value="suspended">Suspended</option>
                  </select>
                </div>
              )}

              {/* Address - Full width on mobile, half on desktop */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  disabled={isViewMode}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md 
                           focus:outline-none focus:ring-2 focus:ring-primary-500 
                           disabled:bg-gray-100 disabled:text-gray-600"
                  placeholder="Enter street address"
                />
              </div>

              {/* City */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  City
                </label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  disabled={isViewMode}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md 
                           focus:outline-none focus:ring-2 focus:ring-primary-500 
                           disabled:bg-gray-100 disabled:text-gray-600"
                  placeholder="Enter city"
                />
              </div>

              {/* State */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  State
                </label>
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  disabled={isViewMode}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md 
                           focus:outline-none focus:ring-2 focus:ring-primary-500 
                           disabled:bg-gray-100 disabled:text-gray-600"
                  placeholder="Enter state"
                />
              </div>

              {/* Zip Code */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  ZIP Code
                </label>
                <input
                  type="text"
                  name="zipCode"
                  value={formData.zipCode}
                  onChange={handleChange}
                  disabled={isViewMode}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md 
                           focus:outline-none focus:ring-2 focus:ring-primary-500 
                           disabled:bg-gray-100 disabled:text-gray-600"
                  placeholder="Enter ZIP code"
                />
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-end space-x-3 mt-6 pt-4 border-t">
              <button
                type="button"
                onClick={() => onClose()}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md 
                         hover:bg-gray-200 transition-colors"
              >
                {isViewMode ? 'Close' : 'Cancel'}
              </button>
              
              {!isViewMode && (
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-primary-600 text-white rounded-md 
                           hover:bg-primary-700 transition-colors 
                           disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Saving...' : 
                   mode === 'add' ? 'Create Student' : 'Update Student'}
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default StudentModal;