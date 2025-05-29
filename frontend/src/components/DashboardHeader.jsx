import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Bell, UserCircle, Menu, X, LogOut, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import GoogleTranslateButton from './GoogleTranslateButton';
import api from '../utils/api';

// Avatar component specific for header
const UserAvatar = ({ src, alt, size = "h-8 w-8" }) => (
  <div className={`${size} rounded-full overflow-hidden bg-gray-100 flex items-center justify-center border border-gray-200`}>
    {src ? (
      <img src={src} alt={alt} className="object-cover w-full h-full" />
    ) : (
      <User className="h-4 w-4 text-gray-400" />
    )}
  </div>
);

// We'll need a way to toggle the mobile sidebar later if we implement one
export default function DashboardHeader({ onMobileNavOpen }) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch user profile data
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!user || !user.id) return;
      
      try {
        const response = await api.get(`/user/${user.id}`);
        if (response.data && response.data.data) {
          setUserProfile(response.data.data);
        }
      } catch (err) {
        console.error('Error fetching user profile:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserProfile();
  }, [user]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Get user's display name
  const getUserDisplayName = () => {
    if (userProfile) {
      if (userProfile.firstName && userProfile.lastName) {
        return `${userProfile.firstName} ${userProfile.lastName}`;
      } else if (userProfile.firstName) {
        return userProfile.firstName;
      } else if (userProfile.lastName) {
        return userProfile.lastName;
      }
    }
    
    return user?.name || 'User';
  };

  return (
    <header className="relative bg-white shadow-sm border-b border-gray-200 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left side (Mobile Menu Button) */}
          <div className="flex items-center md:hidden">
             <button
                onClick={() => setMobileNavOpen(!mobileNavOpen)} // Example toggle
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
                aria-expanded={mobileNavOpen}
                aria-label="Open main menu"
              >
                {mobileNavOpen ? <X className="block h-6 w-6" /> : <Menu className="block h-6 w-6" />}
             </button>
          </div>

          {/* Center (e.g., Search Bar - Placeholder) */}
          <div className="flex-1 flex justify-center px-2 lg:ml-6 lg:justify-end">
            <div className="max-w-lg w-full lg:max-w-xs">
              {/* Placeholder for search or other header elements */}
              {/* <label htmlFor="search" className="sr-only">Search</label>
              <div className="relative">
                <input id="search" name="search" className="block w-full ..." placeholder="Search..." />
              </div> */}
            </div>
          </div>

          {/* Right side (Notifications, Profile) */}
          <div className="hidden md:flex items-center space-x-4">
             <GoogleTranslateButton />

             <button className="p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                <span className="sr-only">View notifications</span>
                <Bell className="h-6 w-6" />
             </button>

             {/* Profile dropdown */}
             <div className="relative">
               <button 
                 onClick={() => setShowProfileMenu(!showProfileMenu)}
                 className="flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
               >
                 <span className="sr-only">Open user menu</span>
                 {userProfile && userProfile.image ? (
                   <UserAvatar src={userProfile.image} alt={getUserDisplayName()} />
                 ) : (
                   <UserCircle className="h-8 w-8 text-gray-600" />
                 )}
                 <span className="ml-2 text-gray-700 font-medium hidden lg:block">
                   {getUserDisplayName()}
                 </span>
               </button>

               {/* Dropdown menu */}
               {showProfileMenu && (
                 <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                   <Link 
                     to="/dashboard/profile" 
                     className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                     onClick={() => setShowProfileMenu(false)}
                   >
                     Your Profile
                   </Link>
                   <button
                     onClick={handleLogout}
                     className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                   >
                     <div className="flex items-center">
                       <LogOut className="h-4 w-4 mr-2" />
                       Sign out
                     </div>
                   </button>
                 </div>
               )}
             </div>
          </div>
        </div>
      </div>

       {/* Mobile menu, show/hide based on state */}
       {mobileNavOpen && (
         <div className="md:hidden" id="mobile-menu">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                <Link to="/dashboard" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50">
                  Dashboard
                </Link>
                <Link to="/dashboard/reports" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50">
                  Reports
                </Link>
                <Link to="/dashboard/news" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50">
                  News
                </Link>
            </div>
            <div className="pt-4 pb-3 border-t border-gray-200">
                <div className="flex items-center px-5">
                  <div className="flex-shrink-0">
                    {userProfile && userProfile.image ? (
                      <UserAvatar src={userProfile.image} alt={getUserDisplayName()} size="h-10 w-10" />
                    ) : (
                      <UserCircle className="h-10 w-10 text-gray-600" />
                    )}
                  </div>
                  <div className="ml-3">
                    <div className="text-base font-medium text-gray-800">{getUserDisplayName()}</div>
                    <div className="text-sm font-medium text-gray-500">{userProfile?.email || user?.email || ''}</div>
                  </div>
                </div>
                <div className="mt-3 space-y-1 px-2">
                  <Link to="/dashboard/profile" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50">
                    Your Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left flex items-center px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign out
                  </button>
                </div>
            </div>
         </div>
       )}
    </header>
  );
}
