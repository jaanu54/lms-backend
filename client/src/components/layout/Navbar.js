import { Link, useNavigate } from 'react-router-dom';
import { 
  HomeIcon, 
  BookOpenIcon, 
  UserGroupIcon,
  ArrowRightOnRectangleIcon,
  AcademicCapIcon,
  UserCircleIcon,
  ChartBarIcon,
  ChatBubbleLeftIcon,
  CreditCardIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline';

const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex space-x-8">
            <Link to="/" className="flex items-center space-x-2">
              <BookOpenIcon className="h-8 w-8 text-primary-600" />
              <span className="font-bold text-xl text-gray-800">LMS</span>
            </Link>
            
            <div className="hidden md:flex items-center space-x-4">
              <Link to="/" className="flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50">
                <HomeIcon className="h-5 w-5" />
                <span>Dashboard</span>
              </Link>
              
              <Link to="/courses" className="flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50">
                <BookOpenIcon className="h-5 w-5" />
                <span>Courses</span>
              </Link>
              
              <Link to="/students" className="flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50">
                <UserGroupIcon className="h-5 w-5" />
                <span>Students</span>
              </Link>

              <Link to="/enrollments" className="flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50">
                <AcademicCapIcon className="h-5 w-5" />
                <span>Enrollments</span>
              </Link>

              <Link to="/reports" className="flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50">
                <ChartBarIcon className="h-5 w-5" />
                <span>Reports</span>
              </Link>

              {/* New Features Links */}
              <Link to="/forum" className="flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50">
                <ChatBubbleLeftIcon className="h-5 w-5" />
                <span>Forum</span>
              </Link>

              <Link to="/my-courses" className="flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50">
                <DocumentTextIcon className="h-5 w-5" />
                <span>My Courses</span>
              </Link>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Payment Link - Quick access */}
            <Link
              to="/payment/sample"
              className="hidden lg:flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium text-green-600 hover:text-green-700 hover:bg-green-50"
            >
              <CreditCardIcon className="h-5 w-5" />
              <span>Buy Credits</span>
            </Link>

            {/* Profile Link */}
            <Link
              to="/profile"
              className="flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50"
            >
              <UserCircleIcon className="h-5 w-5" />
              <span className="hidden md:inline">{user.name || 'Profile'}</span>
            </Link>

            {token ? (
              <button
                onClick={handleLogout}
                className="flex items-center space-x-1 px-4 py-2 rounded-md text-sm font-medium text-white bg-primary-600 hover:bg-primary-700"
              >
                <ArrowRightOnRectangleIcon className="h-5 w-5" />
                <span>Logout</span>
              </button>
            ) : (
              <Link
                to="/login"
                className="flex items-center space-x-1 px-4 py-2 rounded-md text-sm font-medium text-white bg-primary-600 hover:bg-primary-700"
              >
                <span>Login</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;