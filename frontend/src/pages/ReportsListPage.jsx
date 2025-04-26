import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, Search, Filter, FileText, MapPin, Clock, Trash, ExternalLink, Plus } from 'lucide-react';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { format, parseISO } from 'date-fns';

export default function ReportsListPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Get all reports from the API - fixed endpoint path
      const response = await api.get('/report');
      console.log('Reports fetched:', response.data);
      
      // Filter reports by the current user if authenticated and we have a user ID
      let userReports = response.data.reports || [];
      if (user && user._id) {
        userReports = userReports.filter(report => 
          report.reportedBy && (report.reportedBy === user._id || report.reportedBy._id === user._id)
        );
      }
      
      // Sort reports by creation date (newest first)
      userReports.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      
      setReports(userReports);
    } catch (err) {
      console.error('Error fetching reports:', err);
      setError('Failed to load reports. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (e, reportId) => {
    e.preventDefault();
    
    if (!window.confirm('Are you sure you want to delete this report?')) {
      return;
    }
    
    try {
      // Updated to use the correct endpoint
      await api.delete(`/report/${reportId}`);
      // Remove the deleted report from state
      setReports(prevReports => prevReports.filter(report => report._id !== reportId));
    } catch (err) {
      console.error('Error deleting report:', err);
      alert('Failed to delete report. Please try again.');
    }
  };

  const filteredReports = reports
    .filter(report => {
      if (!searchTerm) return true;
      const lowerSearch = searchTerm.toLowerCase();
      return (
        report.title?.toLowerCase().includes(lowerSearch) ||
        (report.location?.coordinates && `${report.location.coordinates[1]}, ${report.location.coordinates[0]}`.includes(lowerSearch)) ||
        report.description?.toLowerCase().includes(lowerSearch) ||
        report._id?.toLowerCase().includes(lowerSearch)
      );
    })
    .filter(report => {
      if (filterStatus === 'All') return true;
      
      // Map backend incident status to UI status
      let reportStatus = 'Pending';
      
      if (report.incident) {
        if (typeof report.incident === 'object') {
          const status = report.incident.status;
          reportStatus = status === 'pending' ? 'Pending' :
                         status === 'active' ? 'In Progress' : 
                         status === 'resolved' ? 'Resolved' : 'Pending';
        } else if (typeof report.incident === 'string') {
          // If incident is just an ID, default to Pending
          reportStatus = 'Pending';
        }
      }
      
      return reportStatus === filterStatus;
    });

  // Status badge color mapping
  const statusColor = {
    'Pending': 'bg-yellow-100 text-yellow-800 border border-yellow-200',
    'In Progress': 'bg-blue-100 text-blue-800 border border-blue-200',
    'Resolved': 'bg-green-100 text-green-800 border border-green-200'
  };

  // Format date from ISO string
  const formatDate = (dateString) => {
    if (!dateString) return '';
    try {
      return format(parseISO(dateString), 'MMMM d, yyyy');
    } catch (error) {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    }
  };

  // Get readable location from coordinates
  const getLocationString = (location) => {
    if (!location || !location.coordinates) return 'Unknown location';
    return `${location.coordinates[1].toFixed(4)}, ${location.coordinates[0].toFixed(4)}`;
  };

  // Get the report status based on its incident
  const getReportStatus = (report) => {
    if (!report.incident) return 'Pending';
    
    if (typeof report.incident === 'object') {
      const status = report.incident.status;
      return status === 'pending' ? 'Pending' :
             status === 'active' ? 'In Progress' : 
             status === 'resolved' ? 'Resolved' : 'Pending';
    }
    
    // If incident is just an ID, default to Pending
    return 'Pending';
  };
  
  // Get the incident type from the report
  const getIncidentType = (report) => {
    if (report.type) return report.type;
    if (report.incident && typeof report.incident === 'object' && report.incident.type) {
      return report.incident.type;
    }
    return 'Uncategorized';
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin h-8 w-8 border-4 border-blue-600 rounded-full border-t-transparent"></div>
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
            placeholder="Search reports by title, location, description..."
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

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-6">
          <p>{error}</p>
        </div>
      )}

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
                {filteredReports.map(report => {
                  const reportStatus = getReportStatus(report);
                  
                  return (
                    <tr key={report._id} className="hover:bg-gray-50 transition-colors duration-150">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 border border-blue-200">
                            <FileText className="h-5 w-5" />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900 truncate max-w-xs">{report.title}</div>
                            <div className="text-xs text-gray-500">{getIncidentType(report)}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm text-gray-500">
                          <MapPin className="h-4 w-4 mr-1.5 text-gray-400 flex-shrink-0" />
                          <span className="truncate max-w-xs">{getLocationString(report.location)}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm text-gray-500">
                          <Clock className="h-4 w-4 mr-1.5 text-gray-400 flex-shrink-0" />
                          {formatDate(report.createdAt)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2.5 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full ${statusColor[reportStatus]}`}>
                          {reportStatus}
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
                  );
                })}
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
