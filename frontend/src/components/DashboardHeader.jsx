import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Bell, UserCircle, Menu, X } from 'lucide-react';

// We'll need a way to toggle the mobile sidebar later if we implement one
export default function DashboardHeader({ onMobileNavOpen }) {
    const [mobileNavOpen, setMobileNavOpen] = useState(false); // Example state

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
             <button className="p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                <span className="sr-only">View notifications</span>
                <Bell className="h-6 w-6" />
             </button>

             {/* Profile dropdown - simplified for now */}
             <Link to="/dashboard/profile" className="flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                <span className="sr-only">Open user menu</span>
                 <UserCircle className="h-8 w-8 text-gray-600" />
                 <span className="ml-2 text-gray-700 font-medium hidden lg:block">User Name</span> {/* Replace with actual user name */}
            </Link>
          </div>
        </div>
      </div>

       {/* Mobile menu, show/hide based on state - Placeholder */}
       {/* <div className={`md:hidden ${mobileNavOpen ? 'block' : 'hidden'}`} id="mobile-menu">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                Mobile nav links here...
            </div>
            <div className="pt-4 pb-3 border-t border-gray-200">
                Mobile user info here...
            </div>
       </div> */}
    </header>
  );
}
