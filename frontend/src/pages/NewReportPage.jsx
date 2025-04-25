import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, MapPin, Loader2, AlertCircle } from 'lucide-react';

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
  const [formData, setFormData] = useState({
    incidentType: '',
    location: '',
    description: '',
  });
  const [files, setFiles] = useState([]); // Store File objects
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    if (e.target.files) {
      const fileArray = Array.from(e.target.files);
      // Basic validation (example: limit to 5 files, 10MB each)
      if (fileArray.length > 5) {
          setError("You can upload a maximum of 5 files.");
          return;
      }
      const oversizedFiles = fileArray.filter(file => file.size > 10 * 1024 * 1024); // 10MB
      if (oversizedFiles.length > 0) {
          setError(`File(s) exceed 10MB limit: ${oversizedFiles.map(f => f.name).join(', ')}`);
          return;
      }
      setError(''); // Clear previous errors
      setFiles(fileArray);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(''); // Clear previous errors
    setIsSubmitting(true);

    // Basic frontend validation
    if (!formData.incidentType || !formData.location || !formData.description) {
        setError("Please fill in all required fields.");
        setIsSubmitting(false);
        return;
    }

    // Simulate API call
    console.log('Submitting Form Data:', formData);
    console.log('Submitting Files:', files.map(f => ({ name: f.name, size: f.size, type: f.type })));

    setTimeout(() => {
      // On successful API response:
      setIsSubmitting(false);
      navigate('/dashboard/reports/success'); // Use React Router navigate
      // On API error:
      // setError("Submission failed. Please try again.");
      // setIsSubmitting(false);
    }, 1500);
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-1">Report an Incident</h1>
        <p className="text-gray-600 text-sm">Provide details about the disaster or emergency situation.</p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 md:p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Incident Type */}
          <div>
            <label htmlFor="incidentType" className="block text-sm font-medium text-gray-700 mb-1">
              Incident Type <span className="text-red-500">*</span>
            </label>
            <select
              id="incidentType"
              name="incidentType"
              value={formData.incidentType}
              onChange={handleChange}
              required
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm appearance-none"
            >
              <option value="" disabled>Select incident type...</option>
              <option value="Flooding">Flooding</option>
              <option value="Fire">Fire</option>
              <option value="Earthquake">Earthquake</option>
              <option value="Power Outage">Power Outage</option>
              <option value="Road Blockage">Road Blockage</option>
              <option value="Structural Damage">Structural Damage</option>
              <option value="Utility Issue">Utility Issue</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Location */}
          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
              Location <span className="text-red-500">*</span>
            </label>
            <div className="mb-2">
               <MapPlaceholder /> {/* Use the placeholder */}
            </div>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="Enter specific location (e.g., street address, landmark)"
              required
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
             <p className="text-xs text-gray-500 mt-1">Be as specific as possible.</p>
          </div>

          {/* Media Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Upload Photos/Videos (Optional)
            </label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
              <div className="space-y-1 text-center">
                <Upload className="mx-auto h-10 w-10 text-gray-400" />
                <div className="flex text-sm text-gray-600">
                  <label
                    htmlFor="file-upload"
                    className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                  >
                    <span>Upload files</span>
                    <input id="file-upload" name="file-upload" type="file" className="sr-only" multiple onChange={handleFileChange} accept="image/*,video/*" />
                  </label>
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs text-gray-500">PNG, JPG, MP4 up to 10MB each. Max 5 files.</p>
              </div>
            </div>
            {files.length > 0 && (
              <div className="mt-3 border border-gray-200 rounded-md p-3 bg-gray-50">
                <p className="text-sm font-medium text-gray-700 mb-2">{files.length} file(s) selected:</p>
                <ul className="text-xs text-gray-600 space-y-1">
                  {files.map((file, index) => (
                    <li key={index} className="truncate"> - {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="5"
              maxLength={500} // Added max length
              placeholder="Please provide as much detail as possible about the incident..."
              required
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm resize-y" // Allow vertical resize
            />
            <p className="text-xs text-gray-500 text-right mt-1">
              {formData.description.length} / 500 characters
            </p>
          </div>

           {/* Error Message */}
            {error && (
                <div className="rounded-md bg-red-50 p-4">
                    <div className="flex">
                        <div className="flex-shrink-0">
                            <AlertCircle className="h-5 w-5 text-red-400" aria-hidden="true" />
                        </div>
                        <div className="ml-3">
                            <p className="text-sm font-medium text-red-800">{error}</p>
                        </div>
                    </div>
                </div>
            )}

          {/* Submit Button */}
          <div className="flex justify-end pt-4 border-t border-gray-200">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`inline-flex items-center justify-center px-6 py-2.5 border border-transparent rounded-md shadow-sm text-sm font-medium text-white transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                isSubmitting
                ? 'bg-blue-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {isSubmitting && <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" />}
              {isSubmitting ? 'Submitting...' : 'Submit Report'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
