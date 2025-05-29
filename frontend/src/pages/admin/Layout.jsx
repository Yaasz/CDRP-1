import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, Settings, BarChart2, LogOut, Bell, Search } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import GoogleTranslateButton from '../../components/GoogleTranslateButton';
import { useState } from 'react';

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  // Check if user has admin role
  if (user?.role !== 'admin') {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-center p-8 bg-white rounded-lg shadow-md">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-red-600 text-2xl font-bold">!</span>
          </div>
          <h1 className="text-2xl font-bold text-red-600 mb-2">Access Denied</h1>
          <p className="text-gray-600 mb-4">You do not have permission to access this page.</p>
          <button 
            onClick={() => navigate('/login')} 
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Return to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-md hidden md:block">
        <div className="flex items-center justify-center h-16 border-b border-gray-100">
          <div className="text-xl font-bold text-blue-600">
            <span className="bg-blue-600 text-white px-2 py-1 rounded">CDRP</span>
            <span className="ml-1">Admin</span>
          </div>
        </div>
        <nav className="mt-4 flex flex-col h-[calc(100%-64px)]">
          <div className="px-4 mb-6">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                {user?.image ? (
                  <img src={user.image} alt="Profile" className="w-10 h-10 rounded-full object-cover" />
                ) : (
                  <span className="text-blue-600 font-semibold">
                    {user?.firstName?.charAt(0) || user?.full_name?.charAt(0) || 'A'}
                  </span>
                )}
              </div>
              <div>
                <div className="text-sm font-medium text-gray-900">
                  {user?.full_name || (user?.firstName && user?.lastName ? `${user.firstName} ${user.lastName}` : 'Admin User')}
                </div>
                <div className="text-xs text-gray-500">
                  Administrator
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex-1 px-2 space-y-1">
            <NavLink
              to="/admin"
              end
              className={({ isActive }) => 
                `flex items-center px-4 py-2.5 rounded-md transition-colors duration-150 ${
                  isActive 
                    ? 'bg-blue-50 text-blue-600 font-medium' 
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`
              }
            >
              <LayoutDashboard className="w-5 h-5 mr-3" />
              <span>Dashboard</span>
            </NavLink>
            <NavLink
              to="/admin/users"
              className={({ isActive }) => 
                `flex items-center px-4 py-2.5 rounded-md transition-colors duration-150 ${
                  isActive 
                    ? 'bg-blue-50 text-blue-600 font-medium' 
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`
              }
            >
              <Users className="w-5 h-5 mr-3" />
              <span>User Management</span>
            </NavLink>
            <NavLink
              to="/admin/system-settings"
              className={({ isActive }) => 
                `flex items-center px-4 py-2.5 rounded-md transition-colors duration-150 ${
                  isActive 
                    ? 'bg-blue-50 text-blue-600 font-medium' 
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`
              }
            >
              <Settings className="w-5 h-5 mr-3" />
              <span>System Settings</span>
            </NavLink>
            <NavLink
              to="/admin/platform-monitoring"
              className={({ isActive }) => 
                `flex items-center px-4 py-2.5 rounded-md transition-colors duration-150 ${
                  isActive 
                    ? 'bg-blue-50 text-blue-600 font-medium' 
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`
              }
            >
              <BarChart2 className="w-5 h-5 mr-3" />
              <span>Platform Monitoring</span>
            </NavLink>
          </div>

          {/* Logout button at the bottom */}
          <div className="px-2 py-4 mt-auto border-t border-gray-100">
            <button
              onClick={handleLogout}
              className="flex items-center w-full px-4 py-2.5 rounded-md text-gray-600 hover:bg-red-50 hover:text-red-600 transition-colors"
            >
              <LogOut className="w-5 h-5 mr-3" />
              <span>Logout</span>
            </button>
          </div>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white shadow-sm z-10">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 items-center justify-between">
              <h1 className="text-lg font-semibold text-gray-800">Admin Dashboard</h1>
              
              <div className="flex items-center space-x-4">
                {/* Search */}
                <div className="relative hidden md:block">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search..."
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  />
                </div>
                
                <GoogleTranslateButton />
                
                {/* Notifications */}
                <button className="p-1 rounded-full text-gray-600 hover:bg-gray-100 relative">
                  <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500"></span>
                  <Bell className="h-6 w-6" />
                </button>
                
                {/* Profile Dropdown */}
                <div className="relative">
                  <button 
                    onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                    className="flex items-center focus:outline-none"
                  >
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                      {user?.image ? (
                        <img src={user.image} alt="Profile" className="w-8 h-8 rounded-full object-cover" />
                      ) : (
                        <span className="text-blue-600 font-semibold">
                          {user?.firstName?.charAt(0) || user?.full_name?.charAt(0) || 'A'}
                        </span>
                      )}
                    </div>
                  </button>
                  
                  {isProfileDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 border border-gray-200">
                      <div className="px-4 py-2 border-b border-gray-100">
                        <div className="text-sm font-medium text-gray-900">
                          {user?.full_name || (user?.firstName && user?.lastName ? `${user.firstName} ${user.lastName}` : 'Admin User')}
                        </div>
                        <div className="text-xs text-gray-500">{user?.email || 'admin@example.com'}</div>
                      </div>
                      <a href="/admin/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        Profile Settings
                      </a>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </header>
        
        <main className="flex-1 overflow-y-auto bg-gray-50 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
} 