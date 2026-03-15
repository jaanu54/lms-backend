import React, { useState, useEffect } from 'react';
import { 
  UserCircleIcon,
  EnvelopeIcon,
  PhoneIcon,
  CalendarIcon,
  MapPinIcon,
  PencilIcon,
  CameraIcon,
  KeyIcon,
  ClockIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline';
import profileService from '../services/profileService';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [activity, setActivity] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    bio: '',
    location: '',
    website: ''
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [activeTab, setActiveTab] = useState('profile');

  useEffect(() => {
    console.log('Profile component mounted');
    console.log('Token exists:', !!localStorage.getItem('token'));
    console.log('User in localStorage:', localStorage.getItem('user'));
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    try {
      setLoading(true);
      
      // First, get data from localStorage as fallback
      const storedUser = localStorage.getItem('user');
      if (storedUser && storedUser !== 'undefined') {
        try {
          const userData = JSON.parse(storedUser);
          console.log('Using localStorage user data:', userData);
          setUser(userData);
          setFormData({
            name: userData.name || '',
            email: userData.email || '',
            phone: userData.phone || '',
            bio: userData.bio || '',
            location: userData.location || '',
            website: userData.website || ''
          });
        } catch (e) {
          console.error('Error parsing stored user:', e);
        }
      }

      // Try to fetch from server
      try {
        console.log('Fetching profile from server...');
        const profileData = await profileService.getProfile();
        console.log('Server response:', profileData);
        
        if (profileData && profileData.user) {
          console.log('Setting user from server:', profileData.user);
          setUser(profileData.user);
          setFormData({
            name: profileData.user.name || '',
            email: profileData.user.email || '',
            phone: profileData.user.phone || '',
            bio: profileData.user.bio || '',
            location: profileData.user.location || '',
            website: profileData.user.website || ''
          });
          // Update localStorage with fresh data
          localStorage.setItem('user', JSON.stringify(profileData.user));
        }
      } catch (apiErr) {
        console.log('Server fetch failed, using localStorage data:', apiErr.message);
        // If we already have user from localStorage, no need to show error
        if (!storedUser || storedUser === 'undefined') {
          setError('Could not load profile from server');
        }
      }

      // Try to fetch activity
      try {
        const activityData = await profileService.getUserActivity();
        setActivity(activityData.activities || []);
      } catch (activityErr) {
        console.log('Could not load activity data');
        setActivity([]);
      }

      setError(null);
    } catch (err) {
      console.error('Error in fetchProfileData:', err);
      setError('Failed to load profile data');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await profileService.updateProfile(formData);
      setUser(response.user);
      // Update localStorage
      localStorage.setItem('user', JSON.stringify(response.user));
      setSuccess('Profile updated successfully!');
      setIsEditing(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError('New passwords do not match');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      await profileService.changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });
      setSuccess('Password changed successfully!');
      setIsChangingPassword(false);
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setLoading(true);
    setError(null);

    try {
      const response = await profileService.uploadProfilePicture(file);
      setUser(response.user);
      setSuccess('Profile picture updated!');
    } catch (err) {
      setError('Failed to upload picture');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading && !user) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Profile Header */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
          <div className="bg-gradient-to-r from-primary-600 to-primary-800 h-32"></div>
          <div className="px-6 pb-6">
            <div className="flex flex-col md:flex-row items-start md:items-end -mt-16">
              {/* Profile Picture */}
              <div className="relative group">
                <div className="h-32 w-32 rounded-full border-4 border-white bg-white overflow-hidden">
                  {user?.profilePicture ? (
                    <img 
                      src={user.profilePicture} 
                      alt={user.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <UserCircleIcon className="h-full w-full text-gray-400" />
                  )}
                </div>
                <label className="absolute bottom-0 right-0 bg-primary-600 rounded-full p-2 cursor-pointer hover:bg-primary-700 transition-colors">
                  <CameraIcon className="h-4 w-4 text-white" />
                  <input 
                    type="file" 
                    className="hidden" 
                    accept="image/*"
                    onChange={handleFileUpload}
                  />
                </label>
              </div>

              {/* User Info */}
              <div className="mt-4 md:mt-0 md:ml-6 flex-1">
                <div className="flex flex-col md:flex-row md:items-center justify-between">
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">{user?.name || 'User'}</h1>
                    <p className="text-gray-600">{user?.email}</p>
                  </div>
                  <div className="mt-4 md:mt-0">
                    <button
                      onClick={() => setIsEditing(!isEditing)}
                      className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
                    >
                      <PencilIcon className="h-5 w-5" />
                      <span>{isEditing ? 'Cancel' : 'Edit Profile'}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Success/Error Messages */}
        {error && (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
            {success}
          </div>
        )}

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-md mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              <button
                onClick={() => setActiveTab('profile')}
                className={`px-6 py-3 text-sm font-medium ${
                  activeTab === 'profile'
                    ? 'border-b-2 border-primary-600 text-primary-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Profile
              </button>
              <button
                onClick={() => setActiveTab('activity')}
                className={`px-6 py-3 text-sm font-medium ${
                  activeTab === 'activity'
                    ? 'border-b-2 border-primary-600 text-primary-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Activity Log
              </button>
              <button
                onClick={() => setActiveTab('settings')}
                className={`px-6 py-3 text-sm font-medium ${
                  activeTab === 'settings'
                    ? 'border-b-2 border-primary-600 text-primary-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Settings
              </button>
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-lg shadow-md p-6">
          {activeTab === 'profile' && (
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Profile Information</h2>
              
              {isEditing ? (
                <form onSubmit={handleProfileSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Full Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-primary-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-primary-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Phone
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Location
                      </label>
                      <input
                        type="text"
                        name="location"
                        value={formData.location}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Website
                      </label>
                      <input
                        type="url"
                        name="website"
                        value={formData.website}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Bio
                      </label>
                      <textarea
                        name="bio"
                        value={formData.bio}
                        onChange={handleInputChange}
                        rows="3"
                        className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end space-x-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="px-4 py-2 bg-gray-100 rounded-md hover:bg-gray-200"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50"
                    >
                      {loading ? 'Saving...' : 'Save Changes'}
                    </button>
                  </div>
                </form>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <div className="flex items-center space-x-3 mb-4">
                      <UserCircleIcon className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500">Full Name</p>
                        <p className="text-gray-900">{user?.name || 'Not set'}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 mb-4">
                      <EnvelopeIcon className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500">Email</p>
                        <p className="text-gray-900">{user?.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 mb-4">
                      <PhoneIcon className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500">Phone</p>
                        <p className="text-gray-900">{user?.phone || 'Not set'}</p>
                      </div>
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center space-x-3 mb-4">
                      <MapPinIcon className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500">Location</p>
                        <p className="text-gray-900">{user?.location || 'Not set'}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 mb-4">
                      <CalendarIcon className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500">Member Since</p>
                        <p className="text-gray-900">
                          {user?.createdAt ? formatDate(user.createdAt) : 'N/A'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 mb-4">
                      <CheckCircleIcon className="h-5 w-5 text-green-500" />
                      <div>
                        <p className="text-sm text-gray-500">Account Status</p>
                        <p className="text-green-600 font-medium">Active</p>
                      </div>
                    </div>
                  </div>
                  {user?.bio && (
                    <div className="md:col-span-2">
                      <p className="text-sm text-gray-500 mb-1">Bio</p>
                      <p className="text-gray-700">{user.bio}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {activeTab === 'activity' && (
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Recent Activity</h2>
              {activity.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No recent activity</p>
              ) : (
                <div className="space-y-4">
                  {activity.map((item, index) => (
                    <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                      <ClockIcon className="h-5 w-5 text-gray-400 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-gray-800">{item.action}</p>
                        <p className="text-sm text-gray-500">{formatDate(item.timestamp)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'settings' && (
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Account Settings</h2>
              
              {/* Change Password Section */}
              <div className="border-b border-gray-200 pb-6 mb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Change Password</h3>
                
                {isChangingPassword ? (
                  <form onSubmit={handlePasswordSubmit} className="space-y-4 max-w-md">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Current Password
                      </label>
                      <input
                        type="password"
                        name="currentPassword"
                        value={passwordData.currentPassword}
                        onChange={handlePasswordChange}
                        className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-primary-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        New Password
                      </label>
                      <input
                        type="password"
                        name="newPassword"
                        value={passwordData.newPassword}
                        onChange={handlePasswordChange}
                        className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-primary-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Confirm New Password
                      </label>
                      <input
                        type="password"
                        name="confirmPassword"
                        value={passwordData.confirmPassword}
                        onChange={handlePasswordChange}
                        className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-primary-500"
                        required
                      />
                    </div>
                    <div className="flex space-x-3">
                      <button
                        type="button"
                        onClick={() => setIsChangingPassword(false)}
                        className="px-4 py-2 bg-gray-100 rounded-md hover:bg-gray-200"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={loading}
                        className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50"
                      >
                        {loading ? 'Changing...' : 'Change Password'}
                      </button>
                    </div>
                  </form>
                ) : (
                  <button
                    onClick={() => setIsChangingPassword(true)}
                    className="flex items-center space-x-2 px-4 py-2 bg-gray-100 rounded-md hover:bg-gray-200"
                  >
                    <KeyIcon className="h-5 w-5" />
                    <span>Change Password</span>
                  </button>
                )}
              </div>

              {/* Danger Zone */}
              <div>
                <h3 className="text-lg font-medium text-red-600 mb-4">Danger Zone</h3>
                <button className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700">
                  Delete Account
                </button>
                <p className="text-sm text-gray-500 mt-2">
                  Once you delete your account, there is no going back. Please be certain.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
