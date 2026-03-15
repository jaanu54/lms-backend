import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { PencilIcon, TrashIcon, PlusIcon } from '@heroicons/react/24/outline';
import courseService from '../services/courseService';
import CourseModal from '../components/courses/CourseModal';
import DeleteConfirmationModal from '../components/common/DeleteConfirmationModal';

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [modalMode, setModalMode] = useState('add');

  // Instructor mapping for IDs to names
  const instructorMap = {
    '69b4edbeddd13e32c520fb24': 'Dr. Sarah Johnson',
    '69b4f1ddddd13e32c520fb31': 'Prof. Michael Chen',
    '69b4f1ddddd13e32c520fb31': 'Emily Williams',
    'default': 'Instructor'
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const data = await courseService.getAllCourses();
      
      // Process courses to add instructor names
      const processedCourses = data.map(course => {
        let instructorName = 'Instructor';
        
        // If instructor is populated as an object with name
        if (course.instructor && typeof course.instructor === 'object' && course.instructor.name) {
          instructorName = course.instructor.name;
        } 
        // If instructor is an ID string, use the map
        else if (typeof course.instructor === 'string') {
          instructorName = instructorMap[course.instructor] || 
                          instructorMap[course.instructor?.trim()] || 
                          'Instructor';
        }
        
        return {
          ...course,
          instructorName,
          displayDuration: course.duration || 0,
          displayStatus: course.status || 'active'
        };
      });
      
      setCourses(processedCourses);
      setError(null);
    } catch (err) {
      setError('Failed to fetch courses');
      console.error('Error fetching courses:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddCourse = () => {
    setModalMode('add');
    setSelectedCourse(null);
    setIsModalOpen(true);
  };

  const handleEditCourse = (course) => {
    setModalMode('edit');
    setSelectedCourse(course);
    setIsModalOpen(true);
  };

  const handleViewCourse = (course) => {
    setModalMode('view');
    setSelectedCourse(course);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (course) => {
    setSelectedCourse(course);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await courseService.deleteCourse(selectedCourse._id);
      await fetchCourses();
      setIsDeleteModalOpen(false);
      setSelectedCourse(null);
    } catch (err) {
      console.error('Error deleting course:', err);
      setError('Failed to delete course');
    }
  };

  const handleModalClose = (refreshNeeded = false) => {
    setIsModalOpen(false);
    setSelectedCourse(null);
    if (refreshNeeded) {
      fetchCourses();
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
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Courses</h1>
        <button
          onClick={handleAddCourse}
          className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
        >
          <PlusIcon className="h-5 w-5" />
          <span>Add New Course</span>
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {/* Courses Grid */}
      {courses.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <p className="text-gray-500 text-lg">No courses found. Click "Add New Course" to create one.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <div
              key={course._id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              {/* Course Image Placeholder */}
              <div className="h-40 bg-gradient-to-r from-primary-500 to-primary-700 flex items-center justify-center">
                <span className="text-4xl font-bold text-white opacity-50">
                  {course.title?.charAt(0) || 'C'}
                </span>
              </div>

              {/* Course Content */}
              <div className="p-5">
                <div className="mb-2">
                  <Link to={`/courses/${course._id}`} className="text-xl font-semibold text-gray-800 hover:text-primary-600">
                    {course.title}
                  </Link>
                </div>
                
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {course.description}
                </p>

                <div className="space-y-2 text-sm text-gray-500 mb-4">
                  <p>
                    <span className="font-medium">Instructor:</span> {course.instructorName || 'Instructor'}
                  </p>
                  <p>
                    <span className="font-medium">Duration:</span> {course.displayDuration} weeks
                  </p>
                  <p>
                    <span className="font-medium">Status:</span>{' '}
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      course.displayStatus === 'active' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {course.displayStatus}
                    </span>
                  </p>
                </div>

                {/* Free Demo Badge */}
                <div className="mb-3">
                  <span className="bg-green-100 text-green-800 text-xs font-semibold px-2 py-1 rounded">
                    FREE DEMO
                  </span>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end space-x-2 pt-4 border-t">
                  <button
                    onClick={() => handleViewCourse(course)}
                    className="p-2 text-gray-600 hover:text-primary-600 hover:bg-gray-100 rounded-full transition-colors"
                    title="View Details"
                  >
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => handleEditCourse(course)}
                    className="p-2 text-gray-600 hover:text-blue-600 hover:bg-gray-100 rounded-full transition-colors"
                    title="Edit Course"
                  >
                    <PencilIcon className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleDeleteClick(course)}
                    className="p-2 text-gray-600 hover:text-red-600 hover:bg-gray-100 rounded-full transition-colors"
                    title="Delete Course"
                  >
                    <TrashIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Course Modal */}
      <CourseModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        course={selectedCourse}
        mode={modalMode}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete Course"
        message={`Are you sure you want to delete "${selectedCourse?.title}"? This action cannot be undone.`}
      />
    </div>
  );
};

export default Courses;