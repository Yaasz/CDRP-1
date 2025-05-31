import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  ArrowLeft, 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  Star, 
  Briefcase, 
  MapPin,
  Heart,
  Badge,
  Clock
} from "lucide-react";

import { Button } from "../../components/ui/Button";
import api from "../../utils/api";

const VolunteerDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [volunteer, setVolunteer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchVolunteerDetails();
  }, [id]);

  const fetchVolunteerDetails = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await api.get(`/volunteer/${id}`);
      
      if (response.data && response.data.success && response.data.data) {
        setVolunteer(response.data.data);
      } else {
        setError('Volunteer not found');
      }
    } catch (err) {
      console.error('Error fetching volunteer details:', err);
      setError('Failed to load volunteer details. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      return 'N/A';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-t-[#7371FC] border-[#E5D9F2]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-sm border border-red-200 p-8 text-center max-w-md mx-4">
          <p className="text-red-600 mb-4">{error}</p>
          <div className="space-x-3">
            <Button 
              onClick={() => navigate('/charity/volunteers')}
              variant="outline"
            >
              Back to Volunteers
            </Button>
            <Button 
              onClick={fetchVolunteerDetails}
              className="bg-[#7371FC] hover:bg-[#A594F9]"
            >
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (!volunteer) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center max-w-md mx-4">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Volunteer Not Found</h3>
          <p className="text-gray-600 mb-4">The volunteer you're looking for doesn't exist.</p>
          <Button 
            onClick={() => navigate('/charity/volunteers')}
            className="bg-[#7371FC] hover:bg-[#A594F9]"
          >
            Back to Volunteers
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Header */}
        <div className="mb-6">
          <Button
            onClick={() => navigate('/charity/volunteers')}
            variant="outline"
            className="mb-4 hover:bg-gray-50"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Volunteers
          </Button>
          
          <div className="bg-white rounded-lg shadow-sm border border-[#E5D9F2] overflow-hidden">
            <div className="bg-gradient-to-r from-[#7371FC] to-[#A594F9] px-6 sm:px-8 py-8 sm:py-12">
              <div className="flex flex-col sm:flex-row items-center gap-6">
                <div className="h-20 w-20 sm:h-24 sm:w-24 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <span className="text-2xl sm:text-3xl font-bold text-white">
                    {volunteer.fullName?.charAt(0) || 'V'}
                  </span>
                </div>
                <div className="text-center sm:text-left">
                  <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                    {volunteer.fullName || 'Unknown Volunteer'}
                  </h1>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-white/90">
                    <span className="flex items-center gap-1">
                      <Briefcase className="h-4 w-4" />
                      {volunteer.expertise || 'N/A'}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      Joined {formatDate(volunteer.createdAt)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Information */}
          <div className="lg:col-span-2 space-y-6">
            {/* Contact Information */}
            <div className="bg-white rounded-lg shadow-sm border border-[#E5D9F2] p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <User className="h-5 w-5 text-[#7371FC]" />
                Contact Information
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Mail className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-medium text-gray-900">{volunteer.email || 'N/A'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Phone className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Phone</p>
                    <p className="font-medium text-gray-900">{volunteer.phone || 'N/A'}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Personal Details */}
            <div className="bg-white rounded-lg shadow-sm border border-[#E5D9F2] p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Badge className="h-5 w-5 text-[#7371FC]" />
                Personal Details
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-500">Age</p>
                  <p className="font-medium text-gray-900">{volunteer.age || 'N/A'}</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-500">Gender</p>
                  <p className="font-medium text-gray-900 capitalize">{volunteer.sex || 'N/A'}</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-500">Expertise</p>
                  <p className="font-medium text-gray-900">{volunteer.expertise || 'N/A'}</p>
                </div>
              </div>
            </div>

            {/* Contribution Details */}
            <div className="bg-white rounded-lg shadow-sm border border-[#E5D9F2] p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Heart className="h-5 w-5 text-[#7371FC]" />
                Contribution Details
              </h2>
              <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-100">
                <p className="text-gray-700 leading-relaxed">
                  {volunteer.contribution || 'No contribution details provided.'}
                </p>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <div className="bg-white rounded-lg shadow-sm border border-[#E5D9F2] p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-gray-600">Status</span>
                  </div>
                  <span className="text-sm font-medium text-green-700">Active</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-blue-500" />
                    <span className="text-sm text-gray-600">Registered</span>
                  </div>
                  <span className="text-sm font-medium text-blue-700">
                    {formatDate(volunteer.createdAt)}
                  </span>
                </div>
              </div>
            </div>

            {/* Volunteer ID */}
            <div className="bg-white rounded-lg shadow-sm border border-[#E5D9F2] p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Volunteer ID</h3>
              <div className="p-3 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
                <p className="text-sm text-gray-500 mb-1">ID Number</p>
                <p className="font-mono text-sm font-medium text-gray-900 break-all">
                  {volunteer._id}
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="bg-white rounded-lg shadow-sm border border-[#E5D9F2] p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Actions</h3>
              <div className="space-y-3">
                <Button 
                  className="w-full bg-[#7371FC] hover:bg-[#A594F9]"
                  onClick={() => window.open(`mailto:${volunteer.email}`, '_blank')}
                  disabled={!volunteer.email}
                >
                  <Mail className="h-4 w-4 mr-2" />
                  Send Email
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => window.open(`tel:${volunteer.phone}`, '_blank')}
                  disabled={!volunteer.phone}
                >
                  <Phone className="h-4 w-4 mr-2" />
                  Call Volunteer
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VolunteerDetail; 