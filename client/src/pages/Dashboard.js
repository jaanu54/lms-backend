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
      {/* Navigation Bar */}
      <div style={styles.navbar}>
        <div style={styles.navLeft}>
          <h2 style={styles.logo}>LMS Platform</h2>
          <div style={navStyle}>
            <a 
              href="/dashboard" 
              style={window.location.pathname === '/dashboard' ? activeNavStyle : navLinkStyle}
            >
              Dashboard
            </a>
            <a 
              href="/courses" 
              style={window.location.pathname === '/courses' ? activeNavStyle : navLinkStyle}
            >
              Courses
            </a>
            <a 
              href="/students" 
              style={window.location.pathname === '/students' ? activeNavStyle : navLinkStyle}
            >
              Students
            </a>
            <a 
              href="/enrollments" 
              style={window.location.pathname === '/enrollments' ? activeNavStyle : navLinkStyle}
            >
              Enrollments
            </a>
            <a 
              href="/reports" 
              style={window.location.pathname === '/reports' ? activeNavStyle : navLinkStyle}
            >
              Reports
            </a>
            <a 
              href="/profile" 
              style={window.location.pathname === '/profile' ? activeNavStyle : navLinkStyle}
            >
              Profile
            </a>
          </div>
        </div>
        <div style={styles.navRight}>
          <span style={styles.userName}>Welcome, {user?.name || 'Admin'}!</span>
          <button onClick={handleLogout} style={styles.logoutBtn}>
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
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

// Stat Card Component
const StatCard = ({ title, value, change, color }) => (
  <div style={styles.statCard}>
    <h3 style={styles.statTitle}>{title}</h3>
    <div style={styles.statValue}>
      <span style={{ ...styles.statNumber, color }}>{value}</span>
      <span style={styles.statChange}>{change}</span>
    </div>
  </div>
);

// Chart Card Component
const ChartCard = ({ title, children }) => (
  <div style={styles.chartCard}>
    <h3 style={styles.chartTitle}>{title}</h3>
    {children}
  </div>
);

// Empty State Component
const EmptyState = ({ message }) => (
  <div style={styles.emptyState}>
    {message}
  </div>
);

// Styles
const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#f5f5f5'
  },
  loadingContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    fontSize: '18px',
    color: '#667eea'
  },
  navbar: {
    backgroundColor: 'white',
    padding: '15px 30px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'sticky',
    top: 0,
    zIndex: 100
  },
  navLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '40px'
  },
  logo: {
    margin: 0,
    color: '#667eea',
    fontSize: '20px'
  },
  navRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '20px'
  },
  userName: {
    color: '#666'
  },
  logoutBtn: {
    padding: '8px 16px',
    backgroundColor: '#f44336',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '14px'
  },
  mainContent: {
    padding: '30px'
  },
  pageTitle: {
    fontSize: '28px',
    color: '#333',
    marginBottom: '30px'
  },
  error: {
    backgroundColor: '#fee',
    color: '#c33',
    padding: '15px',
    borderRadius: '5px',
    marginBottom: '20px'
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '20px',
    marginBottom: '30px'
  },
  statCard: {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '10px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
  },
  statTitle: {
    fontSize: '14px',
    color: '#666',
    margin: '0 0 10px 0'
  },
  statValue: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  statNumber: {
    fontSize: '28px',
    fontWeight: 'bold'
  },
  statChange: {
    fontSize: '12px',
    color: '#4caf50',
    backgroundColor: '#e8f5e8',
    padding: '4px 8px',
    borderRadius: '12px'
  },
  chartsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
    gap: '20px'
  },
  chartCard: {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '10px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
  },
  chartTitle: {
    fontSize: '16px',
    color: '#333',
    margin: '0 0 20px 0'
  },
  tabContainer: {
    display: 'flex',
    gap: '10px',
    marginBottom: '20px'
  },
  tab: {
    padding: '8px 16px',
    border: '1px solid #ddd',
    backgroundColor: 'white',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '14px'
  },
  activeTab: {
    padding: '8px 16px',
    border: 'none',
    backgroundColor: '#667eea',
    color: 'white',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '14px'
  },
  emptyState: {
    textAlign: 'center',
    padding: '40px',
    color: '#999',
    backgroundColor: '#f9f9f9',
    borderRadius: '5px'
  }
};

export default Dashboard;
