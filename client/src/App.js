import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Courses from './pages/Courses';
import CourseDetail from './pages/CourseDetail';
import Students from './pages/Students';
import Enrollments from './pages/Enrollments';
import Profile from './pages/Profile';
import Reports from './pages/Reports';
import Payment from './pages/Payment';
import Certificate from './pages/Certificate';
import Forum from './pages/Forum';
import AdminDashboard from './pages/AdminDashboard';

// Protected Route wrapper for admin only
const AdminRoute = ({ children }) => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  
  if (!user || user.role !== 'admin') {
    // Not logged in or not admin, redirect to home
    return <Navigate to="/" replace />;
  }
  
  return children;
};

// Protected Route wrapper for authenticated users
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        
        {/* Protected Routes (require login) */}
        <Route path="/" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
        
        <Route path="/courses" element={
          <ProtectedRoute>
            <Courses />
          </ProtectedRoute>
        } />
        
        <Route path="/courses/:id" element={
          <ProtectedRoute>
            <CourseDetail />
          </ProtectedRoute>
        } />
        
        <Route path="/students" element={
          <ProtectedRoute>
            <Students />
          </ProtectedRoute>
        } />
        
        <Route path="/enrollments" element={
          <ProtectedRoute>
            <Enrollments />
          </ProtectedRoute>
        } />
        
        <Route path="/profile" element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        } />
        
        <Route path="/reports" element={
          <ProtectedRoute>
            <Reports />
          </ProtectedRoute>
        } />
        
        <Route path="/payment" element={
          <ProtectedRoute>
            <Payment />
          </ProtectedRoute>
        } />
        
        <Route path="/payment/:courseId" element={
          <ProtectedRoute>
            <Payment />
          </ProtectedRoute>
        } />
        
        <Route path="/certificate" element={
          <ProtectedRoute>
            <Certificate />
          </ProtectedRoute>
        } />
        
        <Route path="/certificate/:enrollmentId" element={
          <ProtectedRoute>
            <Certificate />
          </ProtectedRoute>
        } />
        
        <Route path="/forum" element={
          <ProtectedRoute>
            <Forum />
          </ProtectedRoute>
        } />
        
        <Route path="/forum/:courseId" element={
          <ProtectedRoute>
            <Forum />
          </ProtectedRoute>
        } />
        
        {/* Admin Only Route */}
        <Route path="/admin" element={
          <ProtectedRoute>
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          </ProtectedRoute>
        } />
        
        {/* Catch all - redirect to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;