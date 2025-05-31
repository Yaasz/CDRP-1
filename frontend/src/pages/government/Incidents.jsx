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
        <h1 className="text-xl font-medium">Incident Management</h1>
        <span className="text-sm text-gray-500 ml-4">Active Incidents: {incidents.length}</span>
      </div>

      {/* Search and Filter */}
      <div className="mb-6 flex space-between">
        <div className="relative w-[60%]">
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search incidents..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7371FC]"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch(e)}
          />
        </div>
        
        <div className="inline-flex h-10 items-center justify-center rounded-md border border-gray-200 bg-white p-1 text-sm ml-auto">
          <span className="px-2 text-sm text-gray-500">All Types</span>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-6">
          {error}
          <Button
            onClick={() => window.location.reload()}
            className="mt-2 bg-red-600 hover:bg-red-700 text-white"
          >
            Retry
          </Button>
        </div>
      )}

      {/* Incidents Table */}
      <div className="w-full">
        <div className="bg-white overflow-hidden shadow-sm rounded-lg border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Incident</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reported</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {incidents.map((incident) => (
                <tr 
                  key={incident._id} 
                  className="hover:bg-gray-50 cursor-pointer"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{getIncidentName(incident)}</div>
                    <div className="text-xs text-gray-500">{truncateId(incident._id)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{incident.type}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{getLocationName(incident)}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge className={getStatusBadgeColor(incident.status)}>
                      {incident.status || 'Unknown'}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatTimeAgo(incident.createdAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      {/* <Link to={`/government/incidents/edit/${incident._id}`}>
                        <Button className="bg-gray-100 text-gray-700 hover:bg-gray-200 text-xs px-2 py-1">
                          Edit
                        </Button>
                      </Link> */}
                      
                      {incident.status === 'assigned' || incident.status === 'resolved' ? (
                        <Button 
                          disabled 
                          className="bg-gray-300 text-gray-600 cursor-not-allowed"
                        >
                          {incident.status === 'assigned' ? 'Assigned' : 'Resolved'}
                        </Button>
                      ) : (
                        <Link to={`/government/incidents/${incident._id}`}>
                          <Button className="bg-black text-white hover:bg-gray-800">
                            Assign Incident
                          </Button>
                        </Link>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between mt-6">
          <p className="text-sm text-gray-500">
            Showing page {currentPage} of {totalPages}
          </p>
          <div className="flex items-center space-x-2">
            <Button 
              onClick={goToPreviousPage} 
              disabled={currentPage === 1} 
              className="p-2 border border-gray-300 rounded-md disabled:opacity-50"
              variant="outline"
            >
              <ChevronLeft size={16} />
            </Button>
            <span className="text-sm">{currentPage}</span>
            <Button 
              onClick={goToNextPage} 
              disabled={currentPage >= totalPages} 
              className="p-2 border border-gray-300 rounded-md disabled:opacity-50"
              variant="outline"
            >
              <ChevronRight size={16} />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}