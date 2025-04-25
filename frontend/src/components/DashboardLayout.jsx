import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import DashboardHeader from './DashboardHeader';

export default function DashboardLayout() {
  // Add state later if needed for mobile sidebar toggle
  // const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-50"> {/* Changed bg-gray-100 back to bg-gray-50 to match Next.js layout */}
      {/* Static sidebar for desktop */}
      <Sidebar />

      {/* Mobile sidebar (conditionally rendered, state needed) */}
      {/* Add Mobile Sidebar component here later */}

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Pass function to header to toggle mobile sidebar later */}
        <DashboardHeader /* onMobileNavOpen={() => setSidebarOpen(true)} */ />

        {/* Match main content area styles from Next.js layout */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-6">
          {/* Page content goes here */}
          <Outlet />
        </main>
      </div>
    </div>
  );
}
