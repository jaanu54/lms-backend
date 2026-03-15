import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  BookOpenIcon,
  ClockIcon,
  UserGroupIcon,
  ChartBarIcon,
  PlayIcon,
  DocumentTextIcon,
  VideoCameraIcon,
  LinkIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  StarIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';
import courseService from '../services/courseService';

const CourseDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedModules, setExpandedModules] = useState({});
  const [activeTab, setActiveTab] = useState('overview');
  const [userRating, setUserRating] = useState(0);
  const [reviewComment, setReviewComment] = useState('');
  const [enrolling, setEnrolling] = useState(false);

  useEffect(() => {
    fetchCourseDetails();
  }, [id]);

  const fetchCourseDetails = async () => {
    try {
      setLoading(true);
      const data = await courseService.getCourseById(id);
      setCourse(data);
      
      // Initialize all modules as expanded
      const expanded = {};
      if (data.modules) {
        data.modules.forEach((_, index) => {
          expanded[index] = true;
        });
      }
      setExpandedModules(expanded);
      
      setError(null);
    } catch (err) {
      console.error('Error fetching course:', err);
      setError('Failed to load course details');
    } finally {
      setLoading(false);
    }
  };

  const toggleModule = (index) => {
    setExpandedModules(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const handleEnroll = async () => {
    setEnrolling(true);
    try {
      // Enroll student logic here
      alert('Enrollment successful!');
      navigate('/my-courses');
    } catch (err) {
      alert('Failed to enroll');
    } finally {
      setEnrolling(false);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    try {
      await courseService.addReview(id, {
        rating: userRating,
        comment: reviewComment
      });
      alert('Review submitted!');
      setUserRating(0);
      setReviewComment('');
      fetchCourseDetails(); // Refresh course data
    } catch (err) {
      alert('Failed to submit review');
    }
  };

  const getLevelColor = (level) => {
    switch(level) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDuration = (minutes) => {
    if (!minutes) return '0h 0m';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">{error || 'Course not found'}</p>
        <button
          onClick={() => navigate('/courses')}
          className="mt-4 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
        >
          Back to Courses
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Course Header */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-800 text-white">
        <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getLevelColor(course.level)}`}>
                  {course.level || 'beginner'}
                </span>
                <span className="px-2 py-1 bg-white/20 rounded-full text-xs">
                  {course.category || 'General'}
                </span>
                {course.isFeatured && (
                  <span className="px-2 py-1 bg-yellow-500 text-white rounded-full text-xs">
                    Featured
                  </span>
                )}
              </div>
              
              <h1 className="text-4xl font-bold mb-4">{course.title}</h1>
              <p className="text-xl text-white/90 mb-6">{course.description}</p>
              
              <div className="flex flex-wrap items-center gap-6 text-sm">
                <div className="flex items-center">
                  <UserGroupIcon className="h-5 w-5 mr-2" />
                  <span>{course.instructor}</span>
                </div>
                <div className="flex items-center">
                  <ClockIcon className="h-5 w-5 mr-2" />
                  <span>{formatDuration(course.totalDuration)}</span>
                </div>
                <div className="flex items-center">
                  <BookOpenIcon className="h-5 w-5 mr-2" />
                  <span>{course.totalLessons || 0} lessons</span>
                </div>
                <div className="flex items-center">
                  <ChartBarIcon className="h-5 w-5 mr-2" />
                  <span>{course.modules?.length || 0} modules</span>
                </div>
              </div>
            </div>
            
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg p-6 text-gray-900">
                <div className="text-2xl font-bold text-green-600 mb-4 text-center">
                  FREE COURSE
                </div>
                
                <button
                  onClick={handleEnroll}
                  disabled={enrolling}
                  className="w-full mb-4 px-4 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 font-semibold disabled:opacity-50"
                >
                  {enrolling ? 'Enrolling...' : 'Enroll Now (Free)'}
                </button>
                
                <div className="text-xs text-gray-500 text-center border-t pt-4">
                  ⚡ Demo Project - No payment required
                </div>
                
                <div className="text-sm text-gray-600 mt-4">
                  <p>✓ Full lifetime access</p>
                  <p>✓ Certificate of completion</p>
                  <p>✓ 30-day money-back guarantee</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Course Content */}
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        {/* Tabs */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="flex space-x-8">
            {['overview', 'curriculum', 'reviews'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-4 px-1 border-b-2 font-medium text-sm capitalize ${
                  activeTab === tab
                    ? 'border-primary-600 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              {/* What you'll learn */}
              {course.whatYouWillLearn && course.whatYouWillLearn.length > 0 && (
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                  <h2 className="text-xl font-semibold mb-4">What you'll learn</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {course.whatYouWillLearn.map((item, index) => (
                      <div key={index} className="flex items-start">
                        <span className="text-green-500 mr-2">✓</span>
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Requirements */}
              {course.requirements && course.requirements.length > 0 && (
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                  <h2 className="text-xl font-semibold mb-4">Requirements</h2>
                  <ul className="list-disc list-inside space-y-2">
                    {course.requirements.map((req, index) => (
                      <li key={index}>{req}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Description */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold mb-4">Description</h2>
                <p className="text-gray-700 whitespace-pre-line">
                  {course.description}
                </p>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              {/* Course Stats */}
              <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <h3 className="font-semibold mb-4">Course Stats</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Lessons</span>
                    <span className="font-medium">{course.totalLessons || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Duration</span>
                    <span className="font-medium">{formatDuration(course.totalDuration)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Language</span>
                    <span className="font-medium">{course.language || 'English'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Last Updated</span>
                    <span className="font-medium">
                      {course.updatedAt ? new Date(course.updatedAt).toLocaleDateString() : 'N/A'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Tags */}
              {course.tags && course.tags.length > 0 && (
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="font-semibold mb-4">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {course.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'curriculum' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold mb-6">Course Curriculum</h2>
                
                {course.modules && course.modules.map((module, moduleIndex) => (
                  <div key={module._id} className="mb-4 border rounded-lg overflow-hidden">
                    <button
                      onClick={() => toggleModule(moduleIndex)}
                      className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100"
                    >
                      <div className="flex items-center">
                        <span className="font-medium">{module.title}</span>
                        <span className="ml-4 text-sm text-gray-500">
                          {module.lessons?.length || 0} lessons
                        </span>
                      </div>
                      {expandedModules[moduleIndex] ? (
                        <ChevronUpIcon className="h-5 w-5" />
                      ) : (
                        <ChevronDownIcon className="h-5 w-5" />
                      )}
                    </button>
                    
                    {expandedModules[moduleIndex] && (
                      <div className="p-4 space-y-2">
                        {module.lessons && module.lessons.map((lesson) => (
                          <div
                            key={lesson._id}
                            className="flex items-center justify-between p-2 hover:bg-gray-50 rounded"
                          >
                            <div className="flex items-center">
                              {lesson.videoUrl ? (
                                <VideoCameraIcon className="h-4 w-4 text-gray-400 mr-3" />
                              ) : (
                                <DocumentTextIcon className="h-4 w-4 text-gray-400 mr-3" />
                              )}
                              <span>{lesson.title}</span>
                              {lesson.isFree && (
                                <span className="ml-2 px-2 py-0.5 bg-green-100 text-green-800 text-xs rounded">
                                  Free
                                </span>
                              )}
                            </div>
                            <span className="text-sm text-gray-500">
                              {lesson.duration ? `${lesson.duration} min` : ''}
                            </span>
                          </div>
                        ))}
                        
                        {(!module.lessons || module.lessons.length === 0) && (
                          <p className="text-gray-500 text-center py-2">
                            No lessons yet
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                ))}
                
                {(!course.modules || course.modules.length === 0) && (
                  <p className="text-gray-500 text-center py-8">
                    No modules available yet
                  </p>
                )}
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
                <h3 className="font-semibold mb-4">Course Includes</h3>
                <ul className="space-y-3 text-sm">
                  <li className="flex items-center">
                    <PlayIcon className="h-4 w-4 text-gray-400 mr-2" />
                    {course.totalLessons || 0} on-demand videos
                  </li>
                  <li className="flex items-center">
                    <DocumentTextIcon className="h-4 w-4 text-gray-400 mr-2" />
                    Downloadable resources
                  </li>
                  <li className="flex items-center">
                    <ClockIcon className="h-4 w-4 text-gray-400 mr-2" />
                    Full lifetime access
                  </li>
                  <li className="flex items-center">
                    <ChartBarIcon className="h-4 w-4 text-gray-400 mr-2" />
                    Access on mobile and TV
                  </li>
                  <li className="flex items-center">
                    <BookOpenIcon className="h-4 w-4 text-gray-400 mr-2" />
                    Certificate of completion
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'reviews' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              {/* Rating Summary */}
              <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <div className="flex items-center space-x-8">
                  <div className="text-center">
                    <div className="text-5xl font-bold text-primary-600">
                      {course.rating?.average ? course.rating.average.toFixed(1) : '0.0'}
                    </div>
                    <div className="flex items-center mt-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <StarIconSolid
                          key={star}
                          className={`h-5 w-5 ${
                            star <= Math.round(course.rating?.average || 0)
                              ? 'text-yellow-400'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <div className="text-sm text-gray-500 mt-1">
                      {course.rating?.count || 0} ratings
                    </div>
                  </div>
                  
                  <div className="flex-1">
                    {[5, 4, 3, 2, 1].map((star) => {
                      const count = course.reviews ? course.reviews.filter(r => r.rating === star).length : 0;
                      const percentage = course.rating?.count ? (count / course.rating.count) * 100 : 0;
                      return (
                        <div key={star} className="flex items-center space-x-2 mb-2">
                          <span className="text-sm w-8">{star} star</span>
                          <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-yellow-400 rounded-full"
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Write Review */}
              <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <h3 className="font-semibold mb-4">Write a Review</h3>
                <form onSubmit={handleReviewSubmit}>
                  <div className="flex items-center space-x-1 mb-4">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setUserRating(star)}
                        className="focus:outline-none"
                      >
                        {star <= userRating ? (
                          <StarIconSolid className="h-6 w-6 text-yellow-400" />
                        ) : (
                          <StarIcon className="h-6 w-6 text-gray-400" />
                        )}
                      </button>
                    ))}
                  </div>
                  <textarea
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    placeholder="Write your review..."
                    className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-primary-500 mb-4"
                    rows="3"
                    required
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
                  >
                    Submit Review
                  </button>
                </form>
              </div>

              {/* Reviews List */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="font-semibold mb-4">Student Reviews</h3>
                {course.reviews && course.reviews.length > 0 ? (
                  course.reviews.map((review, index) => (
                    <div key={index} className="border-b last:border-0 py-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center">
                            <span className="text-sm font-medium text-primary-600">
                              {review.student ? review.student.charAt(0) : 'U'}
                            </span>
                          </div>
                          <span className="font-medium">
                            {review.student?.name || 'Anonymous'}
                          </span>
                        </div>
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <StarIconSolid
                              key={star}
                              className={`h-4 w-4 ${
                                star <= review.rating ? 'text-yellow-400' : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-gray-700">{review.comment}</p>
                      <p className="text-sm text-gray-500 mt-2">
                        {review.date ? new Date(review.date).toLocaleDateString() : 'N/A'}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-center py-4">
                    No reviews yet. Be the first to review!
                  </p>
                )}
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
                <h3 className="font-semibold mb-4">Why students love us</h3>
                <ul className="space-y-3 text-sm">
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span>High-quality video lectures</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span>Expert instructors</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span>24/7 support</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span>Lifetime updates</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span>Community access</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseDetail;