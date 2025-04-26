import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext'; // Import AuthProvider
import ProtectedRoute from './components/ProtectedRoute'; // Import ProtectedRoute
import LandingPage from './pages/LandingPage'; // Assuming LandingPage.jsx is in src/pages/
import LoginPage from './pages/LoginPage'; // Import the LoginPage
import DashboardLayout from './components/DashboardLayout'; // Import the layout
import DashboardPage from './pages/DashboardPage'; // Import the dashboard page
import NewsListPage from './pages/NewsListPage'; // Import News List Page
import NewsDetailPage from './pages/NewsDetailPage'; // Import News Detail Page
import AdminNewsPage from './pages/AdminNewsPage'; // Import Admin News Page
import ReportsListPage from './pages/ReportsListPage'; // Import Reports List
import ReportDetailPage from './pages/ReportDetailPage'; // Import Report Detail
import NewReportPage from './pages/NewReportPage'; // Import New Report Form
import ReportSuccessPage from './pages/ReportSuccessPage'; // Import Report Success Page
import VolunteerListPage from './pages/VolunteerListPage'; // Import Volunteer List
import VolunteerDetailPage from './pages/VolunteerDetailPage'; // Import Volunteer Detail
import ProfilePage from './pages/ProfilePage'; // Import Profile Page
// Remove useState, logos, and App.css import if not needed for layout
// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
// import './App.css' // Keep if it contains essential layout styles, remove if not

function App() {
  // Remove default Vite state and JSX
  // const [count, setCount] = useState(0)

  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} /> {/* Add login route */}

          {/* Protected Dashboard Routes - Using ProtectedRoute as parent */}
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<DashboardLayout />}>
              <Route index element={<DashboardPage />} /> {/* Default dashboard page */}
              {/* Reports Routes */}
              <Route path="reports" element={<ReportsListPage />} />
              <Route path="reports/new" element={<NewReportPage />} />
              <Route path="reports/success" element={<ReportSuccessPage />} />
              <Route path="reports/:reportId" element={<ReportDetailPage />} />
              {/* News Routes */}
              <Route path="news" element={<NewsListPage />} /> {/* News List Route */}
              <Route path="news/:newsId" element={<NewsDetailPage />} /> {/* News Detail Route */}
              <Route path="admin/news" element={<AdminNewsPage />} /> {/* Admin News Management Route */}
              {/* Volunteer Routes */}
              <Route path="volunteer" element={<VolunteerListPage />} />
              <Route path="volunteer/:volunteerId" element={<VolunteerDetailPage />} /> {/* Changed param name */}
              {/* Profile Route */}
              <Route path="profile" element={<ProfilePage />} />
              {/* Add a 404 or catch-all route within dashboard if needed */}
              <Route path="*" element={<div>Dashboard Section Not Found</div>} />
            </Route>
          </Route>

          {/* Add a top-level 404 Not Found route if desired */}
          <Route path="*" element={<div>404 Page Not Found</div>} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
