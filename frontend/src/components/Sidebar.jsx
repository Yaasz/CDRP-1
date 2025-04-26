import { Link, NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, FileText, Newspaper, UserRoundCog, LogOut, UsersRound, LifeBuoy, Settings } from 'lucide-react';
import { useAuth } from '../context/AuthContext'; // Import useAuth

export default function Sidebar() {
  const navigate = useNavigate();
  const { user } = useAuth(); // Get user data including role

  // Mock logout function
  const handleLogout = () => {
    alert("Logged out! (Mock)");
    navigate('/login'); // Redirect to login after mock logout
  };

  // Helper function for NavLink classes
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
            <Link to="/dashboard" className="flex items-center">
              <div className="text-blue-600 font-bold text-2xl mr-2">
                <span className="bg-blue-600 text-white p-1 rounded">CDRP</span>
              </div>
              <span className="text-gray-800 font-semibold text-lg">Dashboard</span>
            </Link>
          </div>

          {/* Navigation */}
          <div className="flex-1 px-3 space-y-1">
            <NavLink to="/dashboard" end className={getNavLinkClass}>
              <LayoutDashboard className="mr-3 h-5 w-5" />
              Overview
            </NavLink>
            <NavLink to="/dashboard/reports" className={getNavLinkClass}>
              <FileText className="mr-3 h-5 w-5" />
              Reports
            </NavLink>
             <NavLink to="/dashboard/news" className={getNavLinkClass}>
               <Newspaper className="mr-3 h-5 w-5" />
               News & Updates
             </NavLink>
             <NavLink to="/dashboard/volunteer" className={getNavLinkClass}>
               <UsersRound className="mr-3 h-5 w-5" />
               Volunteer Hub
             </NavLink>
             
             {/* Admin Links - Only visible to administrators */}
             {user && (user.role === 'admin' || user.accountType === 'admin') && (
               <div className="pt-4 mt-4 border-t border-gray-200">
                 <p className="px-4 py-1 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                   Admin
                 </p>
                 <NavLink to="/dashboard/admin/news" className={getNavLinkClass}>
                   <Settings className="mr-3 h-5 w-5" />
                   Manage News
                 </NavLink>
               </div>
             )}
          </div>

          {/* Bottom Section (Profile, Logout) */}
          <div className="mt-auto px-3 pt-4 pb-2 space-y-1 border-t border-gray-200">
             <NavLink to="/dashboard/profile" className={getNavLinkClass}>
                <UserRoundCog className="mr-3 h-5 w-5" />
                Profile Settings
            </NavLink>
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
}
