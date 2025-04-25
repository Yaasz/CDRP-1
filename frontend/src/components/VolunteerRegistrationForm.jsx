import { useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode'; // Correct import
import { X, Loader2, AlertCircle, User, Phone, Wrench, HeartHandshake, ChevronDown } from 'lucide-react';

export default function VolunteerRegistrationModal({ isOpen, onClose, onSubmitSuccess, charityAdId }) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    expertise: '',
    contribution: '', // Default empty, user must select
  });
  const [userId, setUserId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Get user ID from token when modal opens
  useEffect(() => {
    if (isOpen) {
      const token = localStorage.getItem('authToken');
      if (token) {
        try {
          const decodedToken = jwtDecode(token);
          // Assuming the user ID is stored in 'id' field of the token payload
          setUserId(decodedToken.id || null); 
          if (!decodedToken.id) {
              setError("Could not identify user from token.");
          }
        } catch (e) {
          console.error("Error decoding token:", e);
          setError("Invalid authentication token. Please log out and log in again.");
          setUserId(null);
        }
      } else {
        setError("You must be logged in to register as a volunteer.");
        setUserId(null);
      }
      // Reset form and error on open
      setFormData({ name: '', phone: '', expertise: '', contribution: '' });
      setError('');
    }
  }, [isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Clear previous errors

    // Validation
    if (!formData.name || !formData.phone || !formData.expertise || !formData.contribution) {
      setError("Please fill in all fields.");
      return;
    }
    if (!userId) {
      setError("Could not verify user identity. Please ensure you are logged in.");
      return;
    }
    if (!charityAdId) {
        setError("Cannot register without a specific opportunity context.");
        return;
    }
    
    setIsSubmitting(true);

    const payload = {
      user: userId,
      name: formData.name,
      phone: formData.phone,
      expertise: formData.expertise,
      contribution: formData.contribution,
      charityAdId: charityAdId,
    };

    console.log("Submitting volunteer registration:", payload);

    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    try {
      const token = localStorage.getItem('authToken'); // Get token again for the request
      const authHeaders = token ? { Authorization: `Bearer ${token}` } : {};
      
      // Backend expects JSON for this route (no file upload)
      const response = await axios.post(`${backendUrl}/api/volunteer`, payload, { 
          headers: {
              ...authHeaders,
              'Content-Type': 'application/json' 
          }
      });

      console.log("Volunteer registration response:", response.data);
      onSubmitSuccess(payload); // Pass submitted data back to parent if needed
      
    } catch (err) {
      console.error("Volunteer registration failed:", err);
      const errorMsg = err.response?.data?.message || err.response?.data?.error || "Registration failed. Please try again.";
      setError(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50 transition-opacity duration-300" onClick={onClose}>
      <div 
        className="bg-white p-6 md:p-8 rounded-lg shadow-xl max-w-lg w-full mx-4 transform transition-all duration-300 scale-95 opacity-0 animate-fade-in-scale" 
        onClick={(e) => e.stopPropagation()} // Prevent closing modal when clicking inside
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-800">Register as a Volunteer</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <div className="relative">
                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                    <User size={18} className="text-gray-400" />
                </div>
                <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="Enter your full name"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
            </div>
          </div>

          {/* Phone */}
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
             <div className="relative">
                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                    <Phone size={18} className="text-gray-400" />
                </div>
                <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                placeholder="Enter your phone number (e.g., +251...)"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
            </div>
          </div>

          {/* Expertise */}
          <div>
            <label htmlFor="expertise" className="block text-sm font-medium text-gray-700 mb-1">Skills / Expertise</label>
             <div className="relative">
                 <div className="absolute top-3 left-3 flex items-center pointer-events-none">
                    <Wrench size={18} className="text-gray-400" />
                </div>
                <textarea
                id="expertise"
                name="expertise"
                value={formData.expertise}
                onChange={handleChange}
                required
                rows="3"
                placeholder="Briefly describe your relevant skills or expertise (e.g., medical, teaching, driving, construction)"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm resize-y"
                />
            </div>
          </div>

          {/* Contribution Type */}
          <div>
            <label htmlFor="contribution" className="block text-sm font-medium text-gray-700 mb-1">How You Can Contribute</label>
             <div className="relative">
                 <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                    <HeartHandshake size={18} className="text-gray-400" />
                 </div>
                 <select
                    id="contribution"
                    name="contribution"
                    value={formData.contribution}
                    onChange={handleChange}
                    required
                    className="block w-full pl-10 pr-8 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm appearance-none"
                >
                    <option value="" disabled>Select contribution type...</option>
                    <option value="skill">Offer Skills/Time</option>
                    <option value="material donation">Material Donation</option>
                    <option value="financial aid">Financial Aid</option>
                </select>
                 <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <ChevronDown size={16} className="text-gray-400" /> 
                 </div>
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <div className="rounded-md bg-red-50 p-3">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <AlertCircle className="h-5 w-5 text-red-400" aria-hidden="true" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* Buttons */}
          <div className="flex justify-end space-x-3 pt-2">
            <button 
              type="button" 
              onClick={onClose}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button 
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              disabled={isSubmitting || !userId} // Disable if no userId or submitting
            >
              {isSubmitting ? (
                <Loader2 className="h-5 w-5 animate-spin inline mr-2" />
              ) : null}
              Submit Registration
            </button>
          </div>
        </form>
        
        {/* Animation CSS (requires Tailwind config update or global CSS) */}
        <style>{`
          @keyframes fadeInScale {
            from { opacity: 0; transform: scale(0.95); }
            to { opacity: 1; transform: scale(1); }
          }
          .animate-fade-in-scale { animation: fadeInScale 0.2s ease-out forwards; }
        `}</style>
      </div>
    </div>
  );
} 