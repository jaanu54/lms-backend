import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../services/authService';
import dashboardService from '../services/dashboardService';

const Dashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check authentication
    if (!authService.isAuthenticated()) {
      navigate('/login');
      return;
    }

    // Get user data
    const userData = authService.getCurrentUser();
    setUser(userData);

    // Fetch dashboard data
    fetchDashboardData();
  }, [navigate]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const data = await dashboardService.getDashboardStats();
      setStats(data);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        fontSize: '18px',
        color: '#667eea'
      }}>
        Loading dashboard...
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f5f5f5'
    }}>
      {/* Header */}
      <header style={{
        backgroundColor: 'white',
        padding: '20px 30px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <h1 style={{
          fontSize: '24px',
          color: '#333',
          margin: 0
        }}>
          LMS Dashboard
        </h1>
        
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '20px'
        }}>
          <span style={{
            color: '#666'
          }}>
            Welcome, {user?.name || 'Admin'}!
          </span>
          <button
            onClick={handleLogout}
            style={{
              padding: '8px 16px',
              backgroundColor: '#f44336',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            Logout
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main style={{
        padding: '30px'
      }}>
        {error && (
          <div style={{
            backgroundColor: '#fee',
            color: '#c33',
            padding: '15px',
            borderRadius: '5px',
            marginBottom: '20px'
          }}>
            {error}
          </div>
        )}

        {/* Stats Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '20px',
          marginBottom: '30px'
        }}>
          <StatCard
            title="Total Courses"
            value={stats?.totalCourses || 0}
            change="+12%"
            color="#667eea"
          />
          <StatCard
            title="Total Students"
            value={stats?.totalStudents || 0}
            change="+5%"
            color="#764ba2"
          />
          <StatCard
            title="Active Enrollments"
            value={stats?.activeEnrollments || 0}
            change="+8%"
            color="#4caf50"
          />
          <StatCard
            title="Completion Rate"
            value={`${stats?.completionRate || 0}%`}
            change="+3%"
            color="#ff9800"
          />
        </div>

        {/* Charts Section */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
          gap: '20px'
        }}>
          {/* Enrollment Trends */}
          <ChartCard title="Enrollment Trends">
            <div style={{
              display: 'flex',
              gap: '10px',
              marginBottom: '20px'
            }}>
              <button style={tabButtonStyle}>Week</button>
              <button style={{...tabButtonStyle, backgroundColor: '#667eea', color: 'white'}}>Month</button>
              <button style={tabButtonStyle}>Year</button>
            </div>
            {stats?.enrollmentTrends ? (
              <div>Chart data here</div>
            ) : (
              <EmptyState message="No enrollment data available" />
            )}
          </ChartCard>

          {/* Course Popularity */}
          <ChartCard title="Course Popularity">
            {stats?.popularCourses ? (
              <div>Chart data here</div>
            ) : (
              <EmptyState message="No course enrollment data available" />
            )}
          </ChartCard>
        </div>
      </main>
    </div>
  );
};

// Stat Card Component
const StatCard = ({ title, value, change, color }) => (
  <div style={{
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '10px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
  }}>
    <h3 style={{
      fontSize: '14px',
      color: '#666',
      margin: '0 0 10px 0'
    }}>
      {title}
    </h3>
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    }}>
      <span style={{
        fontSize: '28px',
        fontWeight: 'bold',
        color: color
      }}>
        {value}
      </span>
      <span style={{
        fontSize: '12px',
        color: '#4caf50',
        backgroundColor: '#e8f5e8',
        padding: '4px 8px',
        borderRadius: '12px'
      }}>
        {change}
      </span>
    </div>
  </div>
);

// Chart Card Component
const ChartCard = ({ title, children }) => (
  <div style={{
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '10px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
  }}>
    <h3 style={{
      fontSize: '16px',
      color: '#333',
      margin: '0 0 20px 0'
    }}>
      {title}
    </h3>
    {children}
  </div>
);

// Empty State Component
const EmptyState = ({ message }) => (
  <div style={{
    textAlign: 'center',
    padding: '40px',
    color: '#999',
    backgroundColor: '#f9f9f9',
    borderRadius: '5px'
  }}>
    {message}
  </div>
);

// Tab Button Style
const tabButtonStyle = {
  padding: '8px 16px',
  border: '1px solid #ddd',
  backgroundColor: 'white',
  borderRadius: '5px',
  cursor: 'pointer',
  fontSize: '14px'
};

export default Dashboard;
