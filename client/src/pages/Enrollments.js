
import React, { useState, useEffect } from 'react';
import { 
  UserGroupIcon, 
  AcademicCapIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  CheckCircleIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';
import enrollmentService from '../services/enrollmentService';
import courseService from '../services/courseService';
import studentService from '../services/studentService';
import EnrollmentModal from '../components/enrollments/EnrollmentModal';
import DeleteConfirmationModal from '../components/common/DeleteConfirmationModal';

const Enrollments = () => {
  const [enrollments, setEnrollments] = useState([]);
  const [courses, setCourses] = useState([]);
  const [students, setStudents] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    completed: 0,
    dropped: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedEnrollment, setSelectedEnrollment] = useState(null);
  const [filter, setFilter] = useState('all'); // all, active, completed, dropped

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [enrollmentsData, coursesData, studentsData, statsData] = await Promise.all([
        enrollmentService.getAllEnrollments(),
        courseService.getAllCourses(),
        studentService.getAllStudents(),
        enrollmentService.getEnrollmentStats()
      ]);
      
      setEnrollments(enrollmentsData || []);
      setCourses(coursesData || []);
      setStudents(studentsData || []);
      setStats(statsData || { total: 0, active: 0, completed: 0, dropped: 0 });
      setError(null);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Failed to fetch enrollment data');
    } finally {
      setLoading(false);
    }
  };

  const handleAddEnrollment = () => {
    setSelectedEnrollment(null);
    setIsModalOpen(true);
  };

  const handleEditEnrollment = (enrollment) => {
    setSelectedEnrollment(enrollment);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (enrollment) => {
    setSelectedEnrollment(enrollment);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await enrollmentService.deleteEnrollment(selectedEnrollment._id);
      await fetchData();
      setIsDeleteModalOpen(false);
      setSelectedEnrollment(null);
    } catch (err) {
      console.error('Error deleting enrollment:', err);
      setError('Failed to delete enrollment');
    }
  };

  const handleModalClose = (refreshNeeded = false) => {
    setIsModalOpen(false);
    setSelectedEnrollment(null);
    if (refreshNeeded) {
      fetchData();
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      active: { bg: 'bg-green-100', text: 'text-green-800', icon: CheckCircleIcon },
      completed: { bg: 'bg-blue-100', text: 'text-blue-800', icon: CheckCircleIcon },
      dropped: { bg: 'bg-red-100', text: 'text-red-800', icon: XCircleIcon },
      pending: { bg: 'bg-yellow-100', text: 'text-yellow-800', icon: AcademicCapIcon }
    };
    const config = statusConfig[status] || statusConfig.pending;
    return config;
  };

  const filteredEnrollments = enrollments.filter(enrollment => {
    if (filter === 'all') return true;
    return enrollment.status === filter;
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Enrollments</h1>
        <button
          onClick={handleAddEnrollment}
          className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
        >
          <PlusIcon className="h-5 w-5" />
          <span>New Enrollment</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center">
            <div className="bg-blue-500 rounded-lg p-3">
              <UserGroupIcon className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Total Enrollments</p>
              <p className="text-2xl font-semibold">{stats.total}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center">
            <div className="bg-green-500 rounded-lg p-3">
              <CheckCircleIcon className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Active</p>
              <p className="text-2xl font-semibold">{stats.active}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center">
            <div className="bg-blue-500 rounded-lg p-3">
              <AcademicCapIcon className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Completed</p>
              <p className="text-2xl font-semibold">{stats.completed}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center">
            <div className="bg-red-500 rounded-lg p-3">
              <XCircleIcon className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Dropped</p>
              <p className="text-2xl font-semibold">{stats.dropped}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="flex space-x-2">
          {['all', 'active', 'completed', 'dropped'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-md text-sm font-medium capitalize ${
                filter === status
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {/* Enrollments Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Student
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Course
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Progress
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Enrolled Date
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredEnrollments.length === 0 ? (
              <tr>
                <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                  No enrollments found
                </td>
              </tr>
            ) : (
              filteredEnrollments.map((enrollment) => {
                const statusConfig = getStatusBadge(enrollment.status);
                return (
                  <tr key={enrollment._id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {enrollment.student?.firstName} {enrollment.student?.lastName}
                      </div>
                      <div className="text-sm text-gray-500">{enrollment.student?.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {enrollment.course?.title}
                      </div>
                      <div className="text-sm text-gray-500">{enrollment.course?.instructor}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${statusConfig.bg} ${statusConfig.text}`}>
                        {enrollment.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div 
                          className="bg-primary-600 h-2.5 rounded-full" 
                          style={{ width: `${enrollment.progress || 0}%` }}
                        ></div>
                      </div>
                      <span className="text-xs text-gray-500 mt-1">{enrollment.progress || 0}%</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(enrollment.enrollmentDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleEditEnrollment(enrollment)}
                        className="text-primary-600 hover:text-primary-900 mr-3"
                      >
                        <PencilIcon className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(enrollment)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Modals */}
      <EnrollmentModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        enrollment={selectedEnrollment}
        courses={courses}
        students={students}
      />

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete Enrollment"
        message="Are you sure you want to delete this enrollment? This action cannot be undone."
      />
    </div>
  );
};

export default Enrollments;
