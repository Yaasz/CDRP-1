import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../utils/api';
import { Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';

export default function GovernmentIncidents() {
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedType, setSelectedType] = useState('All Types');

  // Incident types
  const incidentTypes = ['All Types', 'Flood', 'Fire', 'Storm', 'Earthquake', 'Other'];

  // Get status badge color based on status
  const getStatusBadgeColor = (status) => {
    if (!status) return 'bg-gray-100 text-gray-800';
    
    switch (status.toLowerCase()) {
      case 'in progress':
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'critical':
        return 'bg-red-100 text-red-600';
      case 'resolved':
      case 'validated':
        return 'bg-green-100 text-green-800';
      case 'assigned':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Format the date for display
  const formatTimeAgo = (date) => {
    if (!date) return '';
    
    const now = new Date();
    const reportDate = new Date(date);
    const diffMs = now - reportDate;
    const diffMins = Math.floor(diffMs / (1000 * 60));
    
    if (diffMins < 60) {
      return `${diffMins} mins ago`;
    } else {
      const diffHrs = Math.floor(diffMins / 60);
      if (diffHrs < 24) {
        return `${diffHrs} hour${diffHrs > 1 ? 's' : ''} ago`;
      } else {
        const diffDays = Math.floor(diffHrs / 24);
        return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
      }
    }
  };

  // Truncate ID to show only first 6 characters
  const truncateId = (id) => {
    if (!id) return '';
    return id.substring(0, 6) + '...';
  };

  // Fetch incidents data
  useEffect(() => {
    const fetchIncidents = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Prepare query parameters
        const params = {
          page: currentPage,
          limit: 10,
          search: searchTerm,
        };
        
        // Add type filter if not "All Types"
        if (selectedType !== 'All Types') {
          params.type = selectedType;
        }

        const response = await api.get('/incidents', { params });
        
        if (response.data && response.data.data) {
          const fetchedIncidents = response.data.data;
          setIncidents(fetchedIncidents);
          setTotalPages(Math.ceil(response.data.totalCount / 10) || 1);
        } else {
          setError('No incidents found. Please try again later.');
        }
      } catch (err) {
        console.error('Error fetching incidents:', err);
        setError('Failed to load incidents. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchIncidents();
  }, [currentPage, searchTerm, selectedType]);

  // Handle search
  const handleSearch = (e) => {
    e.preventDefault();
    // Reset to first page when searching
    setCurrentPage(1);
    // Search term is already set by input onChange
  };

  // Handle type filter change
  const handleTypeChange = (type) => {
    setSelectedType(type);
    setCurrentPage(1); // Reset to first page when changing filter
  };

  // Pagination handlers
  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Get location name from incident
  const getLocationName = (incident) => {
    if (!incident) return 'Unknown';
    
    if (typeof incident.location === 'string') {
      return incident.location;
    }
    
    if (incident.location && incident.location.name) {
      return incident.location.name;
    }
    
    // For GeoJSON Point data, try to show coordinates
    if (incident.location && incident.location.type === 'Point' && 
        incident.location.coordinates && incident.location.coordinates.length === 2) {
      const [long, lat] = incident.location.coordinates;
      return `${lat.toFixed(4)}, ${long.toFixed(4)}`;
    }
    
    // Based on incident type, return a placeholder
    switch(incident.type?.toLowerCase()) {
      case 'flood': return 'Central District';
      case 'fire': return 'South Area';
      case 'storm': return 'East Coast';
      default: return 'Unknown Location';
    }
  };

  // Get incident name or description
  const getIncidentName = (incident) => {
    if (incident.title) return incident.title;
    if (incident.description) {
      return incident.description.length > 30 
        ? incident.description.substring(0, 30) + '...' 
        : incident.description;
    }
    return `${incident.type || 'Unknown'} Incident`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[#7371FC]"></div>
      </div>
    );
  }

  return (
    <div className="max-w-full mx-auto">
      <div className="flex items-center gap-2 mb-4">
        <Link to="/government/dashboard" className="text-[#7371FC]">
          <ChevronLeft size={16} className="inline" />
        </Link>
        <h1 className="text-lg md:text-xl font-medium">Incident Management</h1>
        <span className="text-xs md:text-sm text-gray-500 ml-2 md:ml-4">Active Incidents: {incidents.length}</span>
      </div>

      {/* Search and Filter */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search incidents..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7371FC]"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        {/* Type Filter Dropdown */}
        <div className="relative">
          <select
            value={selectedType}
            onChange={(e) => handleTypeChange(e.target.value)}
            className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-[#7371FC] min-w-[140px]"
          >
            {incidentTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-6">
          {error}
        </div>
      )}

      {/* Incidents Table/Cards */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        {/* Desktop Table View */}
        <div className="hidden xl:block">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/4">
                  Incident
                </th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/8">
                  Type
                </th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/4">
                  Location
                </th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/8">
                  Status
                </th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/8">
                  Reported
                </th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/8">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {incidents.length > 0 ? (
                incidents.map((incident) => (
                  <tr key={incident._id} className="hover:bg-gray-50">
                    <td className="px-3 py-4">
                      <div className="text-sm font-medium text-gray-900 truncate">
                        {getIncidentName(incident)}
                      </div>
                      <div className="text-xs text-gray-500 truncate">
                        ID: {truncateId(incident._id)}
                      </div>
                    </td>
                    <td className="px-3 py-4 text-sm text-gray-900">
                      <span className="truncate block">{incident.type || 'Unknown'}</span>
                    </td>
                    <td className="px-3 py-4 text-sm text-gray-900">
                      <span className="truncate block">{getLocationName(incident)}</span>
                    </td>
                    <td className="px-3 py-4">
                      <Badge className={getStatusBadgeColor(incident.status)}>
                        {incident.status || 'Pending'}
                      </Badge>
                    </td>
                    <td className="px-3 py-4 text-xs text-gray-500">
                      <span className="truncate block">{formatTimeAgo(incident.createdAt)}</span>
                    </td>
                    <td className="px-3 py-4 text-xs">
                      <div className="flex flex-col space-y-1">
                        <Link
                          to={`/government/incidents/${incident._id}`}
                          className="text-blue-600 hover:text-blue-800 font-medium"
                        >
                          View
                        </Link>
                        <Link
                          to={`/government/incidents/edit/${incident._id}`}
                          className="text-green-600 hover:text-green-800 font-medium"
                        >
                          Edit
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-3 py-8 text-center text-gray-500">
                    No incidents found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Large Tablet Table View (Reduced columns) */}
        <div className="hidden lg:block xl:hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-2/5">
                  Incident
                </th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/5">
                  Type
                </th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/5">
                  Status
                </th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/5">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {incidents.length > 0 ? (
                incidents.map((incident) => (
                  <tr key={incident._id} className="hover:bg-gray-50">
                    <td className="px-3 py-4">
                      <div className="text-sm font-medium text-gray-900 truncate">
                        {getIncidentName(incident)}
                      </div>
                      <div className="text-xs text-gray-500 truncate">
                        {getLocationName(incident)}
                      </div>
                    </td>
                    <td className="px-3 py-4 text-sm text-gray-900">
                      <span className="truncate block">{incident.type || 'Unknown'}</span>
                    </td>
                    <td className="px-3 py-4">
                      <Badge className={getStatusBadgeColor(incident.status)}>
                        {incident.status || 'Pending'}
                      </Badge>
                    </td>
                    <td className="px-3 py-4 text-xs">
                      <div className="flex flex-col space-y-1">
                        <Link
                          to={`/government/incidents/${incident._id}`}
                          className="text-blue-600 hover:text-blue-800 font-medium"
                        >
                          View
                        </Link>
                        <Link
                          to={`/government/incidents/edit/${incident._id}`}
                          className="text-green-600 hover:text-green-800 font-medium"
                        >
                          Edit
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="px-3 py-8 text-center text-gray-500">
                    No incidents found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Medium Tablet Table View (Most essential) */}
        <div className="hidden md:block lg:hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/2">
                  Incident
                </th>
                <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/4">
                  Status
                </th>
                <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/4">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {incidents.length > 0 ? (
                incidents.map((incident) => (
                  <tr key={incident._id} className="hover:bg-gray-50">
                    <td className="px-2 py-4">
                      <div className="text-sm font-medium text-gray-900 truncate">
                        {getIncidentName(incident)}
                      </div>
                      <div className="text-xs text-gray-500 truncate">
                        {incident.type || 'Unknown'} • {getLocationName(incident)}
                      </div>
                    </td>
                    <td className="px-2 py-4">
                      <Badge className={getStatusBadgeColor(incident.status)}>
                        {incident.status || 'Pending'}
                      </Badge>
                    </td>
                    <td className="px-2 py-4 text-xs">
                      <div className="flex flex-col space-y-1">
                        <Link
                          to={`/government/incidents/${incident._id}`}
                          className="text-blue-600 hover:text-blue-800 font-medium"
                        >
                          View
                        </Link>
                        <Link
                          to={`/government/incidents/edit/${incident._id}`}
                          className="text-green-600 hover:text-green-800 font-medium"
                        >
                          Edit
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="px-2 py-8 text-center text-gray-500">
                    No incidents found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Card View */}
        <div className="md:hidden divide-y divide-gray-200">
          {incidents.length > 0 ? (
            incidents.map((incident) => (
              <div key={incident._id} className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-medium text-gray-900 truncate">
                      {getIncidentName(incident)}
                    </h3>
                    <p className="text-xs text-gray-500 mt-1">
                      ID: {truncateId(incident._id)}
                    </p>
                  </div>
                  <Badge className={`${getStatusBadgeColor(incident.status)} ml-2 whitespace-nowrap`}>
                    {incident.status || 'Pending'}
                  </Badge>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-xs text-gray-600 mb-3">
                  <div>
                    <span className="font-medium">Type:</span> {incident.type || 'Unknown'}
                  </div>
                  <div>
                    <span className="font-medium">Location:</span> {getLocationName(incident)}
                  </div>
                  <div className="col-span-2">
                    <span className="font-medium">Reported:</span> {formatTimeAgo(incident.createdAt)}
                  </div>
                </div>
                
                <div className="flex space-x-3">
                  <Link
                    to={`/government/incidents/${incident._id}`}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    View Details
                  </Link>
                  <Link
                    to={`/government/incidents/edit/${incident._id}`}
                    className="text-green-600 hover:text-green-800 text-sm font-medium"
                  >
                    Edit
                  </Link>
                </div>
              </div>
            ))
          ) : (
            <div className="p-8 text-center text-gray-500">
              No incidents found matching your criteria.
            </div>
          )}
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="text-sm text-gray-500">
            Page {currentPage} of {totalPages}
          </div>
          <div className="flex space-x-2">
            <Button
              onClick={goToPreviousPage}
              disabled={currentPage === 1}
              variant="outline"
              size="sm"
              className="flex items-center"
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              Previous
            </Button>
            <Button
              onClick={goToNextPage}
              disabled={currentPage === totalPages}
              variant="outline"
              size="sm"
              className="flex items-center"
            >
              Next
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}