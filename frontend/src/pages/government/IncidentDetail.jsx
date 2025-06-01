import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../../utils/api';
import { ArrowLeft, MapPin, Clock, User, AlertCircle, Check, X, FileText, Megaphone } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';

export default function GovernmentIncidentDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [incident, setIncident] = useState(null);
  const [incidentImages, setIncidentImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Fetch incident data
  useEffect(() => {
    const fetchIncidentData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch incident details from API
        const incidentResponse = await api.get(`/incidents/${id}`);
        
        if (incidentResponse.data && incidentResponse.data.data) {
          setIncident(incidentResponse.data.data);
          
          // Fetch incident images
          try {
            const imagesResponse = await api.get(`/incidents/images/${id}`);
            if (imagesResponse.data && imagesResponse.data.data) {
              setIncidentImages(imagesResponse.data.data);
            }
          } catch (imgError) {
            console.error('Error fetching incident images:', imgError);
          }
          
        } else {
          // If API call fails, use sample data
          const sampleIncident = {
            _id: id || 'INC001',
            type: 'Flood',
            title: 'Major Flooding in Central District',
            description: 'Severe flooding has affected residential areas. Multiple families displaced and in need of immediate assistance.',
            location: { 
              type: 'Point',
              coordinates: [38.7645, 9.0092] // Addis Ababa
            },
            status: 'validated',
            createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
            reports: [],
            reportCount: 12,
            affectedArea: '2.5 km²',
            peopleAffected: 150
          };
          setIncident(sampleIncident);
          
          // Sample images
          setIncidentImages([
            { url: 'https://placehold.co/300x200?text=Incident+Image+1' },
            { url: 'https://placehold.co/300x200?text=Incident+Image+2' },
            { url: 'https://placehold.co/300x200?text=Incident+Image+3' }
          ]);
        }
      } catch (err) {
        console.error('Error fetching incident details:', err);
        setError('Failed to load incident details. Please try again later.');
        
        // Set sample data in case of error
        const sampleIncident = {
          _id: id || 'INC001',
          type: 'Flood',
          title: 'Major Flooding in Central District',
          description: 'Severe flooding has affected residential areas. Multiple families displaced and in need of immediate assistance.',
          location: { 
            type: 'Point',
            coordinates: [38.7645, 9.0092] // Addis Ababa
          },
          status: 'validated',
          createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
          reports: [],
          reportCount: 12,
          affectedArea: '2.5 km²',
          peopleAffected: 150
        };
        setIncident(sampleIncident);
      } finally {
        setLoading(false);
      }
    };

    fetchIncidentData();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[#7371FC]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="bg-red-50 text-red-700 p-4 rounded-lg">
          {error}
          <Button
            onClick={() => window.location.reload()}
            className="mt-2 bg-red-600 hover:bg-red-700 text-white"
          >
            Retry
          </Button>
        </div>
      </div>
    );
  }

  // Extract location information from the incident
  const locationName = incident.location?.name || 'Unknown Location';
  const coordinates = incident.location?.coordinates || [0, 0];
  
  // Create updates from reports if available
  const updates = incident.reports?.map(report => ({
    title: report.title || 'Report Update',
    description: report.description || 'No description provided',
    timestamp: report.createdAt || new Date()
  })) || [];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Back button */}
      <Link to="/government/incidents" className="inline-flex items-center mb-6 text-[#7371FC] hover:text-[#A594F9]">
        <ArrowLeft size={16} className="mr-1" />
        Back to Incidents
      </Link>
      
      <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
        {/* Incident Details */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{incident.title}</h1>
                <div className="flex items-center mt-2 text-gray-500">
                  <MapPin size={16} className="mr-1" />
                  <span>{locationName}</span>
                  <span className="mx-2">•</span>
                  <Clock size={16} className="mr-1" />
                  <span>{formatDate(incident.createdAt)}</span>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Link to={`/government/incidents/edit/${incident._id}`}>
                  <Button className="bg-gray-100 text-gray-700 hover:bg-gray-200">
                    Edit Incident
                  </Button>
                </Link>
                <Badge className={getStatusBadgeColor(incident.status)}>
                  {incident.status || 'Unknown'}
                </Badge>
              </div>
            </div>
            
            {/* Action Buttons for Validated Incidents */}
            {incident.status?.toLowerCase() === 'validated' && (
              <div className="mb-6 flex flex-col sm:flex-row gap-3">
                <Link to={`/government/news/create?incident=${incident._id}`}>
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white flex items-center">
                    <FileText size={16} className="mr-2" />
                    Create News
                  </Button>
                </Link>
                <Link to={`/government/announcements/create?incident=${incident._id}`}>
                  <Button className="bg-green-600 hover:bg-green-700 text-white flex items-center">
                    <Megaphone size={16} className="mr-2" />
                    Create Announcement
                  </Button>
                </Link>
              </div>
            )}
            
            <div className="text-gray-600 mb-6">
              <p>{incident.description}</p>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-gray-50 p-3 rounded-md">
                <p className="text-sm text-gray-500">Incident Type</p>
                <p className="font-medium">{incident.type}</p>
              </div>
              <div className="bg-gray-50 p-3 rounded-md">
                <p className="text-sm text-gray-500">Report Count</p>
                <p className="font-medium">{incident.reports?.length || 0}</p>
              </div>
              <div className="bg-gray-50 p-3 rounded-md">
                <p className="text-sm text-gray-500">Affected Area</p>
                <p className="font-medium">{incident.affectedArea || 'Unknown'}</p>
              </div>
              <div className="bg-gray-50 p-3 rounded-md">
                <p className="text-sm text-gray-500">People Affected</p>
                <p className="font-medium">{incident.peopleAffected || 'Unknown'}</p>
              </div>
            </div>
            
            {/* Images Gallery */}
            {incidentImages && incidentImages.length > 0 && (
              <div className="mb-6">
                <h2 className="text-lg font-semibold mb-3">Incident Images</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {incidentImages.map((image, index) => (
                    <div key={index} className="relative overflow-hidden rounded-md h-40 bg-gray-100">
                      <img 
                        src={image.url} 
                        alt={`Incident ${index + 1}`} 
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'https://placehold.co/300x200?text=Image+Not+Available';
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Map Placeholder */}
            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-3">Location</h2>
              <div className="bg-gray-100 h-80 rounded-md flex items-center justify-center">
                {/* In a real implementation, this would be an actual map component */}
                <div className="text-center text-gray-500">
                  <MapPin size={24} className="mx-auto mb-2" />
                  <p>Map showing location at {locationName}</p>
                  <p className="text-sm">Coordinates: {coordinates[0]}, {coordinates[1]}</p>
                </div>
              </div>
            </div>
            
            {/* Incident Timeline */}
            {updates.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold mb-3">Incident Timeline</h2>
                <div className="space-y-4">
                  {updates.map((update, index) => (
                    <div key={index} className="relative pl-6 pb-4 border-l-2 border-gray-200">
                      <div className="absolute -left-1.5 mt-1.5 w-3 h-3 rounded-full bg-[#7371FC]"></div>
                      <h3 className="font-medium text-gray-900">{update.title}</h3>
                      <p className="text-sm text-gray-500 mb-1">{formatDate(update.timestamp)}</p>
                      <p className="text-gray-600">{update.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 