import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AlertTriangle, Search, Plus, ChevronRight, Menu } from "lucide-react";
import api from "../utils/api";

export default function CharityDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [volunteers, setVolunteers] = useState([]);
  const [incidents, setIncidents] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({ activeIncidents: 0, totalVolunteers: 0 });

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'bg-[#CDC1FF] text-[#7371FC]';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'resolved':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  useEffect(() => {
    // Check authentication and user type
    const storedUser = localStorage.getItem('user');
    const authToken = localStorage.getItem('authToken');
    const accountType = localStorage.getItem('accountType');

    if (!authToken || accountType !== 'organization') {
      navigate('/login');
      return;
    }

    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    const fetchData = async () => {
      try {
        const [volunteersRes, incidentsRes, applicationsRes] = await Promise.all([
          api.get('/volunteers'),
          api.get('/incidents'),
          api.get('/applications')
        ]);

        setVolunteers(volunteersRes.data || []);
        setIncidents(incidentsRes.data || []);
        setApplications(applicationsRes.data || []);

        // Calculate stats
        setStats({
          activeIncidents: (incidentsRes.data || []).filter(i => i.status === 'Active').length,
          totalVolunteers: (volunteersRes.data || []).length,
        });
      } catch (error) {
        console.error('Error fetching data:', error);
        if (error.response?.status === 401) {
          localStorage.clear();
          navigate('/login');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F5EFFF] flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-[#7371FC]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5EFFF]">
      <div className="flex h-screen bg-gray-50">
        {/* Sidebar */}
        <div className="hidden md:flex md:flex-shrink-0">
          <div className="flex flex-col w-64">
            <div className="flex flex-col flex-grow pt-5 overflow-y-auto bg-white border-r">
              <div className="flex flex-col flex-grow px-4">
                <nav className="flex-1 space-y-1">
                  <Link
                    to="/charity-dashboard"
                    className="flex items-center px-4 py-2 text-sm font-medium text-[#7371FC] bg-[#F5EFFF] rounded-lg"
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/incidents"
                    className="flex items-center px-4 py-2 text-sm font-medium text-gray-600 hover:bg-[#F5EFFF] hover:text-[#7371FC] rounded-lg"
                  >
                    Incidents
                  </Link>
                  <Link
                    to="/volunteers"
                    className="flex items-center px-4 py-2 text-sm font-medium text-gray-600 hover:bg-[#F5EFFF] hover:text-[#7371FC] rounded-lg"
                  >
                    Volunteers
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center px-4 py-2 text-sm font-medium text-gray-600 hover:bg-[#F5EFFF] hover:text-[#7371FC] rounded-lg w-full text-left"
                  >
                    Logout
                  </button>
                </nav>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          <header className="bg-white shadow-sm border-b border-gray-200 z-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
              <h1 className="text-2xl font-semibold text-[#7371FC]">{user?.organizationName || 'Charity Dashboard'}</h1>
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  <img
                    src={user?.avatar || user?.image || '/placeholder-avatar.jpg'}
                    alt="Profile"
                    className="h-8 w-8 rounded-full"
                  />
                  <span className="ml-2 text-sm font-medium text-gray-700">
                    {user?.firstName && user?.lastName 
                      ? `${user.firstName} ${user.lastName}` 
                      : user?.name || user?.organizationName || 'User'}
                  </span>
                </div>
              </div>
            </div>
          </header>

          {/* Main Content Area */}
          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-[#F5EFFF] p-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow p-6 flex items-center">
                <div className="rounded-full bg-[#CDC1FF] p-3 mr-4">
                  <AlertTriangle className="h-6 w-6 text-[#7371FC]" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Active Incidents</p>
                  <p className="text-2xl font-semibold text-[#7371FC]">{stats.activeIncidents}</p>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6 flex items-center">
                <div className="rounded-full bg-[#CDC1FF] p-3 mr-4">
                  <svg
                    className="h-6 w-6 text-[#7371FC]"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Total Volunteers</p>
                  <p className="text-2xl font-semibold text-[#7371FC]">{stats.totalVolunteers}</p>
                </div>
              </div>
            </div>

            {/* Volunteer Directory */}
            <div className="bg-white rounded-lg shadow mb-8">
              <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                <h2 className="text-lg font-semibold text-gray-800">Volunteer Directory</h2>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search volunteers..."
                    className="w-64 px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#7371FC] focus:border-transparent"
                  />
                  <Search className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
                </div>
              </div>

              <div className="divide-y divide-gray-200">
                {volunteers.map((volunteer) => (
                  <div key={volunteer.id} className="px-6 py-4 flex items-center">
                    <img
                      src={volunteer.image || '/placeholder-avatar.jpg'}
                      alt={volunteer.name}
                      className="h-16 w-16 rounded-full object-cover mr-4"
                    />
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{volunteer.name}</h3>
                      <p className="text-sm text-gray-500">{volunteer.role}</p>
                      <div className="flex justify-between items-center mt-2">
                        <span
                          className={`text-sm ${
                            volunteer.status === "Available"
                              ? "text-green-600"
                              : volunteer.status === "Limited"
                                ? "text-yellow-600"
                                : "text-red-600"
                          }`}
                        >
                          {volunteer.status}
                        </span>
                        <span className="text-sm text-gray-500">{volunteer.experience}</span>
                      </div>
                      <div className="mt-2">
                        <Link
                          to={`/volunteers/${volunteer.id}`}
                          className="text-[#7371FC] hover:text-[#A594F9] text-sm font-medium flex items-center"
                        >
                          Contact <ChevronRight className="h-4 w-4 ml-1" />
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Active Incidents */}
            <div className="bg-white rounded-lg shadow mb-8">
              <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                <div>
                  <h2 className="text-lg font-semibold text-gray-800">Active Incidents</h2>
                  <p className="text-sm text-gray-500">{stats.activeIncidents} active incidents</p>
                </div>
                <Link
                  to="/incidents/new"
                  className="flex items-center px-3 py-2 rounded-md text-sm font-medium bg-[#7371FC] text-white hover:bg-[#A594F9] transition-colors"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  New Incident
                </Link>
              </div>
              <div className="divide-y divide-gray-200">
                {incidents.map((incident) => (
                  <div key={incident.id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-medium text-[#7371FC]">{incident.title}</h3>
                        <p className="text-sm text-gray-500">Created {new Date(incident.createdAt).toLocaleDateString()}</p>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(incident.status)}`}>
                        {incident.status}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Volunteer Applications */}
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-800">Volunteer Applications</h2>
                </div>
                <span className="text-gray-800 font-semibold text-lg">{user?.organization || 'Charity Dashboard'}</span>
              </div>

              {/* Navigation */}
              <nav className="flex-1 px-3 space-y-1">
                <Link
                  to="/dashboard"
                  className="flex items-center px-4 py-2.5 rounded-md text-sm font-medium bg-[#CDC1FF] text-[#7371FC]"
                >
                  <svg
                    className="mr-3 h-5 w-5"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                    />
                  </svg>
                  Dashboard
                </Link>
              <a
                href="#"
                className="flex items-center px-4 py-2.5 rounded-md text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900"
              >
                  <svg
                    className="mr-3 h-5 w-5"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                    />
                  </svg>
                  Volunteers
                </a>
              <a
                href="#"
                className="flex items-center px-4 py-2.5 rounded-md text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900"
              >
                  <svg
                    className="mr-3 h-5 w-5"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
                  Incidents
                </a>
              <a
                href="#"
                className="flex items-center px-4 py-2.5 rounded-md text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900"
              >
                  <svg
                    className="mr-3 h-5 w-5"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  Settings
                </a>
              </nav>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          <header className="bg-white shadow-sm border-b border-gray-200 z-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
              <h1 className="text-2xl font-semibold text-[#7371FC]">{user?.organization || 'Charity Dashboard'}</h1>
          {/* Main Content */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Header */}
            <header className="bg-white shadow-sm border-b border-gray-200 z-10">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
                <h1 className="text-2xl font-semibold text-[#7371FC]">{user?.organization || 'Charity Dashboard'}</h1>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center">
                    <img
                      src={user?.avatar || user?.image || '/placeholder-avatar.jpg'}
                      alt="Profile"
                      className="h-8 w-8 rounded-full"
                    />
                    <span className="ml-2 text-sm font-medium text-gray-700">
                      {user?.firstName && user?.lastName 
                        ? `${user.firstName} ${user.lastName}` 
                        : user?.name || user?.organizationName || 'User'}
                    </span>
                  </div>
                </div>
              </div>
            </header>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200 z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <h1 className="text-xl font-bold text-gray-900">Dashboard</h1>
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  <img className="h-8 w-8 rounded-full" src="/placeholder.svg?height=32&width=32" alt="Sarah Johnson" />
                  <span className="ml-2 text-sm font-medium text-gray-700">Sarah Johnson</span>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
            <main className="flex-1 overflow-x-hidden overflow-y-auto bg-[#F5EFFF] p-6">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 mb-8">
                <div className="bg-white rounded-lg shadow p-6 flex items-center">
                  <div className="rounded-full bg-[#CDC1FF] p-3 mr-4">
                    <AlertTriangle className="h-6 w-6 text-[#7371FC]" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Active Incidents</p>
                    <p className="text-2xl font-semibold text-[#7371FC]">{stats.activeIncidents}</p>
                  </div>
                </div>
                <div className="bg-white rounded-lg shadow p-6 flex items-center">
                  <div className="rounded-full bg-[#CDC1FF] p-3 mr-4">
                    <svg
                      className="h-6 w-6 text-[#7371FC]"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                      />
                    </svg>
                  </div>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search volunteers..."
                  className="pl-8 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
              </div>
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-200">
              <div className="flex">
                <button
                  onClick={() => setActiveTab("experience")}
                  className={`px-6 py-3 text-sm font-medium ${
                    activeTab === "experience"
                      ? "text-blue-600 border-b-2 border-blue-600"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  Experience
                </button>
                <button
                  onClick={() => setActiveTab("availability")}
                  className={`px-6 py-3 text-sm font-medium ${
                    activeTab === "availability"
                      ? "text-blue-600 border-b-2 border-blue-600"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  Availability
                </button>
                <button
                  onClick={() => setActiveTab("skills")}
                  className={`px-6 py-3 text-sm font-medium ${
                    activeTab === "skills"
                      ? "text-blue-600 border-b-2 border-blue-600"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  Skills
                </button>
              </div>
            </div>

            {/* Volunteer Grid */}
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              {volunteers.map((volunteer) => (
                <div key={volunteer.id} className="border border-gray-200 rounded-lg p-4 flex">
                  <img
                    src={volunteer.image || "/placeholder.svg"}
                    alt={volunteer.name}
                    className="h-16 w-16 rounded-full object-cover mr-4"
                  />
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{volunteer.name}</h3>
                    <p className="text-sm text-gray-500">{volunteer.role}</p>
                    <div className="flex justify-between items-center mt-2">
                      <span
                        className={`text-sm ${
                          volunteer.status === "Available"
                            ? "text-green-600"
                            : volunteer.status === "Limited"
                              ? "text-yellow-600"
                              : "text-red-600"
                        }`}
                      >
                        {volunteer.status}
                      </span>
                      <span className="text-sm text-gray-500">{volunteer.experience}</span>
                    </div>
                    <div className="mt-2">
                      <Link
                        to={`/volunteers/${volunteer.id}`}
                        className="text-[#7371FC] hover:text-[#A594F9] text-sm font-medium flex items-center"
                      >
                        Contact <ChevronRight className="h-4 w-4 ml-1" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Active Incidents */}
          <div className="bg-white rounded-lg shadow mb-8">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <div>
                <h2 className="text-lg font-semibold text-gray-800">Active Incidents</h2>
                <p className="text-sm text-gray-500">{stats.activeIncidents} active incidents</p>
              </div>
              <Link
                to="/incidents/new"
                className="flex items-center px-3 py-2 rounded-md text-sm font-medium bg-[#7371FC] text-white hover:bg-[#A594F9] transition-colors"
              >
                <Plus className="w-4 h-4 mr-2" />
                New Incident
              </Link>
            </div>
            <div className="divide-y divide-gray-200">
              {incidents.map((incident) => (
                <div key={incident.id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-medium text-[#7371FC]">{incident.title}</h3>
                      <p className="text-sm text-gray-500">Created {new Date(incident.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(incident.status)}`}>
                      {incident.status}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Volunteer Applications */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-800">Volunteer Applications</h2>
            </div>
            <div className="divide-y divide-gray-200">
              {applications.map((application) => (
                <div key={application.id} className="px-6 py-4 flex items-center">
                  <img
                    src={application.image || "/placeholder-avatar.jpg"}
                    alt={application.name}
                    className="h-10 w-10 rounded-full object-cover mr-4"
                  />
                  <div>
                    <h3 className="font-medium text-gray-900">{application.name}</h3>
                    <p className="text-sm text-gray-500">{application.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          </main>
        </div>
      </div>
    </div>
  );
}
