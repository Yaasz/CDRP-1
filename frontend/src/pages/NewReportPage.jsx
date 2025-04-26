import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle, MapPin, ArrowLeft, Image, X, Loader2 } from 'lucide-react';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';

// Basic Map Placeholder Component
const MapPlaceholder = () => (
  <div className="h-64 w-full bg-gray-200 rounded-lg flex items-center justify-center relative overflow-hidden border border-gray-300">
    {/* Simple background pattern */}
    <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" className="absolute inset-0">
      <defs>
        <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
          <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(200,200,200,0.5)" strokeWidth="1"/>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#grid)" />
    </svg>
     <div className="relative z-10 bg-white/90 backdrop-blur-sm p-4 rounded-lg text-center shadow cursor-pointer hover:bg-white transition-colors">
        <MapPin className="h-6 w-6 mx-auto mb-2 text-red-500" />
        <p className="text-sm font-medium text-gray-700">Click to set location</p>
        <p className="text-xs text-gray-500">(Map integration TBD)</p>
    </div>
  </div>
);

export default function NewReportPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: '',
    location: { coordinates: [0, 0] } // [longitude, latitude]
  });
  const [errors, setErrors] = useState({});
  const [currentLocation, setCurrentLocation] = useState(null);
  const [locationLoading, setLocationLoading] = useState(false);
  const [locationError, setLocationError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  // Get current location
  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser');
      return;
    }

    setLocationLoading(true);
    setLocationError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setCurrentLocation({ latitude, longitude });
        setFormData(prev => ({
          ...prev,
          location: { 
            coordinates: [longitude, latitude]  // GeoJSON format: [longitude, latitude]
          }
        }));
        setLocationLoading(false);
      },
      (error) => {
        setLocationError(`Unable to retrieve your location: ${error.message}`);
        setLocationLoading(false);
      },
      { enableHighAccuracy: true }
    );
  };

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when field is being edited
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  // Handle image selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      setErrors(prev => ({
        ...prev,
        image: 'Image size must be less than 5MB'
      }));
      return;
    }

    setSelectedImage(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);

    // Clear error if any
    if (errors.image) {
      setErrors(prev => ({
        ...prev,
        image: null
      }));
    }
  };

  // Remove selected image
  const handleRemoveImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
  };

  // Validate form for the current step
  const validateStep = () => {
    const newErrors = {};
    
    if (step === 1) {
      if (!formData.title.trim()) newErrors.title = 'Title is required';
      if (!formData.description.trim()) newErrors.description = 'Description is required';
      if (!formData.type) newErrors.type = 'Please select an incident type';
    }
    
    if (step === 2) {
      if (!formData.location.coordinates[0] && !formData.location.coordinates[1]) {
        newErrors.location = 'Please set a location';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Move to next step
  const handleNextStep = () => {
    if (validateStep()) {
      setStep(prev => prev + 1);
    }
  };

  // Move to previous step
  const handlePrevStep = () => {
    setStep(prev => prev - 1);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateStep()) return;
    
    setIsSubmitting(true);
    setSubmitError(null);
    
    try {
      // Create FormData for multipart/form-data (for image upload)
      const submission = new FormData();
      
      // Add all form fields
      submission.append('title', formData.title);
      submission.append('description', formData.description);
      submission.append('reportedBy', user?._id || user?.id || 'anonymous');
      submission.append('type', formData.type);
      submission.append('longitude', formData.location.coordinates[0]);
      submission.append('latitude', formData.location.coordinates[1]);
      
      // Add image if selected
      if (selectedImage) {
        submission.append('image', selectedImage);
      }
      
      // Submit form data - Use the correct API endpoint without the 'api/' prefix
      // since it's already included in the baseURL
      const response = await api.post('/report', submission, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      console.log('Report submission response:', response.data);
      
      // Get the report data from the response
      // Handle both possible response formats (direct or nested)
      const reportData = response.data.report || response.data;
      
      // Navigate to success page with report data
      navigate('/dashboard/reports/success', { 
        state: { report: reportData }
      });
    } catch (error) {
      console.error('Error submitting report:', error);
      setSubmitError(
        error.response?.data?.message || 
        error.message || 
        'An unexpected error occurred. Please try again.'
      );
      setIsSubmitting(false);
    }
  };

  // Render step 1 - Report Details
  const renderStepOne = () => (
    <div>
      <h2 className="text-lg font-semibold text-gray-800 mb-4">Report Details</h2>
      
      {/* Title */}
      <div className="mb-4">
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Brief title of the incident"
          className={`w-full px-3 py-2 border ${errors.title ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500`}
        />
        {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
      </div>
      
      {/* Description */}
      <div className="mb-4">
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows="4"
          placeholder="Provide details about the incident"
          className={`w-full px-3 py-2 border ${errors.description ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500`}
        />
        {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
      </div>
      
      {/* Incident Type */}
      <div className="mb-4">
        <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">Incident Type *</label>
        <select
          id="type"
          name="type"
          value={formData.type}
          onChange={handleChange}
          className={`w-full px-3 py-2 border ${errors.type ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500`}
        >
          <option value="" disabled>Select incident type</option>
          <option value="flood">Flood</option>
          <option value="earthquake">Earthquake</option>
          <option value="fire">Fire</option>
          <option value="landslide">Landslide</option>
          <option value="roadblock">Road Blockage</option>
          <option value="poweroutage">Power Outage</option>
          <option value="other">Other</option>
        </select>
        {errors.type && <p className="mt-1 text-sm text-red-600">{errors.type}</p>}
      </div>
      
      {/* Navigation Buttons */}
      <div className="flex justify-end mt-6">
        <button
          type="button"
          onClick={handleNextStep}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Next Step
        </button>
      </div>
    </div>
  );

  // Render step 2 - Location and Image
  const renderStepTwo = () => (
    <div>
      <h2 className="text-lg font-semibold text-gray-800 mb-4">Location & Images</h2>
      
      {/* Location */}
      <div className="mb-6">
        <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">Location *</label>
        <div className="flex flex-col space-y-2">
          {currentLocation ? (
            <div className="bg-gray-50 p-3 rounded-md border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-800">Current Location</p>
                  <p className="text-xs text-gray-500">
                    {currentLocation.latitude.toFixed(6)}, {currentLocation.longitude.toFixed(6)}
                  </p>
                </div>
                <button
                  onClick={getCurrentLocation}
                  type="button"
                  className="text-xs text-blue-600 hover:underline"
                >
                  Refresh
                </button>
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={getCurrentLocation}
              disabled={locationLoading}
              className="flex items-center justify-center w-full py-2 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              {locationLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Getting location...
                </>
              ) : (
                <>
                  <MapPin className="h-4 w-4 mr-2 text-gray-500" />
                  Use Current Location
                </>
              )}
            </button>
          )}
          
          {locationError && (
            <div className="text-sm text-red-600 flex items-start">
              <AlertTriangle className="h-4 w-4 flex-shrink-0 mt-0.5 mr-1" />
              <span>{locationError}</span>
            </div>
          )}
          
          {errors.location && <p className="mt-1 text-sm text-red-600">{errors.location}</p>}
        </div>
      </div>
      
      {/* Image Upload */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-1">Images (Optional)</label>
        
        {!imagePreview ? (
          <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
            <div className="space-y-1 text-center">
              <Image className="mx-auto h-12 w-12 text-gray-400" />
              <div className="flex text-sm text-gray-600">
                <label
                  htmlFor="file-upload"
                  className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none"
                >
                  <span>Upload an image</span>
                  <input
                    id="file-upload"
                    name="file-upload"
                    type="file"
                    className="sr-only"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                </label>
                <p className="pl-1">or drag and drop</p>
              </div>
              <p className="text-xs text-gray-500">PNG, JPG, GIF up to 5MB</p>
            </div>
          </div>
        ) : (
          <div className="mt-1 relative bg-gray-50 border border-gray-200 rounded-md p-2">
            <img
              src={imagePreview}
              alt="Preview"
              className="mx-auto max-h-48 rounded-md"
            />
            <button
              type="button"
              onClick={handleRemoveImage}
              className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 focus:outline-none"
              title="Remove image"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}
        
        {errors.image && <p className="mt-1 text-sm text-red-600">{errors.image}</p>}
      </div>
      
      {/* Navigation Buttons */}
      <div className="flex justify-between mt-6">
        <button
          type="button"
          onClick={handlePrevStep}
          className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Previous
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className={`px-4 py-2 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
            isSubmitting ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 inline animate-spin" />
              Submitting...
            </>
          ) : (
            'Submit Report'
          )}
        </button>
      </div>
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto pb-12">
      <div className="mb-6">
        <button onClick={() => navigate(-1)} className="flex items-center text-blue-600 hover:underline text-sm focus:outline-none">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back
        </button>
        <h1 className="text-2xl font-bold text-gray-800 mt-4">Create New Incident Report</h1>
        <p className="text-gray-600">Fill in the details about the incident you want to report.</p>
      </div>

      {/* Error Alert */}
      {submitError && (
        <div className="mb-4 bg-red-50 border border-red-200 text-red-800 rounded-md p-4 flex items-start">
          <AlertTriangle className="h-5 w-5 text-red-500 mr-2 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="text-sm font-medium">Submission Error</h3>
            <p className="text-sm mt-1">{submitError}</p>
          </div>
        </div>
      )}

      {/* Step Progress Indicator */}
      <div className="mb-6">
        <div className="flex items-center">
          <div className={`flex items-center justify-center w-8 h-8 rounded-full ${step >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'} text-sm font-semibold`}>
            1
          </div>
          <div className={`flex-1 h-1 mx-2 ${step >= 2 ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
          <div className={`flex items-center justify-center w-8 h-8 rounded-full ${step >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'} text-sm font-semibold`}>
            2
          </div>
        </div>
        <div className="flex justify-between mt-1 text-xs">
          <span className={step >= 1 ? 'text-blue-600 font-medium' : 'text-gray-500'}>Report Details</span>
          <span className={step >= 2 ? 'text-blue-600 font-medium' : 'text-gray-500'}>Location & Images</span>
        </div>
      </div>

      {/* Form */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <form onSubmit={handleSubmit}>
          {step === 1 && renderStepOne()}
          {step === 2 && renderStepTwo()}
        </form>
      </div>
    </div>
  );
}
