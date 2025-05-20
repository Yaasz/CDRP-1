import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../../utils/api';
import { ArrowLeft, MapPin, Clock, AlertCircle, Save } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';

export default function EditIncident() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [incident, setIncident] = useState(null);
  const [formData, setFormData] = useState({
    type: '',
    title: '',
    description: '',
    status: '',
    location: '',
    dateOccurred: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  // Status options based on the incident schema
  const statusOptions = ["pending", "validated", "assigned", "in progress", "critical", "resolved"];
  
  // Incident type options
  const typeOptions = ["Flood", "Fire", "Earthquake", "Storm", "Other"];

  // Format date for input field
  const formatDateForInput = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toISOString().split('T')[0]; // Format as YYYY-MM-DD
  };

  // Format coordinates as a string
  const formatCoordinates = (location) => {
    if (!location || !location.coordinates) return '';
    // GeoJSON uses [longitude, latitude], but for display we'll use [latitude, longitude]
    const [lng, lat] = location.coordinates;
    return `${lat}, ${lng}`;
  };

  // Parse coordinates from string
  const parseCoordinates = (coordString) => {
    if (!coordString) return null;
    try {
      const [lat, lng] = coordString.split(',').map(coord => parseFloat(coord.trim()));
      if (isNaN(lat) || isNaN(lng)) return null;
      return {
        type: 'Point',
        coordinates: [lng, lat] // GeoJSON uses [longitude, latitude]
      };
    } catch (err) {
      return null;
    }
  };

  // Fetch incident data
  useEffect(() => {
    const fetchIncidentData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await api.get(`/incidents/${id}`);
        
        if (response.data && response.data.data) {
          const fetchedIncident = response.data.data;
          setIncident(fetchedIncident);
          
          // Format location as string for form
          const locationString = formatCoordinates(fetchedIncident.location);
          
          // Set form data
          setFormData({
            type: fetchedIncident.type || '',
            title: fetchedIncident.title || '',
            description: fetchedIncident.description || '',
            status: fetchedIncident.status || 'pending',
            location: locationString,
            dateOccurred: formatDateForInput(fetchedIncident.dateOccurred || fetchedIncident.createdAt),
          });
        } else {
          setError('Failed to load incident data. Please try again.');
        }
      } catch (err) {
        console.error('Error fetching incident details:', err);
        setError('Failed to load incident details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchIncidentData();
  }, [id]);

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      setError(null);
      
      // Prepare data for API
      const updatedData = {
        ...formData,
        location: parseCoordinates(formData.location)
      };
      
      // Remove any undefined or null values
      Object.keys(updatedData).forEach(key => {
        if (updatedData[key] === undefined || updatedData[key] === null) {
          delete updatedData[key];
        }
      });
      
      // Send update request
      const response = await api.put(`/incidents/${id}`, updatedData);
      
      if (response.data && response.data.success) {
        alert('Incident updated successfully!');
        navigate(`/government/incidents/${id}`);
      } else {
        setError('Failed to update incident. Please try again.');
      }
    } catch (err) {
      console.error('Error updating incident:', err);
      setError(`Failed to update incident: ${err.response?.data?.message || err.message}`);
    } finally {
      setSaving(false);
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
    <div className="p-6 max-w-4xl mx-auto">
      {/* Back button */}
      <Link to={`/government/incidents/${id}`} className="inline-flex items-center mb-6 text-[#7371FC] hover:text-[#A594F9]">
        <ArrowLeft size={16} className="mr-1" />
        Back to Incident Details
      </Link>
      
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Edit Incident</h1>
          {incident && (
            <Badge className={`${formData.status === 'critical' ? 'bg-red-100 text-red-600' : 
              formData.status === 'resolved' ? 'bg-green-100 text-green-800' : 
              formData.status === 'assigned' ? 'bg-blue-100 text-blue-800' : 
              'bg-yellow-100 text-yellow-800'}`}>
              {formData.status || 'Unknown'}
            </Badge>
          )}
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Incident Type */}
            <div>
              <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
                Incident Type <span className="text-red-500">*</span>
              </label>
              <select
                id="type"
                name="type"
                value={formData.type}
                onChange={handleChange}
                required
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#7371FC]"
              >
                <option value="">Select Type</option>
                {typeOptions.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
            
            {/* Date Occurred */}
            <div>
              <label htmlFor="dateOccurred" className="block text-sm font-medium text-gray-700 mb-1">
                Date Occurred <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                id="dateOccurred"
                name="dateOccurred"
                value={formData.dateOccurred}
                onChange={handleChange}
                required
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#7371FC]"
              />
            </div>
            
            {/* Title */}
            <div className="md:col-span-2">
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                minLength={4}
                maxLength={100}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#7371FC]"
              />
            </div>
            
            {/* Description */}
            <div className="md:col-span-2">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                minLength={4}
                maxLength={300}
                rows={4}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#7371FC]"
              />
              <p className="text-xs text-gray-500 mt-1">
                {formData.description.length}/300 characters
              </p>
            </div>
            
            {/* Status */}
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                Status <span className="text-red-500">*</span>
              </label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                required
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#7371FC]"
              >
                {statusOptions.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>
            
            {/* Location */}
            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                Location (Latitude, Longitude) <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <MapPin size={16} className="absolute left-3 top-3 text-gray-400" />
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="e.g. 9.0092, 38.7645"
                  required
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#7371FC]"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Format: latitude, longitude
              </p>
            </div>
          </div>
          
          <div className="flex justify-end space-x-3 mt-6">
            <Button
              type="button"
              onClick={() => navigate(`/government/incidents/${id}`)}
              className="bg-gray-100 text-gray-700 hover:bg-gray-200"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={saving}
              className="bg-[#7371FC] hover:bg-[#6260EA] text-white"
            >
              {saving ? (
                <>
                  <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Save size={16} className="mr-1" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
} 