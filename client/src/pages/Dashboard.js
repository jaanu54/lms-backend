import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom'; // Added Link and useLocation
import authService from '../services/authService';
import dashboardService from '../services/dashboardService';

const Dashboard = () => {
  const navigate = useNavigate();
  const location = useLocation(); // Add this for active link highlighting
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (!authService.isAuthenticated()) {
      navigate('/login');
      return;
    }
    const userData = authService.getCurrentUser();
    setUser(userData);
    fetchDashboardData();
  }, [navigate]);

  const fetchDashboardData = async () => {
    try {
      const data = await dashboardService.getDashboardStats();
      setStats(data);
    } catch (err) {
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  // Navigation Styles
  const navStyle = {
    display: 'flex',
    gap: '20px',
    alignItems: 'center'
  };

  const navLinkStyle = {
    color: '#333',
    textDecoration: 'none',
    padding: '8px 16px',
    borderRadius: '5px',
    fontWeight: '500',
    transition: 'all 0.3s',
    cursor: 'pointer'
  };

  const activeNavStyle = {
    ...navLinkStyle,
    backgroundColor: '#667eea',
    color: 'white'
  };

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        Loading dashboard...
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* Navigation Bar - FIXED WITH LINK COMPONENTS */}
      <div style={styles.navbar}>
        <div style={styles.navLeft}>
          <h2 style={styles.logo}>LMS Platform</h2>
          <div style={navStyle}>
            <Link 
              to="/dashboard" 
              style={location.pathname === '/dashboard' ? activeNavStyle : navLinkStyle}
            >
              Dashboard
            </Link>
            <Link 
              to="/courses" 
              style={location.pathname === '/courses' ? activeNavStyle : navLinkStyle}
            >
              Courses
            </Link>
            <Link 
              to="/students" 
              style={location.pathname === '/students' ? activeNavStyle : navLinkStyle}
            >
              Students
            </Link>
            <Link 
              to="/enrollments" 
              style={location.pathname === '/enrollments' ? activeNavStyle : navLinkStyle}
            >
              Enrollments
            </Link>
            <Link 
              to="/reports" 
              style={location.pathname === '/reports' ? activeNavStyle : navLinkStyle}
            >
              Reports
            </Link>
            <Link 
              to="/profile" 
              style={location.pathname === '/profile' ? activeNavStyle : navLinkStyle}
            >
              Profile
            </Link>
          </div>
        </div>
        <div style={styles.navRight}>
          <span style={styles.userName}>Welcome, {user?.name || 'Admin'}!</span>
          <button onClick={handleLogout} style={styles.logoutBtn}>
            Logout
          </button>
        </div>
      </div>

      {/* Rest of your dashboard content */}
      <div style={styles.mainContent}>
        <h1 style={styles.pageTitle}>Dashboard Overview</h1>
        
        {error && <div style={styles.error}>{error}</div>}

        {/* Stats Cards */}
        <div style={styles.statsGrid}>
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
            value={`${stats?.completionRate ? Math.round(stats.completionRate) : 0}%`}
            change="+3%"
            color="#ff9800"
          />
        </div>

        {/* Charts Section */}
        <div style={styles.chartsGrid}>
          <ChartCard title="Enrollment Trends">
            <div style={styles.tabContainer}>
              <button style={styles.activeTab}>Week</button>
              <button style={styles.tab}>Month</button>
              <button style={styles.tab}>Year</button>
            </div>
            <EmptyState message="No enrollment data available" />
          </ChartCard>

          <ChartCard title="Course Popularity">
            <EmptyState message="No course enrollment data available" />
          </ChartCard>
        </div>
      </div>
    </div>
  );
};

// Keep all your existing StatCard, ChartCard, EmptyState components and styles here
// ... (copy from your existing file)

export default Dashboard;
