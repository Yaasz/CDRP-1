import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  LogOut, 
  AlertTriangle, 
  Users, 
  Settings 
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const CharitySidebar = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  // Helper function for NavLink classes
  const getNavLinkClass = ({ isActive }) => {
    return `flex items-center px-4 py-2.5 rounded-md text-sm font-medium transition-colors duration-150 ${
      isActive
        ? 'bg-[#F5EFFF] text-[#7371FC]'
        : 'text-gray-600 hover:bg-[#F5EFFF]/50 hover:text-[#7371FC]'
    }`;
  };

  return (
    <div className="hidden md:flex md:flex-shrink-0">
      <div className="flex flex-col w-64">
        <div className="flex flex-col flex-grow border-r border-[#E5D9F2] bg-white pt-5 pb-4 overflow-y-auto">
          {/* Logo Section */}
          <div className="flex items-center flex-shrink-0 px-4 mb-6">
            <Link to="/charity" className="flex items-center">
              <div className="text-[#7371FC] font-bold text-2xl mr-2">
                <span className="bg-[#7371FC] text-white p-1 rounded">Hope</span>
              </div>
              <span className="text-gray-800 font-semibold text-lg">Ethiopia</span>
            </Link>
          </div>
          
          {/* User Info */}
          <div className="px-4 mb-6">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-[#F5EFFF] flex items-center justify-center mr-3">
                {user?.image ? (
                  <img src={user.image} alt="Profile" className="w-10 h-10 rounded-full object-cover" />
                ) : (
                  <span className="text-[#7371FC] font-semibold">
                    {user?.organizationName?.charAt(0) || 'O'}
                  </span>
                )}
              </div>
              <div>
                <div className="text-sm font-medium text-gray-900">
                  {user?.organizationName || 'Charity Organization'}
                </div>
                <div className="text-xs text-gray-500">
                  {user?.role || 'charity'}
                </div>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex-1 px-3 space-y-1">
            <NavLink to="/charity" end className={getNavLinkClass}>
              <LayoutDashboard className="mr-3 h-5 w-5" />
              Dashboard
            </NavLink>
            <NavLink to="/charity/volunteers" className={getNavLinkClass}>
              <Users className="mr-3 h-5 w-5" />
              Volunteers
            </NavLink>
            <NavLink to="/charity/incidents" className={getNavLinkClass}>
              <AlertTriangle className="mr-3 h-5 w-5" />
              Incidents
            </NavLink>
            <NavLink to="/charity/settings" className={getNavLinkClass}>
              <Settings className="mr-3 h-5 w-5" />
              Settings
            </NavLink>
          </div>

          {/* Bottom Section (Logout) */}
          <div className="mt-auto px-3 pt-4 pb-2 space-y-1 border-t border-[#E5D9F2]">
            <button
              onClick={handleLogout}
              className="w-full flex items-center px-4 py-2.5 rounded-md text-sm font-medium text-gray-600 hover:bg-red-50 hover:text-red-700 transition-colors duration-150"
            >
              <LogOut className="mr-3 h-5 w-5" />
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CharitySidebar; 