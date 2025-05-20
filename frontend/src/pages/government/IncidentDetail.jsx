import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../../utils/api';
import { ArrowLeft, MapPin, Clock, User, AlertCircle, Check, X } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';

export default function GovernmentIncidentDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [incident, setIncident] = useState(null);
  const [incidentImages, setIncidentImages] = useState([]);
  const [charities, setCharities] = useState([]);
  const [selectedCharity, setSelectedCharity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [assignmentNotes, setAssignmentNotes] = useState('');
  const [priorityLevel, setPriorityLevel] = useState('medium');
  const [showAssignmentModal, setShowAssignmentModal] = useState(false);

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
            status: 'pending',
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
        
        // Fetch available charities from API
        const charitiesResponse = await api.get('/org', {
          params: { 
            role: 'charity', 
            isVerified: true, 
            status: 'active' 
          }
        });
        
        if (charitiesResponse.data && charitiesResponse.data.data) {
          // Format charity data to match the component expectations
          const formattedCharities = charitiesResponse.data.data.map(charity => ({
            id: charity._id,
            name: charity.organizationName,
            description: charity.mission || 'No description provided',
            logo: charity.image,
            available: true, // Assume all returned charities are available
            areasOfOperation: []
          }));
          setCharities(formattedCharities);
        } else {
          // Sample charity data if API fails
          const sampleCharities = [
            {
              id: 'charity-001',
              name: 'Global Relief Foundation',
              description: 'International disaster response',
              logo: 'https://placehold.co/40?text=GRF',
              areasOfOperation: ['Disaster Response', 'Medical Aid', 'Food Security'],
              available: true
            },
            {
              id: 'charity-002',
              name: 'Education First',
              description: 'Educational support worldwide',
              logo: 'https://placehold.co/40?text=EF',
              areasOfOperation: ['Education', 'Child Welfare'],
              available: true
            }
          ];
          setCharities(sampleCharities);
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
          status: 'pending',
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

  // Handle charity selection
  const handleCharitySelect = (charity) => {
    setSelectedCharity(charity);
    setShowAssignmentModal(true);
  };

  // Handle incident assignment to charity
  const handleAssignIncident = async () => {
    try {
      // Call the API to assign the incident
      await api.post(`/incidents/${id}/assign`, {
        organizationId: selectedCharity.id,
        notes: assignmentNotes,
        priorityLevel
      });
      
      setShowAssignmentModal(false);
      
      // Show a success message
      alert(`Incident successfully assigned to ${selectedCharity.name}!`);
      
      // Navigate back to incidents list
      navigate('/government/incidents');
    } catch (err) {
      console.error('Error assigning incident:', err);
      alert('Failed to assign incident. Please try again: ' + (err.response?.data?.message || err.message));
    }
  };

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
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Incident Details */}
        <div className="lg:col-span-2 space-y-6">
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
        
        {/* Charity Assignment */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-xl font-semibold mb-4">Assign to Charity</h2>
            <p className="text-gray-500 mb-6">
              Select a charity organization to respond to this incident
            </p>
            
            <div className="space-y-4">
              {charities.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No available charities found.
                </div>
              ) : (
                charities.map((charity) => (
                  <div 
                    key={charity.id} 
                    className={`p-4 border rounded-lg transition-all ${
                      charity.available 
                        ? 'border-gray-200 hover:border-[#7371FC] cursor-pointer' 
                        : 'border-gray-200 opacity-60 cursor-not-allowed'
                    }`}
                    onClick={() => charity.available && handleCharitySelect(charity)}
                  >
                    <div className="flex items-center">
                      <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 mr-4">
                        {/* Placeholder for organization logo */}
                        {charity.logo ? (
                          <img 
                            src={charity.logo} 
                            alt={charity.name}
                            className="h-10 w-10 rounded-full object-cover"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = 'https://placehold.co/40?text=Logo';
                            }}
                          />
                        ) : (
                          <User size={20} />
                        )}
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">{charity.name}</h3>
                        <p className="text-sm text-gray-500">{charity.description}</p>
                      </div>
                    </div>
                    
                    {/* Areas of operation */}
                    {charity.areasOfOperation && charity.areasOfOperation.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-2">
                        {charity.areasOfOperation.map((area, index) => (
                          <span key={index} className="inline-block px-2 py-1 bg-gray-100 rounded-md text-xs text-gray-700">
                            {area}
                          </span>
                        ))}
                      </div>
                    )}
                    
                    {/* Availability badge */}
                    <div className="mt-3 flex justify-end">
                      <Badge className={charity.available ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                        {charity.available ? 'Available' : 'Assigned'}
                      </Badge>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Assignment Modal */}
      {showAssignmentModal && selectedCharity && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-25 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 border border-gray-200">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-xl font-semibold">Assign Incident</h2>
              <button onClick={() => setShowAssignmentModal(false)} className="text-gray-500 hover:text-gray-700 focus:outline-none">
                <X size={20} />
              </button>
            </div>
            
            <div className="mb-4">
              <p className="font-medium text-gray-700">
                Assign <span className="text-[#7371FC]">{incident.title}</span> to:
              </p>
              <div className="flex items-center mt-2 p-3 bg-gray-50 rounded-md">
                <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 mr-3">
                  {selectedCharity.logo ? (
                    <img 
                      src={selectedCharity.logo} 
                      alt={selectedCharity.name}
                      className="h-8 w-8 rounded-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://placehold.co/40?text=Logo';
                      }}
                    />
                  ) : (
                    <User size={16} />
                  )}
                </div>
                <div>
                  <h3 className="font-medium">{selectedCharity.name}</h3>
                  <p className="text-sm text-gray-500">{selectedCharity.description}</p>
                </div>
              </div>
            </div>
            
            {/* Priority Selection */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Priority Level</label>
              <div className="flex space-x-4">
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    className="form-radio text-[#7371FC]"
                    name="priority"
                    value="high"
                    checked={priorityLevel === 'high'}
                    onChange={() => setPriorityLevel('high')}
                  />
                  <span className="ml-2">High</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    className="form-radio text-[#7371FC]"
                    name="priority"
                    value="medium"
                    checked={priorityLevel === 'medium'}
                    onChange={() => setPriorityLevel('medium')}
                  />
                  <span className="ml-2">Medium</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    className="form-radio text-[#7371FC]"
                    name="priority"
                    value="low"
                    checked={priorityLevel === 'low'}
                    onChange={() => setPriorityLevel('low')}
                  />
                  <span className="ml-2">Low</span>
                </label>
              </div>
            </div>
            
            {/* Notes Field */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Assignment Notes</label>
              <textarea
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#7371FC] min-h-[100px]"
                placeholder="Add any specific instructions or notes..."
                value={assignmentNotes}
                onChange={(e) => setAssignmentNotes(e.target.value)}
              />
            </div>
            
            <div className="flex justify-end space-x-3">
              <Button 
                onClick={() => setShowAssignmentModal(false)} 
                className="bg-gray-100 text-gray-700 hover:bg-gray-200"
              >
                Cancel
              </Button>
              <Button 
                onClick={handleAssignIncident} 
                className="bg-[#7371FC] hover:bg-[#6260EA] text-white flex items-center"
              >
                <Check size={16} className="mr-1" />
                Assign
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 