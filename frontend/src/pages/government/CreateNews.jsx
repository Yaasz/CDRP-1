import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import api from '../../utils/api';
import { ArrowLeft, Upload, X, Check, AlertCircle, FileImage, Plus } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';

export default function CreateNews() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const incidentId = searchParams.get('incident');
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    incident: incidentId || '',
    category: 'Update'
  });
  const [incident, setIncident] = useState(null);
  const [incidentImages, setIncidentImages] = useState([]);
  const [selectedIncidentImages, setSelectedIncidentImages] = useState([]);
  const [uploadedImages, setUploadedImages] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [showUploadOption, setShowUploadOption] = useState(false);

  const categories = [
    { value: 'Emergency', label: 'Emergency' },
    { value: 'Update', label: 'Update' },
    { value: 'Advisory', label: 'Advisory' },
    { value: 'Notice', label: 'Notice' },
  ];

  // Fetch incident and images data
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
            
            // Pre-fill title based on incident
            const incidentTitle = incidentResponse.data.data.title || 
              `${incidentResponse.data.data.type} Incident Update`;
            setFormData(prev => ({
              ...prev,
              title: `News: ${incidentTitle}`
            }));
          }
          
          // Fetch incident images
          try {
            const imagesResponse = await api.get(`/incidents/images/${incidentId}`);
            if (imagesResponse.data && imagesResponse.data.data && imagesResponse.data.data.length > 0) {
              setIncidentImages(imagesResponse.data.data);
            } else {
              // No incident images found, show upload option by default
              setShowUploadOption(true);
            }
          } catch (imgError) {
            console.error('Error fetching incident images:', imgError);
            // If no images found, show upload option by default
            setShowUploadOption(true);
          }
        }
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load incident data. Please try again.');
        // Show upload option as fallback
        setShowUploadOption(true);
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

  // Handle incident image selection
  const handleIncidentImageSelect = (image) => {
    setSelectedIncidentImages(prev => {
      const isSelected = prev.some(img => img.url === image.url);
      if (isSelected) {
        return prev.filter(img => img.url !== image.url);
      } else {
        return [...prev, image];
      }
    });
  };

  // Handle file upload
  const handleFileUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    try {
      setUploading(true);
      const uploadPromises = files.map(async (file) => {
        const formData = new FormData();
        formData.append('image', file);
        
        const response = await api.post('/upload', formData);
        if (response.data && response.data.url) {
          return {
            url: response.data.url,
            cloudinaryId: response.data.cloudinaryId
          };
        }
        return null;
      });

      const uploadedImageData = await Promise.all(uploadPromises);
      const validImages = uploadedImageData.filter(img => img !== null);
      
      setUploadedImages(prev => [...prev, ...validImages]);
    } catch (err) {
      console.error('Error uploading images:', err);
      setError('Failed to upload images. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  // Remove uploaded image
  const removeUploadedImage = (imageToRemove) => {
    setUploadedImages(prev => 
      prev.filter(img => img.url !== imageToRemove.url)
    );
  };

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

    const allSelectedImages = [...selectedIncidentImages, ...uploadedImages];
    if (allSelectedImages.length === 0) {
      if (incidentImages.length === 0) {
        setError('Please upload at least one image for this news post');
      } else {
        setError('Please select at least one image from the incident or upload new images');
      }
      return;
    }

    try {
      setSubmitting(true);
      setError(null);
      
      const newsData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        incident: formData.incident,
        category: formData.category,
        images: JSON.stringify(allSelectedImages)
      };
      
      const response = await api.post('/news', newsData);
      
      if (response.data && response.data.success) {
        navigate(`/government/incidents/${formData.incident}`);
      } else {
        setError('Failed to create news post. Please try again.');
      }
    } catch (err) {
      console.error('Error creating news:', err);
      setError(err.response?.data?.message || 'Failed to create news post. Please try again.');
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
        to={incidentId ? `/government/incidents/${incidentId}` : '/government/news'} 
        className="inline-flex items-center mb-6 text-[#7371FC] hover:text-[#A594F9]"
      >
        <ArrowLeft size={16} className="mr-1" />
        Back to {incidentId ? 'Incident Details' : 'News'}
      </Link>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Create News Post</h1>
          <p className="text-gray-600 mt-2">
            Create a news post about this incident for public information
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
              News Title *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7371FC]"
              placeholder="Enter news title..."
              required
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7371FC]"
            >
              {categories.map(cat => (
                <option key={cat.value} value={cat.value}>{cat.label}</option>
              ))}
            </select>
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
              placeholder="Enter detailed description..."
              required
            />
          </div>

          {/* Image Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-4">
              Select Images *
            </label>
            
            {/* Incident Images */}
            {incidentImages.length > 0 && (
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-600 mb-3">
                  Images from Incident ({incidentImages.length} available)
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {incidentImages.map((image, index) => (
                    <div
                      key={index}
                      className={`relative cursor-pointer border-2 rounded-lg overflow-hidden transition-all ${
                        selectedIncidentImages.some(img => img.url === image.url)
                          ? 'border-[#7371FC] ring-2 ring-[#7371FC]/20'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => handleIncidentImageSelect(image)}
                    >
                      <img
                        src={image.url}
                        alt={`Incident image ${index + 1}`}
                        className="w-full h-24 object-cover"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'https://placehold.co/150x100?text=Image+Not+Available';
                        }}
                      />
                      {selectedIncidentImages.some(img => img.url === image.url) && (
                        <div className="absolute inset-0 bg-[#7371FC]/20 flex items-center justify-center">
                          <div className="bg-[#7371FC] rounded-full p-1">
                            <Check size={16} className="text-white" />
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  {selectedIncidentImages.length} incident image(s) selected
                </p>
              </div>
            )}

            {/* Upload New Images */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-medium text-gray-600">
                  Upload New Images
                </h4>
                <Button
                  type="button"
                  onClick={() => setShowUploadOption(!showUploadOption)}
                  className="bg-gray-100 text-gray-700 hover:bg-gray-200 text-sm"
                >
                  <Plus size={16} className="mr-1" />
                  {showUploadOption ? 'Hide Upload' : 'Add New Images'}
                </Button>
              </div>

              {showUploadOption && (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 mb-4">
                  <div className="text-center">
                    <FileImage className="mx-auto h-12 w-12 text-gray-400" />
                    <p className="mt-2 text-sm text-gray-600">
                      Upload additional images for this news post
                    </p>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="mt-2"
                      disabled={uploading}
                    />
                    {uploading && (
                      <p className="mt-2 text-sm text-blue-600">Uploading...</p>
                    )}
                  </div>
                </div>
              )}

              {/* Uploaded Images Preview */}
              {uploadedImages.length > 0 && (
                <div>
                  <h5 className="text-sm font-medium text-gray-600 mb-2">
                    Uploaded Images ({uploadedImages.length})
                  </h5>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-4">
                    {uploadedImages.map((image, index) => (
                      <div key={index} className="relative">
                        <img
                          src={image.url}
                          alt={`Uploaded image ${index + 1}`}
                          className="w-full h-24 object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => removeUploadedImage(image)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <p className="text-sm text-gray-500">
                Total selected: {selectedIncidentImages.length + uploadedImages.length} image(s)
              </p>
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
                'Create News Post'
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
} 