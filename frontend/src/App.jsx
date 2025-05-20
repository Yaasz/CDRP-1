import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import DashboardLayout from './components/DashboardLayout';
import DashboardPage from './pages/DashboardPage';
import NewsListPage from './pages/NewsListPage';
import NewsDetailPage from './pages/NewsDetailPage';
import AdminNewsPage from './pages/AdminNewsPage';
import ReportsListPage from './pages/ReportsListPage';
import ReportDetailPage from './pages/ReportDetailPage';
import NewReportPage from './pages/NewReportPage';
import ReportSuccessPage from './pages/ReportSuccessPage';
import VolunteerListPage from './pages/VolunteerListPage';
import VolunteerDetailPage from './pages/VolunteerDetailPage';
import ProfilePage from './pages/ProfilePage';
import GuidePage from './pages/GuidePage';
import HowToReportPage from './pages/HowToReportPage';
import HowToVolunteerPage from './pages/HowToVolunteerPage';
import './styles/theme.css';

// Import charity dashboard pages
import CharityDashboard from './pages/charity/Dashboard';
import CharityVolunteers from './pages/charity/Volunteers';
import CharityVolunteerDetail from './pages/charity/VolunteerDetail';
import CharityIncidents from './pages/charity/Incidents';
import CharityIncidentDetail from './pages/charity/IncidentDetail';
import CharityIncidentNew from './pages/charity/IncidentNew';
import CharityIncidentAccept from './pages/charity/IncidentAccept';
import CharityIncidentReject from './pages/charity/IncidentReject';
import CharitySettings from './pages/charity/Settings';

// Import government dashboard pages
import GovernmentLayout from './pages/government/Layout';
import GovernmentDashboard from './pages/government/Dashboard';
import GovernmentIncidents from './pages/government/Incidents';
import GovernmentIncidentDetail from './pages/government/IncidentDetail';
import EditIncident from './pages/government/EditIncident';
import GovernmentReports from './pages/government/Reports';
import GovernmentCharities from './pages/government/Charities';
import GovernmentNews from './pages/government/News';

// Import admin dashboard pages
import AdminLayout from './pages/admin/Layout';
import AdminDashboard from './pages/admin/Dashboard';
import AdminUsers from './pages/admin/Users';
import UserDetails from './pages/admin/UserDetails';
import UserEdit from './pages/admin/UserEdit';
import OrganizationEdit from './pages/admin/OrganizationEdit';
import SystemSettings from './pages/admin/SystemSettings';
import PlatformMonitoring from './pages/admin/PlatformMonitoring';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/about/:guideId" element={<GuidePage />} />
          <Route path="/reports/how-to-report" element={<HowToReportPage />} />
          <Route path="/volunteer/how-to-volunteer" element={<HowToVolunteerPage />} />

          {/* Protected Dashboard Routes - Using ProtectedRoute as parent */}
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<DashboardLayout />}>
              <Route index element={<DashboardPage />} />
              {/* Reports Routes */}
              <Route path="reports" element={<ReportsListPage />} />
              <Route path="reports/new" element={<NewReportPage />} />
              <Route path="reports/success" element={<ReportSuccessPage />} />
              <Route path="reports/:reportId" element={<ReportDetailPage />} />
              {/* News Routes */}
              <Route path="news" element={<NewsListPage />} />
              <Route path="news/:newsId" element={<NewsDetailPage />} />
              <Route path="admin/news" element={<AdminNewsPage />} />
              {/* Volunteer Routes */}
              <Route path="volunteer" element={<VolunteerListPage />} />
              <Route path="volunteer/:volunteerId" element={<VolunteerDetailPage />} />
              {/* Profile Route */}
              <Route path="profile" element={<ProfilePage />} />
              {/* 404 route for dashboard */}
              <Route path="*" element={<div>Dashboard Section Not Found</div>} />
            </Route>
            
            {/* Charity Dashboard Routes */}
            <Route path="/charity" element={<CharityDashboard />} />
            <Route path="/charity/volunteers" element={<CharityVolunteers />} />
            <Route path="/charity/volunteers/:id" element={<CharityVolunteerDetail />} />
            <Route path="/charity/incidents" element={<CharityIncidents />} />
            <Route path="/charity/incidents/new" element={<CharityIncidentNew />} />
            <Route path="/charity/incidents/:id" element={<CharityIncidentDetail />} />
            <Route path="/charity/incidents/:id/accept" element={<CharityIncidentAccept />} />
            <Route path="/charity/incidents/:id/reject" element={<CharityIncidentReject />} />
            <Route path="/charity/applications/:applicationId" element={<div>Application Review</div>} />
            <Route path="/charity/settings" element={<CharitySettings />} />
            
            {/* Government Dashboard Routes */}
            <Route path="/government" element={<GovernmentLayout />}>
              <Route index element={<GovernmentDashboard />} />
              <Route path="incidents" element={<GovernmentIncidents />} />
              <Route path="incidents/edit/:id" element={<EditIncident />} />
              <Route path="incidents/:id" element={<GovernmentIncidentDetail />} />
              <Route path="reports" element={<GovernmentReports />} />
              <Route path="charities" element={<GovernmentCharities />} />
              <Route path="news" element={<GovernmentNews />} />
              <Route path="news/create" element={<GovernmentNews />} />
              <Route path="news/:id" element={<GovernmentNews />} />
              <Route path="settings" element={<div>Government Settings</div>} />
            </Route>
            
            {/* Admin Dashboard Routes */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="users" element={<AdminUsers />} />
              <Route path="users/details/:userId" element={<UserDetails />} />
              <Route path="users/edit/:userId" element={<UserEdit />} />
              <Route path="organizations/edit/:orgId" element={<OrganizationEdit />} />
              <Route path="system-settings" element={<SystemSettings />} />
              <Route path="platform-monitoring" element={<PlatformMonitoring />} />
            </Route>
          </Route>

          {/* Top-level 404 route */}
          <Route path="*" element={<div>404 Page Not Found</div>} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
