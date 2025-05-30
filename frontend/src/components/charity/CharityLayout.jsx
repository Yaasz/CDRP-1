import { Outlet, useLocation } from 'react-router-dom';
import CharitySidebar from './CharitySidebar';
import CharityHeader from './CharityHeader';

export default function CharityLayout() {
  const location = useLocation();
  
  // Function to get title based on current route
  const getPageTitle = () => {
    const path = location.pathname;
    
    if (path === '/charity') return 'Dashboard';
    if (path.includes('/volunteers')) {
      if (path.includes('/volunteers/')) return 'Volunteer Details';
      return 'Volunteer Management';
    }
    if (path.includes('/incidents')) {
      if (path.includes('/incidents/new')) return 'New Incident';
      if (path.includes('/incidents/') && path.includes('/accept')) return 'Accept Incident';
      if (path.includes('/incidents/') && path.includes('/reject')) return 'Reject Incident';
      if (path.includes('/incidents/')) return 'Incident Details';
      return 'Assigned Incidents';
    }
    if (path.includes('/settings')) return 'Settings';
    if (path.includes('/applications')) return 'Application Review';
    
    return 'Dashboard';
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Static sidebar for desktop */}
      <CharitySidebar />

      {/* Mobile sidebar (conditionally rendered, state needed) */}
      {/* Add Mobile Sidebar component here later */}

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Pass dynamic title to header */}
        <CharityHeader title={getPageTitle()} />

        {/* Match main content area styles from Dashboard layout */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-6">
          {/* Page content goes here */}
          <Outlet />
        </main>
      </div>
    </div>
  );
} 