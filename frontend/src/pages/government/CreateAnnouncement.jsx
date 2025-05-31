import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import api from '../../utils/api';
import { ArrowLeft, Users, Check, AlertCircle } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';

export default function CreateAnnouncement() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const incidentId = searchParams.get('incident');
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    incident: incidentId || '',
    charities: []
  });
  const [incident, setIncident] = useState(null);
  const [availableCharities, setAvailableCharities] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // Fetch incident and charities data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch incident details if ID is provided
        if (incidentId) {
          const incidentResponse = await api.get(`/incidents/${incidentId}`);
          if (incidentResponse.data && incidentResponse.data.data) {
            setIncident(incidentResponse.data.data);
          }
        }
        
        // Fetch available charities
        const charitiesResponse = await api.get('/org', {
          params: { 
            role: 'charity', 
            isVerified: true, 
            status: 'active' 
          }
        });
        
        if (charitiesResponse.data && charitiesResponse.data.data) {
          setAvailableCharities(charitiesResponse.data.data);
        } else {
          // Sample charity data if API fails
          setAvailableCharities([
            {
              _id: '1',
              organizationName: 'Red Cross Emergency',
              mission: 'Emergency medical response and disaster relief',
              image: null
            },
            {
              _id: '2',
              organizationName: 'Global Food Bank',
              mission: 'Food distribution and nutrition programs',
              image: null
            },
            {
              _id: '3',
              organizationName: 'Shelter Foundation',
              mission: 'Temporary housing and shelter services',
              image: null
            }
          ]);
        }
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [incidentId]);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle charity selection
  const handleCharitySelect = (charityId) => {
    setFormData(prev => ({
      ...prev,
      charities: prev.charities.includes(charityId)
        ? prev.charities.filter(id => id !== charityId)
        : [...prev.charities, charityId]
    }));
  };

  // Handle select all/none
  const handleSelectAll = () => {
    const allSelected = formData.charities.length === availableCharities.length;
    if (allSelected) {
      setFormData(prev => ({ ...prev, charities: [] }));
      setSelectAll(false);
    } else {
      setFormData(prev => ({ 
        ...prev, 
        charities: availableCharities.map(charity => charity._id) 
      }));
      setSelectAll(true);
    }
  };

  // Update selectAll state when charities change
  useEffect(() => {
    setSelectAll(formData.charities.length === availableCharities.length && availableCharities.length > 0);
  }, [formData.charities, availableCharities]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.description.trim()) {
      setError('Title and description are required');
      return;
    }
    
    if (!formData.incident) {
      setError('Incident ID is required');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);
      
      const payload = {
        incident: formData.incident,
        title: formData.title.trim(),
        description: formData.description.trim(),
        charities: formData.charities // Empty array means all charities
      };
      
      const response = await api.post('/announcement', payload);
      
      if (response.data && response.data.success) {
        // Navigate back to incident detail or announcements list
        navigate(`/government/incidents/${formData.incident}`);
      } else {
        setError('Failed to create announcement. Please try again.');
      }
    } catch (err) {
      console.error('Error creating announcement:', err);
      setError(err.response?.data?.message || 'Failed to create announcement. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[#7371FC]"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Back button */}
      <Link 
        to={incidentId ? `/government/incidents/${incidentId}` : '/government/incidents'} 
        className="inline-flex items-center mb-6 text-[#7371FC] hover:text-[#A594F9]"
      >
        <ArrowLeft size={16} className="mr-1" />
        Back to {incidentId ? 'Incident Details' : 'Incidents'}
      </Link>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Create Announcement</h1>
          <p className="text-gray-600 mt-2">
            Create an announcement to notify selected charities about this incident
          </p>
        </div>

        {/* Incident Info */}
        {incident && (
          <div className="mb-6 p-4 bg-blue-50 rounded-lg">
            <h3 className="font-medium text-blue-800 mb-2">Related Incident</h3>
            <p className="text-blue-700 font-medium">{incident.title}</p>
            <p className="text-blue-600 text-sm mt-1">{incident.type} • {incident.status}</p>
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center">
            <AlertCircle className="text-red-500 mr-2" size={20} />
            <span className="text-red-700">{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Announcement Title *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7371FC]"
              placeholder="Enter announcement title..."
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={4}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7371FC]"
              placeholder="Enter detailed description of the announcement..."
              required
            />
          </div>

          {/* Charity Selection */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Select Charities
              </label>
              <Button
                type="button"
                onClick={handleSelectAll}
                className="bg-gray-100 text-gray-700 hover:bg-gray-200 text-sm"
              >
                {formData.charities.length === availableCharities.length && availableCharities.length > 0 ? 'Deselect All' : 'Select All'}
              </Button>
            </div>
            
            <div className="text-sm text-gray-600 mb-4">
              {formData.charities.length === 0 
                ? 'No charities selected (announcement will be sent to all active charities)'
                : `${formData.charities.length} ${formData.charities.length === 1 ? 'charity' : 'charities'} selected`
              }
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-80 overflow-y-auto border border-gray-200 rounded-lg p-4">
              {availableCharities.map((charity) => (
                <div
                  key={charity._id}
                  className={`p-4 border rounded-lg cursor-pointer transition-all ${
                    formData.charities.includes(charity._id)
                      ? 'border-[#7371FC] bg-[#7371FC]/5'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => handleCharitySelect(charity._id)}
                >
                  <div className="flex items-start">
                    <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 mr-3 flex-shrink-0">
                      {charity.image ? (
                        <img 
                          src={charity.image} 
                          alt={charity.organizationName}
                          className="h-8 w-8 rounded-full object-cover"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = 'https://placehold.co/40?text=Logo';
                          }}
                        />
                      ) : (
                        <Users size={16} />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-medium text-gray-900 text-sm truncate">
                        {charity.organizationName}
                      </h3>
                      <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                        {charity.mission || 'No description available'}
                      </p>
                    </div>
                    {formData.charities.includes(charity._id) && (
                      <Check size={16} className="text-[#7371FC] ml-2 flex-shrink-0" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex justify-end space-x-3 pt-6">
            <Button
              type="button"
              onClick={() => navigate(-1)}
              className="bg-gray-100 text-gray-700 hover:bg-gray-200"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={submitting}
              className="bg-[#7371FC] hover:bg-[#6260EA] text-white flex items-center"
            >
              {submitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                  Creating...
                </>
              ) : (
                'Create Announcement'
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
} 