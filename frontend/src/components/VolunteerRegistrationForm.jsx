import { useState, useEffect } from 'react';
// import { jwtDecode } from 'jwt-decode';
import { X, Loader2, AlertCircle, User, Phone, Mail, Calendar, Users, Wrench, HeartHandshake, ChevronDown } from 'lucide-react';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { showToast } from './ui/Toast';

export default function VolunteerRegistrationForm({ isOpen, onClose, onSubmitSuccess, charityAdId }) {
  const [formData, setFormData] = useState({
    fullName: '',
    sex: '',
    age: '',
    email: '',
    phone: '',
    expertise: '',
    contribution: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const { user, isAuthenticated } = useAuth();

  // Reset form and check authentication when modal opens
  useEffect(() => {
    if (isOpen) {
      if (!isAuthenticated || !user) {
        setError("You must be logged in to register as a volunteer.");
      } else {
        setError('');
        // Pre-fill user email if available
        setFormData(prev => ({
          ...prev,
          email: user?.email || ''
        }));
      }
      // Reset form on open (except email)
      setFormData(prev => ({ 
        fullName: '', 
        sex: '', 
        age: '', 
        email: prev.email, 
        phone: '', 
        expertise: '', 
        contribution: '' 
      }));
    }
  }, [isOpen, isAuthenticated, user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    const requiredFields = ['fullName', 'sex', 'age', 'email', 'phone', 'expertise', 'contribution'];
    const missingFields = requiredFields.filter(field => !formData[field]);
    
    if (missingFields.length > 0) {
      setError(`Please fill in all required fields: ${missingFields.join(', ')}`);
      return;
    }

    if (!isAuthenticated || !user?.id) {
      setError("Could not verify user identity. Please ensure you are logged in.");
      return;
    }

    if (!charityAdId) {
        setError("Cannot register without a specific opportunity context.");
        return;
    }

    // Age validation
    const age = parseInt(formData.age);
    if (age < 1 || age > 120) {
      setError("Age must be between 1 and 120 years.");
      return;
    }

    // Phone validation (basic)
    if (!/^\+?[1-9]\d{1,14}$/.test(formData.phone)) {
      setError("Please enter a valid phone number (e.g., +251912345678).");
      return;
    }
    
    setIsSubmitting(true);

    const payload = {
      user: user.id,
      fullName: formData.fullName.trim(),
      sex: formData.sex,
      age: parseInt(formData.age),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      expertise: formData.expertise.trim(),
      contribution: formData.contribution,
      charityAdId: charityAdId,
    };

    console.log("Submitting volunteer registration:", payload);

    try {
      const response = await api.post('/volunteer', payload);

      console.log("Volunteer registration response:", response.data);
      
      // Handle successful registration
      if (response.data.success) {
        showToast("Registration successful! You have been registered for this volunteer opportunity.", "success");
        
        // Close modal after short delay to let user see the toast
        setTimeout(() => {
          onClose();
          onSubmitSuccess && onSubmitSuccess(payload);
        }, 1500);
      }
      
    } catch (err) {
      console.error("Volunteer registration failed:", err);
      
      // Handle specific backend responses
      if (err.response?.status === 400) {
        const errorMsg = err.response?.data?.message || err.response?.data?.error;
        
        if (errorMsg === "You have already registered") {
          showToast("You have already registered for this opportunity.", "warning");
          // Close modal since user is already registered
          setTimeout(() => {
            onClose();
          }, 2000);
        } else if (errorMsg === "The Ad is closed, volunteer registration cancelled") {
          showToast("This volunteer opportunity is no longer accepting registrations.", "error");
          onClose();
        } else {
          setError(errorMsg || "Registration failed. Please check your information.");
        }
      } else if (err.response?.status === 404) {
        showToast("This volunteer opportunity is no longer available.", "error");
        onClose();
      } else {
        const errorMsg = err.response?.data?.message || err.response?.data?.error || "Registration failed. Please try again.";
        setError(errorMsg);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={handleBackdropClick}
    >
      {/* Glass background overlay */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>
      
      {/* Modal content */}
      <div className="relative bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto transform transition-all duration-300 scale-100">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-full">
              <HeartHandshake className="h-5 w-5 text-blue-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">Register as a Volunteer</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="mb-6">
            <p className="text-gray-600 text-sm">
              Join this volunteer opportunity and make a positive impact in your community. Please fill out all the required information below.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Personal Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Full Name */}
              <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                    <User size={18} className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    required
                    placeholder="Enter your full name"
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  />
                </div>
              </div>

              {/* Sex */}
              <div>
                <label htmlFor="sex" className="block text-sm font-medium text-gray-700 mb-2">
                  Gender <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                    <Users size={18} className="text-gray-400" />
                  </div>
                  <select
                    id="sex"
                    name="sex"
                    value={formData.sex}
                    onChange={handleChange}
                    required
                    className="block w-full pl-10 pr-8 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none transition-colors"
                  >
                    <option value="">Select gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <ChevronDown size={16} className="text-gray-400" />
                  </div>
                </div>
              </div>

              {/* Age */}
              <div>
                <label htmlFor="age" className="block text-sm font-medium text-gray-700 mb-2">
                  Age <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                    <Calendar size={18} className="text-gray-400" />
                  </div>
                  <input
                    type="number"
                    id="age"
                    name="age"
                    value={formData.age}
                    onChange={handleChange}
                    required
                    min="1"
                    max="120"
                    placeholder="Enter your age"
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                    <Mail size={18} className="text-gray-400" />
                  </div>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="Enter your email address"
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number <span className="text-red-500">*</span>
              </label>
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
                  placeholder="Enter your phone number (e.g., +251912345678)"
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
              </div>
            </div>

            {/* Skills & Expertise */}
            <div>
              <label htmlFor="expertise" className="block text-sm font-medium text-gray-700 mb-2">
                Skills & Expertise <span className="text-red-500">*</span>
              </label>
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
                  placeholder="Briefly describe your relevant skills, experience, or expertise that could help with this opportunity..."
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-y transition-colors"
                />
              </div>
            </div>

            {/* Contribution Type */}
            <div>
              <label htmlFor="contribution" className="block text-sm font-medium text-gray-700 mb-2">
                How You Can Contribute <span className="text-red-500">*</span>
              </label>
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
                  className="block w-full pl-10 pr-8 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none transition-colors"
                >
                  <option value="">Select contribution type...</option>
                  <option value="skill">Offer Skills/Time</option>
                  <option value="material donation">Material Donation</option>
                  <option value="financial aid">Financial Aid</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <ChevronDown size={16} className="text-gray-400" />
                </div>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="rounded-lg bg-red-50 p-4 border border-red-200">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <AlertCircle className="h-5 w-5 text-red-600" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-red-700">{error}</p>
                  </div>
                </div>
              </div>
            )}
          </form>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 rounded-b-lg">
          <div className="flex space-x-3">
            <button 
              type="button" 
              onClick={onClose}
              className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 transition-colors"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button 
              type="submit"
              onClick={handleSubmit}
              className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition-colors flex items-center justify-center"
              disabled={isSubmitting || !isAuthenticated || !user?.id}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin mr-2" />
                  Registering...
                </>
              ) : (
                'Submit Registration'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 