
import React, { useState, useEffect } from 'react';
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
import {
  BookOpenIcon,
  UserGroupIcon,
  AcademicCapIcon,
  ChartBarIcon,
  ArrowTrendingUpIcon,
  ClockIcon
} from '@heroicons/react/24/outline';
import dashboardService from '../services/dashboardService';

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

const Dashboard = () => {
  const [stats, setStats] = useState({
    courses: 0,
    students: 0,
    enrollments: { total: 0, active: 0, completed: 0, dropped: 0 }
  });
  const [trends, setTrends] = useState({});
  const [coursePopularity, setCoursePopularity] = useState({});
  const [studentStatus, setStudentStatus] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeRange, setTimeRange] = useState('month'); // week, month, year

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [statsData, trendsData, popularityData, studentStatusData] = await Promise.all([
        dashboardService.getDashboardStats(),
        dashboardService.getEnrollmentTrends(),
        dashboardService.getCoursePopularity(),
        dashboardService.getStudentStatusDistribution()
      ]);

      setStats(statsData);
      setTrends(trendsData);
      setCoursePopularity(popularityData);
      setStudentStatus(studentStatusData);
      setError(null);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  // Chart configurations
  const enrollmentTrendsChart = {
    labels: Object.keys(trends),
    datasets: [
      {
        label: 'Enrollments',
        data: Object.values(trends),
        backgroundColor: 'rgba(79, 70, 229, 0.5)',
        borderColor: 'rgb(79, 70, 229)',
        borderWidth: 2,
        tension: 0.4
      }
    ]
  };

  const coursePopularityChart = {
    labels: Object.keys(coursePopularity),
    datasets: [
      {
        label: 'Students Enrolled',
        data: Object.values(coursePopularity),
        backgroundColor: [
          'rgba(79, 70, 229, 0.8)',
          'rgba(16, 185, 129, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(239, 68, 68, 0.8)',
          'rgba(139, 92, 246, 0.8)',
        ],
        borderWidth: 1
      }
    ]
  };

  const studentStatusChart = {
    labels: Object.keys(studentStatus).map(s => s.charAt(0).toUpperCase() + s.slice(1)),
    datasets: [
      {
        data: Object.values(studentStatus),
        backgroundColor: [
          'rgba(16, 185, 129, 0.8)',  // active - green
          'rgba(156, 163, 175, 0.8)', // inactive - gray
          'rgba(79, 70, 229, 0.8)',   // graduated - primary
          'rgba(239, 68, 68, 0.8)',   // suspended - red
        ],
        borderWidth: 1
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
      }
    }
  };

  const lineChartOptions = {
    ...chartOptions,
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1
        }
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

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
        {error}
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-gray-600 mt-1">Welcome back! Here's what's happening with your LMS.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center">
            <div className="bg-blue-500 rounded-lg p-3">
              <BookOpenIcon className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Courses</p>
              <p className="text-3xl font-semibold text-gray-900">{stats.courses}</p>
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm text-gray-600">
            <ArrowTrendingUpIcon className="h-4 w-4 text-green-500 mr-1" />
            <span>+12% from last month</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center">
            <div className="bg-green-500 rounded-lg p-3">
              <UserGroupIcon className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Students</p>
              <p className="text-3xl font-semibold text-gray-900">{stats.students}</p>
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm text-gray-600">
            <ArrowTrendingUpIcon className="h-4 w-4 text-green-500 mr-1" />
            <span>+5% from last month</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center">
            <div className="bg-purple-500 rounded-lg p-3">
              <AcademicCapIcon className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active Enrollments</p>
              <p className="text-3xl font-semibold text-gray-900">{stats.enrollments.active}</p>
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm text-gray-600">
            <ClockIcon className="h-4 w-4 text-gray-500 mr-1" />
            <span>{stats.enrollments.completed} completed</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center">
            <div className="bg-orange-500 rounded-lg p-3">
              <ChartBarIcon className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Completion Rate</p>
              <p className="text-3xl font-semibold text-gray-900">
                {stats.enrollments.total > 0 
                  ? Math.round((stats.enrollments.completed / stats.enrollments.total) * 100) 
                  : 0}%
              </p>
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm text-gray-600">
            <span className="text-gray-500">Total enrollments: {stats.enrollments.total}</span>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Enrollment Trends Line Chart */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800">Enrollment Trends</h2>
            <div className="flex space-x-2">
              {['week', 'month', 'year'].map((range) => (
                <button
                  key={range}
                  onClick={() => setTimeRange(range)}
                  className={`px-3 py-1 text-sm rounded-md ${
                    timeRange === range
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {range.charAt(0).toUpperCase() + range.slice(1)}
                </button>
              ))}
            </div>
          </div>
          <div className="h-64">
            {Object.keys(trends).length > 0 ? (
              <Line data={enrollmentTrendsChart} options={lineChartOptions} />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">
                No enrollment data available
              </div>
            )}
          </div>
        </div>

        {/* Course Popularity Bar Chart */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Course Popularity</h2>
          <div className="h-64">
            {Object.keys(coursePopularity).length > 0 ? (
              <Bar data={coursePopularityChart} options={chartOptions} />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">
                No course enrollment data available
              </div>
            )}
          </div>
        </div>

        {/* Student Status Pie Chart */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Student Status Distribution</h2>
          <div className="h-64">
            {Object.values(studentStatus).some(v => v > 0) ? (
              <Pie data={studentStatusChart} options={chartOptions} />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">
                No student data available
              </div>
            )}
          </div>
        </div>

        {/* Recent Activity Feed */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Recent Activity</h2>
          <div className="space-y-4">
            <div className="flex items-center text-sm border-l-4 border-green-500 pl-3">
              <div className="flex-1">
                <p className="font-medium text-gray-900">New course added</p>
                <p className="text-gray-500">2 hours ago</p>
              </div>
            </div>
            <div className="flex items-center text-sm border-l-4 border-blue-500 pl-3">
              <div className="flex-1">
                <p className="font-medium text-gray-900">5 new students enrolled</p>
                <p className="text-gray-500">Yesterday</p>
              </div>
            </div>
            <div className="flex items-center text-sm border-l-4 border-purple-500 pl-3">
              <div className="flex-1">
                <p className="font-medium text-gray-900">3 courses completed</p>
                <p className="text-gray-500">2 days ago</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Enrollment Status</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Active</span>
              <span className="font-medium text-green-600">{stats.enrollments.active}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Completed</span>
              <span className="font-medium text-blue-600">{stats.enrollments.completed}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Dropped</span>
              <span className="font-medium text-red-600">{stats.enrollments.dropped}</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Quick Actions</h3>
          <div className="space-y-2">
            <button className="w-full text-left px-3 py-2 bg-gray-50 rounded-md hover:bg-gray-100">
              ➕ Add New Course
            </button>
            <button className="w-full text-left px-3 py-2 bg-gray-50 rounded-md hover:bg-gray-100">
              👤 Register New Student
            </button>
            <button className="w-full text-left px-3 py-2 bg-gray-50 rounded-md hover:bg-gray-100">
              📝 Create Enrollment
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">System Health</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">API Status</span>
              <span className="text-green-600">● Online</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Database</span>
              <span className="text-green-600">● Connected</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Last Backup</span>
              <span className="text-gray-600">Today, 2:30 AM</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
