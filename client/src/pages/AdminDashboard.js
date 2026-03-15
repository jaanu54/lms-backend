import React, { useState, useEffect } from 'react';
import {
  UsersIcon,
  BookOpenIcon,
  AcademicCapIcon,
  ChartBarIcon,
  Cog6ToothIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';
import adminService from '../services/adminService';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      console.log('Fetching admin data...');
      
      // Fetch stats and users first (these are essential)
      const [statsData, usersData] = await Promise.all([
        adminService.getStats(),
        adminService.getUsers()
      ]);
      
      console.log('Stats:', statsData);
      console.log('Users:', usersData);
      
      setStats(statsData);
      setUsers(usersData);
      
      // Try to fetch logs separately (non-critical)
      try {
        const logsData = await adminService.getLogs();
        setLogs(logsData);
      } catch (logErr) {
        console.log('Logs not available:', logErr.message);
        setLogs([]); // Set empty logs as fallback
      }
      
      setError(null);
    } catch (err) {
      console.error('Full error:', err);
      console.error('Error response:', err.response);
      setError('Failed to load admin dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      await adminService.updateUserRole(userId, newRole);
      // Refresh users list
      const updatedUsers = await adminService.getUsers();
      setUsers(updatedUsers);
    } catch (err) {
      alert('Failed to update user role');
    }
  };

  const handleStatusToggle = async (userId, currentStatus) => {
    try {
      await adminService.toggleUserStatus(userId, !currentStatus);
      // Refresh users list
      const updatedUsers = await adminService.getUsers();
      setUsers(updatedUsers);
    } catch (err) {
      alert('Failed to update user status');
    }
  };

  const statCards = [
    { name: 'Total Users', value: stats?.overview?.totalUsers || 0, icon: UsersIcon, color: 'bg-blue-500', change: '+12%' },
    { name: 'Total Courses', value: stats?.overview?.totalCourses || 0, icon: BookOpenIcon, color: 'bg-green-500', change: '+8%' },
    { name: 'Total Students', value: stats?.overview?.totalStudents || 0, icon: AcademicCapIcon, color: 'bg-purple-500', change: '+15%' },
    { name: 'Enrollments', value: stats?.overview?.totalEnrollments || 0, icon: ChartBarIcon, color: 'bg-orange-500', change: '+23%' },
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">{error}</p>
        <button
          onClick={fetchAdminData}
          className="mt-4 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
          <p className="text-gray-600 mt-1">Manage your platform and users</p>
        </div>
        <button
          onClick={fetchAdminData}
          className="flex items-center space-x-2 px-4 py-2 bg-gray-100 rounded-md hover:bg-gray-200"
        >
          <ArrowPathIcon className="h-5 w-5" />
          <span>Refresh</span>
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat) => (
          <div key={stat.name} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{stat.name}</p>
                <p className="text-3xl font-semibold text-gray-900 mt-1">{stat.value}</p>
              </div>
              <div className={`${stat.color} rounded-lg p-3`}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
            </div>
            <div className="mt-4 text-sm text-green-600">
              ↑ {stat.change} from last month
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="flex space-x-8">
          {['overview', 'users'].map((tab) => (
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Popular Courses */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Popular Courses</h2>
            {stats?.popularCourses?.length > 0 ? (
              <div className="space-y-3">
                {stats.popularCourses.map((course, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-gray-700">{course.title}</span>
                    <span className="text-sm font-medium text-primary-600">
                      {course.enrollmentCount} students
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No course data available</p>
            )}
          </div>

          {/* Recent Enrollments */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Recent Enrollments</h2>
            {stats?.recentEnrollments?.length > 0 ? (
              <div className="space-y-3">
                {stats.recentEnrollments.map((enrollment, index) => (
                  <div key={index} className="flex items-center justify-between border-b pb-2">
                    <div>
                      <p className="font-medium text-gray-800">
                        {enrollment.student?.firstName} {enrollment.student?.lastName}
                      </p>
                      <p className="text-sm text-gray-500">{enrollment.course?.title}</p>
                    </div>
                    <span className="text-xs text-gray-400">
                      {new Date(enrollment.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No recent enrollments</p>
            )}
          </div>
        </div>
      )}

      {activeTab === 'users' && (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="px-6 py-4 border-b bg-gray-50">
            <h2 className="text-xl font-semibold text-gray-800">User Management</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Joined
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.map((user) => (
                  <tr key={user._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center">
                          <span className="text-sm font-medium text-primary-600">
                            {user.name?.charAt(0) || 'U'}
                          </span>
                        </div>
                        <div className="ml-3">
                          <p className="text-sm font-medium text-gray-900">{user.name}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select
                        value={user.role || 'user'}
                        onChange={(e) => handleRoleChange(user._id, e.target.value)}
                        className="border rounded px-2 py-1 text-sm"
                      >
                        <option value="user">User</option>
                        <option value="instructor">Instructor</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        user.isActive !== false
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {user.isActive !== false ? 'Active' : 'Suspended'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleStatusToggle(user._id, user.isActive !== false)}
                        className={`mr-3 ${
                          user.isActive !== false
                            ? 'text-red-600 hover:text-red-900'
                            : 'text-green-600 hover:text-green-900'
                        }`}
                      >
                        {user.isActive !== false ? 'Suspend' : 'Activate'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
