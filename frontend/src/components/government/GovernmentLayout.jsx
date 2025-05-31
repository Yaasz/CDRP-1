import { Outlet, useLocation } from 'react-router-dom';
import GovernmentSidebar from './GovernmentSidebar';
import GovernmentHeader from './GovernmentHeader';

export default function GovernmentLayout() {
  const location = useLocation();
  
  // Function to get title based on current route
  const getPageTitle = () => {
    const path = location.pathname;
    
    if (path === '/government') return 'Dashboard';
    if (path.includes('/incidents')) {
      if (path.includes('/incidents/new')) return 'New Incident';
      if (path.includes('/incidents/edit/')) return 'Edit Incident';
      if (path.includes('/incidents/')) return 'Incident Details';
      return 'Incident Management';
    }
    if (path.includes('/charities')) {
      if (path.includes('/charities/')) return 'Charity Details';
      return 'Charity Management';
    }
    if (path.includes('/announcements')) {
      if (path.includes('/announcements/create')) return 'Create Announcement';
      if (path.includes('/announcements/')) return 'Announcement Details';
      return 'Announcements';
    }
    if (path.includes('/news')) {
      if (path.includes('/news/create')) return 'Create News';
      if (path.includes('/news/')) return 'News Details';
      return 'News Management';
    }
    if (path.includes('/settings')) return 'Settings';
    
    return 'Dashboard';
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Static sidebar for desktop */}
      <GovernmentSidebar />

      {/* Mobile sidebar (conditionally rendered, state needed) */}
      {/* Add Mobile Sidebar component here later */}

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Pass dynamic title to header */}
        <GovernmentHeader title={getPageTitle()} />

        {/* Match main content area styles from Dashboard layout */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-4 sm:p-6">
          {/* Page content goes here */}
          <Outlet />
        </main>
      </div>
    </div>
  );
} 