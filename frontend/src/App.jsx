import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import { ToastContainer } from "./components/ui/Toast";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import DashboardLayout from "./components/DashboardLayout";
import DashboardPage from "./pages/DashboardPage";
import NewsListPage from "./pages/NewsListPage";
import NewsDetailPage from "./pages/NewsDetailPage";
import AdminNewsPage from "./pages/AdminNewsPage";
import ReportsListPage from "./pages/ReportsListPage";
import ReportDetailPage from "./pages/ReportDetailPage";
import NewReportPage from "./pages/NewReportPage";
import ReportSuccessPage from "./pages/ReportSuccessPage";
import AlertDetailPage from "./pages/AlertDetailPage";
import VolunteerListPage from "./pages/VolunteerListPage";
import VolunteerDetailPage from "./pages/VolunteerDetailPage";
import ProfilePage from "./pages/ProfilePage";
import GuidePage from "./pages/GuidePage";
import HowToReportPage from "./pages/HowToReportPage";
import HowToVolunteerPage from "./pages/HowToVolunteerPage";

// Import new pages
import ContactPage from "./pages/ContactPage";
import AboutPage from "./pages/AboutPage";
import FaqPage from "./pages/FaqPage";
import HowItWorksPage from "./pages/about/HowItWorksPage";
import WhoCanUsePage from "./pages/about/WhoCanUsePage";
import InActionPage from "./pages/about/InActionPage";

import "./styles/theme.css";

import VerifyEmail from "./components/VerifyEmail";
import VerifyOrgEmail from "./components/VerifyOrgEmail";

// Import charity layout and dashboard pages
import CharityLayout from "./components/charity/CharityLayout";
import CharityDashboard from "./pages/charity/Dashboard";
import CharityVolunteers from "./pages/charity/Volunteers";
import CharityVolunteerDetail from "./pages/charity/VolunteerDetail";
import CharityIncidents from "./pages/charity/Incidents";
import CharityIncidentDetail from "./pages/charity/IncidentDetail";
import CharityIncidentNew from "./pages/charity/IncidentNew";
import CharityIncidentAccept from "./pages/charity/IncidentAccept";
import CharityIncidentReject from "./pages/charity/IncidentReject";
import CharitySettings from "./pages/charity/Settings";

// Import new announcement pages
import CharityAnnouncements from "./pages/charity/Announcements";
import CharityAnnouncementDetail from "./pages/charity/AnnouncementDetail";
import CharityAdNew from "./pages/charity/CharityAdNew";
import CharityCampaigns from "./pages/charity/Campaigns";
import CampaignSuccess from "./pages/charity/CampaignSuccess";
import CampaignDetail from "./pages/charity/CampaignDetail";
import CampaignEdit from "./pages/charity/CampaignEdit";

// Import government dashboard pages
import GovernmentLayout from "./components/government/GovernmentLayout";
import GovernmentDashboard from "./pages/government/Dashboard";
import GovernmentIncidents from "./pages/government/Incidents";
import GovernmentIncidentDetail from "./pages/government/IncidentDetail";
import EditIncident from "./pages/government/EditIncident";
import GovernmentCharities from "./pages/government/Charities";
import GovernmentNews from "./pages/government/News";
import CreateNews from "./pages/government/CreateNews";
import CreateAnnouncement from './pages/government/CreateAnnouncement';

