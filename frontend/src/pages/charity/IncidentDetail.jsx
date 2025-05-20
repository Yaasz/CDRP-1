import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../../utils/api';
import { ArrowLeft, MapPin, Clock, User, AlertCircle, Check, X, ThumbsUp, ThumbsDown } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';

export default function CharityIncidentDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [incident, setIncident] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAcceptModal, setShowAcceptModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [response, setResponse] = useState('');

  // Get status badge color based on status
  const getStatusBadgeColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'in progress':
        return 'bg-yellow-100 text-yellow-800';
      case 'critical':
        return 'bg-red-100 text-red-600';
      case 'resolved':
        return 'bg-green-100 text-green-800';
      case 'assigned':
        return 'bg-blue-100 text-blue-800';
      case 'pending':
        return 'bg-purple-100 text-purple-800';
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
        const incidentResponse = await api.get(`/incidents/${id}`).catch(() => ({ data: null }));
        
        // If API call fails, use sample data
        const sampleIncident = {
          id: id || 'INC-001',
          type: 'Flood',
          title: 'Major Flooding in Central District',
          description: 'Severe flooding has affected residential areas. Multiple families displaced and in need of immediate assistance.',
          location: 'Central District',
          coordinates: [9.0092, 38.7645], // Addis Ababa
          status: 'Assigned',
          assignedAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
          priorityLevel: 'High',
          assignmentNotes: 'Please respond as quickly as possible. Shelter and food supplies are needed urgently.',
          reportedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
          reportCount: 12,
          affectedArea: '2.5 km²',
          peopleAffected: 150,
          images: [
            '/images/flood1.jpg',
            '/images/flood2.jpg',
            '/images/flood3.jpg',
          ],
          updates: [
            {
              title: 'Emergency Response Deployed',
              description: 'First responders arrived at the scene. Initial assessment completed.',
              timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000)
            },
            {
              title: 'Evacuation in Progress',
              description: 'Residents being moved to emergency shelters. 50 people evacuated so far.',
              timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000)
            }
          ]
        };
        
        // Use API data if available, otherwise use sample data
        const incidentData = incidentResponse?.data?.data || sampleIncident;
        setIncident(incidentData);
      } catch (err) {
        console.error('Error fetching incident details:', err);
        setError('Failed to load incident details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchIncidentData();
  }, [id]);

  // Handle accept incident
  const handleAcceptIncident = async () => {
    try {
      // In a real implementation, this would call the API to accept the incident
      // await api.post(`/incidents/${id}/accept`, {
      //   response: response
      // });
      
      // For now, just show success and navigate back
      alert('Incident accepted successfully!');
      setShowAcceptModal(false);
      navigate('/charity/incidents');
    } catch (err) {
      console.error('Error accepting incident:', err);
      alert('Failed to accept incident. Please try again.');
    }
  };

  // Handle reject incident
  const handleRejectIncident = async () => {
    try {
      // In a real implementation, this would call the API to reject the incident
      // await api.post(`/incidents/${id}/reject`, {
      //   response: response
      // });
      
      // For now, just show success and navigate back
      alert('Incident rejected successfully!');
      setShowRejectModal(false);
      navigate('/charity/incidents');
    } catch (err) {
      console.error('Error rejecting incident:', err);
      alert('Failed to reject incident. Please try again.');
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

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Back button */}
      <Link to="/charity/incidents" className="inline-flex items-center mb-6 text-[#7371FC] hover:text-[#A594F9]">
        <ArrowLeft size={16} className="mr-1" />
        Back to Incidents
      </Link>
      
      {/* Assignment Banner */}
      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 mb-6">
        <div className="flex items-start">
          <AlertCircle className="text-blue-500 mr-3 mt-1" size={20} />
          <div className="flex-1">
            <h3 className="font-medium text-blue-700">New Incident Assignment</h3>
            <p className="text-blue-600 text-sm mt-1">
              This incident has been assigned to your organization by the government.
              Please review the details and respond by accepting or rejecting the assignment.
            </p>
          </div>
          <div className="flex space-x-2">
            <Button 
              onClick={() => setShowAcceptModal(true)} 
              className="bg-green-600 hover:bg-green-700 text-white flex items-center"
            >
              <ThumbsUp size={16} className="mr-1" />
              Accept
            </Button>
            <Button 
              onClick={() => setShowRejectModal(true)} 
              className="bg-red-600 hover:bg-red-700 text-white flex items-center"
            >
              <ThumbsDown size={16} className="mr-1" />
              Reject
            </Button>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Incident Details */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{incident.title}</h1>
                <div className="flex items-center mt-2 text-gray-500">
                  <MapPin size={16} className="mr-1" />
                  <span>{incident.location}</span>
                  <span className="mx-2">•</span>
                  <Clock size={16} className="mr-1" />
                  <span>{formatDate(incident.reportedAt)}</span>
                </div>
              </div>
              <Badge className={getStatusBadgeColor(incident.status)}>
                {incident.status}
              </Badge>
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
                <p className="text-sm text-gray-500">Priority Level</p>
                <p className="font-medium">{incident.priorityLevel || 'Medium'}</p>
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
            
            {/* Assignment Details */}
            <div className="bg-blue-50 p-4 rounded-md mb-6">
              <h2 className="text-lg font-semibold text-blue-800 mb-2">Assignment Details</h2>
              <div className="text-blue-700 mb-2">
                <span className="font-medium">Assigned at:</span> {formatDate(incident.assignedAt)}
              </div>
              <div className="text-blue-700">
                <span className="font-medium">Notes from Government:</span>
                <p className="mt-1">{incident.assignmentNotes || 'No specific instructions provided.'}</p>
              </div>
            </div>
            
            {/* Images Gallery */}
            {incident.images && incident.images.length > 0 && (
              <div className="mb-6">
                <h2 className="text-lg font-semibold mb-3">Incident Images</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {incident.images.map((image, index) => (
                    <div key={index} className="relative overflow-hidden rounded-md h-40 bg-gray-100">
                      <img 
                        src={image} 
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
                  <p>Map showing location at {incident.location}</p>
                  <p className="text-sm">Coordinates: {incident.coordinates?.[0]}, {incident.coordinates?.[1]}</p>
                </div>
              </div>
            </div>
            
            {/* Incident Timeline */}
            {incident.updates && incident.updates.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold mb-3">Incident Timeline</h2>
                <div className="space-y-4">
                  {incident.updates.map((update, index) => (
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
        
        {/* Required Resources */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-xl font-semibold mb-4">Required Resources</h2>
            <p className="text-gray-500 mb-6">
              Based on the incident details, the following resources may be needed:
            </p>
            
            <div className="space-y-4">
              <div className="p-3 border border-gray-200 rounded-lg">
                <div className="flex items-center mb-2">
                  <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mr-3">
                    <span className="font-bold">S</span>
                  </div>
                  <h3 className="font-medium">Shelter</h3>
                </div>
                <p className="text-sm text-gray-600">
                  Emergency accommodation for approximately {incident.peopleAffected || 50} people
                </p>
              </div>
              
              <div className="p-3 border border-gray-200 rounded-lg">
                <div className="flex items-center mb-2">
                  <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center text-green-600 mr-3">
                    <span className="font-bold">F</span>
                  </div>
                  <h3 className="font-medium">Food & Water</h3>
                </div>
                <p className="text-sm text-gray-600">
                  Food and clean water supplies for {incident.peopleAffected || 50} people for at least 3 days
                </p>
              </div>
              
              <div className="p-3 border border-gray-200 rounded-lg">
                <div className="flex items-center mb-2">
                  <div className="h-8 w-8 rounded-full bg-red-100 flex items-center justify-center text-red-600 mr-3">
                    <span className="font-bold">M</span>
                  </div>
                  <h3 className="font-medium">Medical Supplies</h3>
                </div>
                <p className="text-sm text-gray-600">
                  First aid kits, medications, and basic medical equipment
                </p>
              </div>
              
              <div className="p-3 border border-gray-200 rounded-lg">
                <div className="flex items-center mb-2">
                  <div className="h-8 w-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 mr-3">
                    <span className="font-bold">V</span>
                  </div>
                  <h3 className="font-medium">Volunteers</h3>
                </div>
                <p className="text-sm text-gray-600">
                  Approximately 20-30 volunteers for rescue and relief operations
                </p>
              </div>
            </div>
            
            <div className="mt-6 space-y-2">
              <Button 
                onClick={() => setShowAcceptModal(true)} 
                className="w-full bg-[#7371FC] hover:bg-[#6260EA] text-white flex items-center justify-center"
              >
                <ThumbsUp size={16} className="mr-1" />
                Accept Incident
              </Button>
              <Button 
                onClick={() => setShowRejectModal(true)} 
                className="w-full bg-white border border-red-500 text-red-500 hover:bg-red-50 flex items-center justify-center"
              >
                <ThumbsDown size={16} className="mr-1" />
                Reject Incident
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Accept Modal */}
      {showAcceptModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-xl font-semibold text-green-700">Accept Incident</h2>
              <button onClick={() => setShowAcceptModal(false)} className="text-gray-500 hover:text-gray-700">
                <X size={20} />
              </button>
            </div>
            
            <div className="mb-6">
              <p className="text-gray-700 mb-4">
                You are about to accept responsibility for this incident. Your organization will be expected to provide assistance as needed.
              </p>
              
              <label className="block text-sm font-medium text-gray-700 mb-2">Response (Optional)</label>
              <textarea
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 min-h-[100px]"
                placeholder="Add details about how your organization will respond..."
                value={response}
                onChange={(e) => setResponse(e.target.value)}
              />
            </div>
            
            <div className="flex justify-end space-x-3">
              <Button 
                onClick={() => setShowAcceptModal(false)} 
                className="bg-gray-100 text-gray-700 hover:bg-gray-200"
              >
                Cancel
              </Button>
              <Button 
                onClick={handleAcceptIncident} 
                className="bg-green-600 hover:bg-green-700 text-white flex items-center"
              >
                <Check size={16} className="mr-1" />
                Confirm Acceptance
              </Button>
            </div>
          </div>
        </div>
      )}
      
      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-xl font-semibold text-red-700">Reject Incident</h2>
              <button onClick={() => setShowRejectModal(false)} className="text-gray-500 hover:text-gray-700">
                <X size={20} />
              </button>
            </div>
            
            <div className="mb-6">
              <p className="text-gray-700 mb-4">
                Please provide a reason for rejecting this incident. This information will be sent to the government agency.
              </p>
              
              <label className="block text-sm font-medium text-gray-700 mb-2">Reason for Rejection <span className="text-red-500">*</span></label>
              <textarea
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 min-h-[100px]"
                placeholder="Explain why your organization cannot assist with this incident..."
                value={response}
                onChange={(e) => setResponse(e.target.value)}
                required
              />
            </div>
            
            <div className="flex justify-end space-x-3">
              <Button 
                onClick={() => setShowRejectModal(false)} 
                className="bg-gray-100 text-gray-700 hover:bg-gray-200"
              >
                Cancel
              </Button>
              <Button 
                onClick={handleRejectIncident} 
                className="bg-red-600 hover:bg-red-700 text-white flex items-center"
                disabled={!response.trim()}
              >
                <X size={16} className="mr-1" />
                Confirm Rejection
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 