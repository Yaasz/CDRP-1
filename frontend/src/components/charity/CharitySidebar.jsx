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
  const { logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  // Helper function for NavLink classes - matching main Sidebar styling
  const getNavLinkClass = ({ isActive }) => {
    return `flex items-center px-4 py-2.5 rounded-md text-sm font-medium transition-colors duration-150 ${
      isActive
        ? 'bg-blue-100 text-blue-700'
        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
    }`;
  };

  return (
    <div className="hidden md:flex md:flex-shrink-0">
      <div className="flex flex-col w-64">
        <div className="flex flex-col flex-grow border-r border-gray-200 bg-white pt-5 pb-4 overflow-y-auto">
          {/* Logo Section */}
          <div className="flex items-center flex-shrink-0 px-4 mb-6">
            <Link to="/charity" className="flex items-center">
              <div className="text-blue-600 font-bold text-2xl mr-2">
                <span className="bg-blue-600 text-white p-1 rounded">Hope</span>
              </div>
              <span className="text-gray-800 font-semibold text-lg">Ethiopia</span>
            </Link>
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
          <div className="mt-auto px-3 pt-4 pb-2 space-y-1 border-t border-gray-200">
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