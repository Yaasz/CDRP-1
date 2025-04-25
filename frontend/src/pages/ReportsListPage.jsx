import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, Search, Filter, FileText, MapPin, Clock, Trash, ExternalLink, Plus, Loader2, ServerCrash } from 'lucide-react';
import axios from 'axios';

// Mock reports data (will be replaced)
/*
const mockReports = [
  { id: 1, title: "Road Blockage on Bole Road", location: "Bole Road, near Edna Mall, Addis Ababa", date: "July 15, 2024", status: "Pending", description: "Construction debris...", type: "Road Blockage" },
  { id: 2, title: "Power Outage in Kazanchis Area", location: "Kazanchis, Addis Ababa", date: "July 14, 2024", status: "In Progress", description: "Reported power outage...", type: "Power Outage" },
  { id: 3, title: "Localized Flooding near St. George Church", location: "Piassa Area, Addis Ababa", date: "July 10, 2024", status: "Resolved", description: "Heavy rain caused temporary flooding...", type: "Flooding" },
  // Add more reports if needed
];
*/

export default function ReportsListPage() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');

  // --- Fetch reports logic ---
  const fetchReports = useCallback(async () => { // Use useCallback
    // No need to setLoading(true) here if called repeatedly
    // setError(null); // Optionally clear error on refetch
    console.log("Fetching reports..."); // Add log for debugging
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const token = localStorage.getItem('authToken');
    try {
      const authHeaders = token ? { Authorization: `Bearer ${token}` } : {};
      const response = await axios.get(`${backendUrl}/api/report`, { headers: authHeaders });
      console.log("[ReportsListPage] API Response Data:", response.data); // Log the raw response
      const reportsData = response.data.data || [];
      console.log("[ReportsListPage] Setting reports state with:", reportsData); // Log data before setting state
      setReports(reportsData);
      setError(null); // Clear error on success
    } catch (err) {
      console.error("Error fetching reports:", err);
      setError("Failed to load reports. Please try again.");
      // Don't clear existing reports on error, keep showing stale data if available
    } finally {
      setLoading(false); // Set loading false after initial fetch or refetch
    }
  }, []); // useCallback dependency array is empty as it doesn't depend on props/state outside

  // Initial fetch and refetch on focus/visibility
  useEffect(() => {
    setLoading(true); // Set loading true only for the initial fetch
    fetchReports(); // Initial fetch

    // Define explicit handlers for logging and correct removal
    const handleFocus = () => {
      console.log("[ReportsListPage] Window focused, refetching...");
      fetchReports();
    }

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        console.log("[ReportsListPage] Tab became visible, refetching...");
        fetchReports();
      }
    };

    // Add event listeners
    console.log("[ReportsListPage] Adding focus/visibility listeners");
    window.addEventListener('focus', handleFocus);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Cleanup listeners on component unmount
    return () => {
      console.log("[ReportsListPage] Removing focus/visibility listeners");
      window.removeEventListener('focus', handleFocus);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [fetchReports]); // Depend on the memoized fetchReports function

  const filteredReports = reports
    .filter(report => {
      if (!searchTerm) return true;
      const lowerSearch = searchTerm.toLowerCase();
      return (
        report.title.toLowerCase().includes(lowerSearch) ||
        report.location.toLowerCase().includes(lowerSearch) ||
        report.description.toLowerCase().includes(lowerSearch) ||
        report.type.toLowerCase().includes(lowerSearch)
      );
    })
    .filter(report => {
      if (filterStatus === 'All') return true;
      return report.status === filterStatus;
    });

  // Status badge color mapping
  const statusColor = {
    'Pending': 'bg-yellow-100 text-yellow-800 border border-yellow-200',
    'In Progress': 'bg-blue-100 text-blue-800 border border-blue-200',
    'Resolved': 'bg-green-100 text-green-800 border border-green-200'
  };

  // Mock delete function
  const handleDelete = (e, reportId) => {
      e.preventDefault();
      alert(`Delete clicked for report ID: ${reportId} (Mock)`);
      // Add actual delete logic here - possibly update reports state
  }

  // Add Loading State
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        <p className="ml-2 text-gray-600">Loading Reports...</p>
      </div>
    );
  }

  // Add Error State
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64 bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <ServerCrash className="h-12 w-12 text-red-500 mb-4" />
        <h3 className="text-lg font-semibold text-red-700 mb-2">Loading Failed</h3>
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 mb-1">My Reports</h1>
          <p className="text-gray-600 text-sm">View and manage your incident reports.</p>
        </div>
        <Link
          to="/dashboard/reports/new"
          className="flex items-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-md text-sm font-medium transition-colors shadow-sm whitespace-nowrap"
        >
          <Plus className="h-4 w-4 mr-1.5" />
          New Report
        </Link>
      </div>

      {/* Filters & Search */}
      <div className="mb-6 space-y-4">
        <div className="relative">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search reports by title, location, type..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex items-center space-x-2 overflow-x-auto pb-2">
          <div className="flex items-center bg-white border border-gray-200 rounded-md p-1.5 text-sm text-gray-600 mr-1 shadow-sm whitespace-nowrap">
            <Filter className="h-4 w-4 mr-1" />
            <span>Status:</span>
          </div>
          {['All', 'Pending', 'In Progress', 'Resolved'].map(status => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-3 py-1.5 rounded-md text-sm font-medium whitespace-nowrap transition-colors duration-150 shadow-sm ${
                filterStatus === status
                  ? 'bg-blue-600 text-white'
                  : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-100'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Reports Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {filteredReports.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Report</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredReports.map(report => (
                  <tr key={report._id} className="hover:bg-gray-50 transition-colors duration-150">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 border border-blue-200">
                          <FileText className="h-5 w-5" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900 truncate max-w-xs">{report.title || 'Untitled'}</div>
                          <div className="text-xs text-gray-500">{report.type || 'N/A'}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-500">
                        <MapPin className="h-4 w-4 mr-1.5 text-gray-400 flex-shrink-0" />
                        <span className="truncate max-w-xs">{report.location || 'No location'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-500">
                        <Clock className="h-4 w-4 mr-1.5 text-gray-400 flex-shrink-0" />
                        {report.createdAt ? new Date(report.createdAt).toLocaleDateString() : 'Unknown date'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2.5 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full ${statusColor[report.status] || 'bg-gray-100 text-gray-800 border border-gray-200'}`}>
                        {report.status || 'Unknown'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-3">
                        <Link
                          to={`/dashboard/reports/${report._id}`}
                          className="p-1.5 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-md transition-colors duration-150"
                          title="View Details"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </Link>
                        <button
                           onClick={(e) => handleDelete(e, report._id)}
                           className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors duration-150"
                           title="Delete Report"
                        >
                          <Trash className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-8 text-center">
            <AlertTriangle className="h-12 w-12 text-yellow-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-700 mb-2">No Reports Found</h3>
            <p className="text-gray-500 mb-4 text-sm">
              {searchTerm || filterStatus !== 'All'
                ? 'No reports match your current search or filter criteria.'
                : "You haven't submitted any reports yet."}
            </p>
            <Link
              to="/dashboard/reports/new"
              className="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors shadow-sm"
            >
               <Plus className="h-4 w-4 mr-1.5" />
               Submit Your First Report
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
