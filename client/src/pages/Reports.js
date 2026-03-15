import React, { useState, useEffect } from 'react';
import {
  ChartBarIcon,
  DocumentArrowDownIcon,
  CalendarIcon,
  UserGroupIcon,
  AcademicCapIcon,
  CurrencyDollarIcon,
  ArrowTrendingUpIcon
} from '@heroicons/react/24/outline';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
} from 'chart.js';
import { Bar, Pie, Line } from 'react-chartjs-2';
import reportsService from '../services/reportsService';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
);

const Reports = () => {
  const [activeTab, setActiveTab] = useState('enrollments');
  const [dateRange, setDateRange] = useState('30days');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [enrollmentData, setEnrollmentData] = useState(null);
  const [completionData, setCompletionData] = useState(null);
  const [studentProgress, setStudentProgress] = useState(null);
  const [revenueData, setRevenueData] = useState(null);
  const [analytics, setAnalytics] = useState(null);

  useEffect(() => {
    fetchReportData();
  }, [activeTab, dateRange]);

  const fetchReportData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Get date range filter
      const filters = getDateRangeFilter(dateRange);
      
      // Fetch data based on active tab
      switch(activeTab) {
        case 'enrollments':
          const enrollments = await reportsService.getEnrollmentReports(filters);
          setEnrollmentData(enrollments);
          break;
        case 'completion':
          const completion = await reportsService.getCompletionRates();
          setCompletionData(completion);
          break;
        case 'progress':
          const progress = await reportsService.getStudentProgress(filters);
          setStudentProgress(progress);
          break;
        case 'revenue':
          const revenue = await reportsService.getRevenueReports(dateRange);
          setRevenueData(revenue);
          break;
        default:
          break;
      }
      
      // Always fetch dashboard analytics
      const analyticsData = await reportsService.getDashboardAnalytics();
      setAnalytics(analyticsData);
      
    } catch (err) {
      console.error('Error fetching reports:', err);
      setError('Failed to load report data');
    } finally {
      setLoading(false);
    }
  };

  const getDateRangeFilter = (range) => {
    const now = new Date();
    const filters = {};
    
    switch(range) {
      case '7days':
        filters.startDate = new Date(now.setDate(now.getDate() - 7)).toISOString();
        break;
      case '30days':
        filters.startDate = new Date(now.setDate(now.getDate() - 30)).toISOString();
        break;
      case '90days':
        filters.startDate = new Date(now.setDate(now.getDate() - 90)).toISOString();
        break;
      case 'year':
        filters.startDate = new Date(now.setFullYear(now.getFullYear() - 1)).toISOString();
        break;
      default:
        break;
    }
    
    return filters;
  };

  const handleExport = async (format = 'csv') => {
    try {
      const filters = getDateRangeFilter(dateRange);
      await reportsService.exportToCSV(activeTab, filters);
    } catch (err) {
      setError('Failed to export data');
    }
  };

  // Chart configurations
  const enrollmentChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Enrollment Trends'
      }
    }
  };

  const completionChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Course Completion Rates'
      }
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
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Reports & Analytics</h1>
          <p className="mt-2 text-gray-600">
            View insights and analytics about your LMS platform
          </p>
        </div>

        {/* Analytics Cards */}
        {analytics && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="bg-blue-500 rounded-lg p-3">
                  <UserGroupIcon className="h-6 w-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-600">Total Students</p>
                  <p className="text-2xl font-semibold">{analytics.totalStudents || 0}</p>
                </div>
              </div>
              <div className="mt-4 text-sm text-green-600">
                ↑ {analytics.studentGrowth || 0}% from last month
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="bg-green-500 rounded-lg p-3">
                  <AcademicCapIcon className="h-6 w-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-600">Active Enrollments</p>
                  <p className="text-2xl font-semibold">{analytics.activeEnrollments || 0}</p>
                </div>
              </div>
              <div className="mt-4 text-sm text-green-600">
                ↑ {analytics.enrollmentGrowth || 0}% from last month
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="bg-purple-500 rounded-lg p-3">
                  <ChartBarIcon className="h-6 w-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-600">Completion Rate</p>
                  <p className="text-2xl font-semibold">{analytics.completionRate || 0}%</p>
                </div>
              </div>
              <div className="mt-4 text-sm text-gray-600">
                Avg. course completion
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="bg-yellow-500 rounded-lg p-3">
                  <ArrowTrendingUpIcon className="h-6 w-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-600">Revenue</p>
                  <p className="text-2xl font-semibold">${analytics.revenue || 0}</p>
                </div>
              </div>
              <div className="mt-4 text-sm text-green-600">
                ↑ {analytics.revenueGrowth || 0}% from last month
              </div>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        {/* Controls */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            {/* Tabs */}
            <div className="flex space-x-2">
              {['enrollments', 'completion', 'progress', 'revenue'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 rounded-md text-sm font-medium capitalize ${
                    activeTab === tab
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Date Range Filter */}
            <div className="flex items-center space-x-2">
              <CalendarIcon className="h-5 w-5 text-gray-400" />
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="px-3 py-2 border rounded-md focus:ring-2 focus:ring-primary-500"
              >
                <option value="7days">Last 7 Days</option>
                <option value="30days">Last 30 Days</option>
                <option value="90days">Last 90 Days</option>
                <option value="year">Last Year</option>
                <option value="all">All Time</option>
              </select>

              {/* Export Button */}
              <button
                onClick={() => handleExport('csv')}
                className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
              >
                <DocumentArrowDownIcon className="h-5 w-5" />
                <span>Export</span>
              </button>
            </div>
          </div>
        </div>

        {/* Report Content */}
        <div className="bg-white rounded-lg shadow p-6">
          {activeTab === 'enrollments' && (
            <div>
              <h2 className="text-xl font-semibold mb-6">Enrollment Reports</h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Enrollment Trends Chart */}
                <div>
                  <h3 className="text-lg font-medium mb-4">Enrollment Trends</h3>
                  <div className="h-80">
                    {enrollmentData?.trends ? (
                      <Line data={enrollmentData.trends} options={enrollmentChartOptions} />
                    ) : (
                      <div className="flex items-center justify-center h-full text-gray-500">
                        No enrollment data available
                      </div>
                    )}
                  </div>
                </div>

                {/* Enrollment by Course */}
                <div>
                  <h3 className="text-lg font-medium mb-4">Enrollment by Course</h3>
                  <div className="h-80">
                    {enrollmentData?.byCourse ? (
                      <Bar data={enrollmentData.byCourse} options={enrollmentChartOptions} />
                    ) : (
                      <div className="flex items-center justify-center h-full text-gray-500">
                        No course data available
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Enrollment Table */}
              <div className="mt-8">
                <h3 className="text-lg font-medium mb-4">Recent Enrollments</h3>
                <div className="overflow-x-auto">
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
                          Date
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {enrollmentData?.recent?.map((enrollment, index) => (
                        <tr key={index}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {enrollment.studentName}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {enrollment.courseTitle}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {new Date(enrollment.date).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              enrollment.status === 'active' 
                                ? 'bg-green-100 text-green-800'
                                : enrollment.status === 'completed'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              {enrollment.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'completion' && (
            <div>
              <h2 className="text-xl font-semibold mb-6">Course Completion Rates</h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Completion by Course */}
                <div>
                  <h3 className="text-lg font-medium mb-4">Completion by Course</h3>
                  <div className="h-80">
                    {completionData?.byCourse ? (
                      <Bar data={completionData.byCourse} options={completionChartOptions} />
                    ) : (
                      <div className="flex items-center justify-center h-full text-gray-500">
                        No completion data available
                      </div>
                    )}
                  </div>
                </div>

                {/* Average Completion Time */}
                <div>
                  <h3 className="text-lg font-medium mb-4">Average Completion Time</h3>
                  <div className="h-80">
                    {completionData?.avgTime ? (
                      <Pie data={completionData.avgTime} />
                    ) : (
                      <div className="flex items-center justify-center h-full text-gray-500">
                        No time data available
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'progress' && (
            <div>
              <h2 className="text-xl font-semibold mb-6">Student Progress</h2>
              <div className="space-y-6">
                {studentProgress?.map((student, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-medium">{student.name}</h3>
                      <span className="text-sm text-gray-500">
                        Progress: {student.progress}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div 
                        className="bg-primary-600 h-2.5 rounded-full"
                        style={{ width: `${student.progress}%` }}
                      ></div>
                    </div>
                    <div className="mt-2 text-sm text-gray-500">
                      Course: {student.course} | Last active: {new Date(student.lastActive).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'revenue' && (
            <div>
              <h2 className="text-xl font-semibold mb-6">Revenue Reports</h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Revenue Trends */}
                <div>
                  <h3 className="text-lg font-medium mb-4">Revenue Trends</h3>
                  <div className="h-80">
                    {revenueData?.trends ? (
                      <Line data={revenueData.trends} />
                    ) : (
                      <div className="flex items-center justify-center h-full text-gray-500">
                        No revenue data available
                      </div>
                    )}
                  </div>
                </div>

                {/* Revenue by Course */}
                <div>
                  <h3 className="text-lg font-medium mb-4">Revenue by Course</h3>
                  <div className="h-80">
                    {revenueData?.byCourse ? (
                      <Pie data={revenueData.byCourse} />
                    ) : (
                      <div className="flex items-center justify-center h-full text-gray-500">
                        No course revenue data
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Reports;