// Import admin dashboard pages
import AdminLayout from "./pages/admin/Layout";
import AdminDashboard from "./pages/admin/Dashboard";
import AdminUsers from "./pages/admin/Users";
import UserDetails from "./pages/admin/UserDetails";
import UserEdit from "./pages/admin/UserEdit";
import OrganizationEdit from "./pages/admin/OrganizationEdit";
import SystemSettings from "./pages/admin/SystemSettings";
import PlatformMonitoring from "./pages/admin/PlatformMonitoring";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          
          {/* Contact and About Pages */}
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/faq" element={<FaqPage />} />
          
          {/* About Sub-pages */}
          <Route path="/about/how-it-works" element={<HowItWorksPage />} />
          <Route path="/about/who-can-use" element={<WhoCanUsePage />} />
          <Route path="/about/in-action" element={<InActionPage />} />
          
          {/* Legacy about route support */}
          <Route path="/about/:guideId" element={<GuidePage />} />
          
          {/* Info Pages */}
          <Route path="/reports/how-to-report" element={<HowToReportPage />} />
          <Route path="/volunteer/how-to-volunteer" element={<HowToVolunteerPage />} />
          
          {/* Verification Routes */}
          <Route path="/verify" element={<VerifyEmail />} />
          <Route path="/verify-org-email" element={<VerifyOrgEmail />} />

          {/* Protected Dashboard Routes - Using ProtectedRoute as parent */}
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<DashboardLayout />}>
              <Route index element={<DashboardPage />} />
              {/* Reports Routes */}
              <Route path="reports" element={<ReportsListPage />} />
              <Route path="reports/new" element={<NewReportPage />} />
              <Route path="reports/success" element={<ReportSuccessPage />} />
              <Route path="reports/:reportId" element={<ReportDetailPage />} />
              {/* Alert Routes */}
              <Route path="alerts/:alertId" element={<AlertDetailPage />} />
              {/* News Routes */}
              <Route path="news" element={<NewsListPage />} />
              <Route path="news/:newsId" element={<NewsDetailPage />} />
              <Route path="admin/news" element={<AdminNewsPage />} />
              {/* Volunteer Routes */}
              <Route path="volunteer" element={<VolunteerListPage />} />
              <Route
                path="volunteer/:volunteerId"
                element={<VolunteerDetailPage />}
              />
              {/* Profile Route */}
              <Route path="profile" element={<ProfilePage />} />
              {/* 404 route for dashboard */}
              <Route
                path="*"
                element={<div>Dashboard Section Not Found</div>}
              />
            </Route>

            {/* Charity Dashboard Routes */}
            <Route path="/charity" element={<CharityLayout />}>
              <Route index element={<CharityDashboard />} />
              <Route path="volunteers" element={<CharityVolunteers />} />
              <Route path="volunteers/:id" element={<CharityVolunteerDetail />} />
              <Route path="incidents" element={<CharityIncidents />} />
              <Route path="incidents/new" element={<CharityIncidentNew />} />
              <Route path="incidents/:id" element={<CharityIncidentDetail />} />
              <Route path="incidents/:id/accept" element={<CharityIncidentAccept />} />
              <Route path="incidents/:id/reject" element={<CharityIncidentReject />} />
              <Route path="applications/:applicationId" element={<div>Application Review</div>} />
              <Route path="settings" element={<CharitySettings />} />
              <Route path="announcements" element={<CharityAnnouncements />} />
              <Route path="announcements/:id" element={<CharityAnnouncementDetail />} />
              <Route path="ads/new" element={<CharityAdNew />} />
              <Route path="campaigns" element={<CharityCampaigns />} />
              <Route path="campaigns/success" element={<CampaignSuccess />} />
              <Route path="campaigns/:id" element={<CampaignDetail />} />
              <Route path="campaigns/:id/edit" element={<CampaignEdit />} />
            </Route>

            {/* Government Dashboard Routes */}
            <Route path="/government" element={<GovernmentLayout />}>
              <Route index element={<GovernmentDashboard />} />
              <Route path="incidents" element={<GovernmentIncidents />} />
              <Route path="incidents/edit/:id" element={<EditIncident />} />
              <Route
                path="incidents/:id"
                element={<GovernmentIncidentDetail />}
              />
              <Route path="announcements/create" element={<CreateAnnouncement />} />
              <Route path="charities" element={<GovernmentCharities />} />
              <Route path="news" element={<GovernmentNews />} />
              <Route path="news/create" element={<CreateNews />} />
              <Route path="news/:id" element={<GovernmentNews />} />
              <Route path="settings" element={<div>Government Settings</div>} />
            </Route>

            {/* Admin Dashboard Routes */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="users" element={<AdminUsers />} />
              <Route path="users/details/:userId" element={<UserDetails />} />
              <Route path="users/edit/:userId" element={<UserEdit />} />
              <Route
                path="organizations/edit/:orgId"
                element={<OrganizationEdit />}
              />
              <Route path="system-settings" element={<SystemSettings />} />
              <Route
                path="platform-monitoring"
                element={<PlatformMonitoring />}
              />
            </Route>
          </Route>

          {/* Top-level 404 route */}
          <Route path="*" element={<div>404 Page Not Found</div>} />
        </Routes>
        
        {/* Global Toast Container */}
        <ToastContainer />
      </Router>
    </AuthProvider>
  );
}

export default App;
