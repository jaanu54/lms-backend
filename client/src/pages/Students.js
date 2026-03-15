import { useState, useEffect } from 'react';
import { 
  PencilIcon, 
  TrashIcon, 
  PlusIcon,
  EnvelopeIcon,
  PhoneIcon,
  AcademicCapIcon 
} from '@heroicons/react/24/outline';
import studentService from '../services/studentService';
import StudentModal from '../components/students/StudentModal';
import DeleteConfirmationModal from '../components/common/DeleteConfirmationModal';

const Students = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [modalMode, setModalMode] = useState('add');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const data = await studentService.getAllStudents();
      setStudents(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch students');
      console.error('Error fetching students:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddStudent = () => {
    setModalMode('add');
    setSelectedStudent(null);
    setIsModalOpen(true);
  };

  const handleEditStudent = (student) => {
    setModalMode('edit');
    setSelectedStudent(student);
    setIsModalOpen(true);
  };

  const handleViewStudent = (student) => {
    setModalMode('view');
    setSelectedStudent(student);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (student) => {
    setSelectedStudent(student);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await studentService.deleteStudent(selectedStudent._id);
      await fetchStudents();
      setIsDeleteModalOpen(false);
      setSelectedStudent(null);
    } catch (err) {
      console.error('Error deleting student:', err);
      setError('Failed to delete student');
    }
  };

  const handleModalClose = (refreshNeeded = false) => {
    setIsModalOpen(false);
    setSelectedStudent(null);
    if (refreshNeeded) {
      fetchStudents();
    }
  };

  // Filter students based on search and status
  const filteredStudents = students.filter(student => {
    const fullName = `${student.firstName} ${student.lastName}`.toLowerCase();
    const email = student.email.toLowerCase();
    const searchLower = searchTerm.toLowerCase();
    
    const matchesSearch = searchTerm === '' || 
      fullName.includes(searchLower) || 
      email.includes(searchLower);
    
    const matchesStatus = statusFilter === 'all' || student.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Get status badge color
  const getStatusBadgeColor = (status) => {
    switch(status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-gray-100 text-gray-800';
      case 'graduated':
        return 'bg-blue-100 text-blue-800';
      case 'suspended':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h1 className="text-3xl font-bold text-gray-800">Students</h1>
        <button
          onClick={handleAddStudent}
          className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
        >
          <PlusIcon className="h-5 w-5" />
          <span>Add New Student</span>
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          
          {/* Status Filter */}
          <div className="md:w-48">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="graduated">Graduated</option>
              <option value="suspended">Suspended</option>
            </select>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {/* Students Grid */}
      {filteredStudents.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <AcademicCapIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">
            {searchTerm || statusFilter !== 'all' 
              ? 'No students match your filters' 
              : 'No students found. Click "Add New Student" to create one.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStudents.map((student) => (
            <div
              key={student._id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              {/* Student Header with Avatar */}
              <div className="bg-gradient-to-r from-primary-500 to-primary-700 p-4">
                <div className="flex items-center space-x-4">
                  {/* Avatar with initials */}
                  <div className="h-16 w-16 rounded-full bg-white flex items-center justify-center">
                    <span className="text-2xl font-bold text-primary-600">
                      {student.firstName?.charAt(0)}{student.lastName?.charAt(0)}
                    </span>
                  </div>
                  <div className="text-white">
                    <h3 className="text-xl font-semibold">
                      {student.firstName} {student.lastName}
                    </h3>
                    <p className="text-sm opacity-90">Student ID: {student._id.slice(-6)}</p>
                  </div>
                </div>
              </div>

              {/* Student Details */}
              <div className="p-4">
                <div className="space-y-3">
                  {/* Email */}
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <EnvelopeIcon className="h-4 w-4" />
                    <span>{student.email}</span>
                  </div>
                  
                  {/* Phone */}
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <PhoneIcon className="h-4 w-4" />
                    <span>{student.phone}</span>
                  </div>

                  {/* Status */}
                  <div className="flex items-center justify-between">
                    <span className={`px-2 py-1 text-xs rounded-full ${getStatusBadgeColor(student.status)}`}>
                      {student.status || 'active'}
                    </span>
                    
                    {/* Location if available */}
                    {student.city && student.state && (
                      <span className="text-xs text-gray-500">
                        {student.city}, {student.state}
                      </span>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end space-x-2 mt-4 pt-4 border-t">
                  <button
                    onClick={() => handleViewStudent(student)}
                    className="p-2 text-gray-600 hover:text-primary-600 hover:bg-gray-100 rounded-full transition-colors"
                    title="View Details"
                  >
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => handleEditStudent(student)}
                    className="p-2 text-gray-600 hover:text-blue-600 hover:bg-gray-100 rounded-full transition-colors"
                    title="Edit Student"
                  >
                    <PencilIcon className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleDeleteClick(student)}
                    className="p-2 text-gray-600 hover:text-red-600 hover:bg-gray-100 rounded-full transition-colors"
                    title="Delete Student"
                  >
                    <TrashIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Student Modal */}
      <StudentModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        student={selectedStudent}
        mode={modalMode}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete Student"
        message={`Are you sure you want to delete "${selectedStudent?.firstName} ${selectedStudent?.lastName}"? This action cannot be undone.`}
      />
    </div>
  );
};

export default Students;