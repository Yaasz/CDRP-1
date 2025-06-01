import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  Users, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  FileText,
  Building,
  MapPin
} from "lucide-react";

import { Button } from "../../components/ui/Button";
import { Badge } from "../../components/ui/Badge";
import api from "../../utils/api";

const AnnouncementDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [announcement, setAnnouncement] = useState(null);
  const [incident, setIncident] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [showAcceptModal, setShowAcceptModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);

  // Get current organization ID from localStorage
  const currentCharityId = localStorage.getItem("userId");

  // Get current charity's response status
  const getCurrentCharityResponse = () => {
    if (!announcement?.charities || !currentCharityId) return null;
    
    const charityResponse = announcement.charities.find(
      (charityObj) => charityObj.charity === currentCharityId
    );
    
    return charityResponse || null;
  };

  const charityResponse = getCurrentCharityResponse();
  const canRespond = charityResponse && charityResponse.response === "Pending";

  useEffect(() => {
    fetchAnnouncementDetails();
  }, [id]);

  const fetchAnnouncementDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch announcement details
      const announcementResponse = await api.get(`/announcement/${id}`);
      
      if (announcementResponse.data && announcementResponse.data.data) {
        const announcementData = announcementResponse.data.data;
        setAnnouncement(announcementData);
        
        // Fetch related incident if exists
        if (announcementData.incident) {
          try {
            const incidentResponse = await api.get(`/incident/${announcementData.incident}`);
            if (incidentResponse.data && incidentResponse.data.data) {
              setIncident(incidentResponse.data.data);
            }
          } catch (incidentError) {
            console.warn("Could not fetch incident details:", incidentError);
          }
        }
      } else {
        setError("Announcement not found.");
      }
    } catch (error) {
      console.error("Error fetching announcement details:", error);
      setError(error.response?.data?.message || "Failed to load announcement details.");
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptAnnouncement = async () => {
    try {
      setActionLoading(true);
      
      // Call the API to accept the announcement
      const response = await api.patch(`/announcement/${id}/respond`, {
        charityId: currentCharityId,
        response: "Accepted"
      });

      if (response.data.success) {
        // Refresh announcement data to show updated status
        await fetchAnnouncementDetails();
        
        // Navigate to create charity ad page with announcement context
        navigate(`/charity/ads/new`, { 
          state: { 
            announcementId: id,
            announcementTitle: announcement.title,
            announcementDescription: announcement.description,
            incident: incident
          }
        });
      }
      
    } catch (error) {
      console.error("Error accepting announcement:", error);
      setError(error.response?.data?.message || "Failed to accept announcement. Please try again.");
    } finally {
      setActionLoading(false);
      setShowAcceptModal(false);
    }
  };

  const handleRejectAnnouncement = async () => {
    try {
      setActionLoading(true);
      
      // Call the API to reject the announcement
      const response = await api.patch(`/announcement/${id}/respond`, {
        charityId: currentCharityId,
        response: "Rejected"
      });

      if (response.data.success) {
        // Refresh announcement data to show updated status
        await fetchAnnouncementDetails();
        setShowRejectModal(false);
      }
      
    } catch (error) {
      console.error("Error rejecting announcement:", error);
      setError(error.response?.data?.message || "Failed to reject announcement. Please try again.");
    } finally {
      setActionLoading(false);
      setShowRejectModal(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Unknown date";
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      });
    } catch (error) {
      return "Invalid date";
    }
  };

  const getTimeAgo = (dateString) => {
    if (!dateString) return "";
    try {
      const now = new Date();
      const date = new Date(dateString);
      const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
      
      if (diffInHours < 1) return "Less than 1h ago";
      if (diffInHours < 24) return `${diffInHours}h ago`;
      
      const diffInDays = Math.floor(diffInHours / 24);
      if (diffInDays < 7) return `${diffInDays}d ago`;
      
      return formatDate(dateString);
    } catch (error) {
      return "";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#7371FC] mx-auto"></div>
          <p className="mt-4 text-gray-500">Loading announcement details...</p>
        </div>
      </div>
    );
  }

  if (error || !announcement) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-600 mb-4">{error || "Announcement not found"}</p>
          <Link to="/charity/announcements">
            <Button className="bg-[#7371FC] text-white hover:bg-[#6260e0]">
              Back to Announcements
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Header */}
      <div className="mb-6">
        <Link
          to="/charity/announcements"
          className="inline-flex items-center gap-2 text-[#7371FC] hover:text-[#6260e0] mb-4"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Announcements
        </Link>
        
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {announcement.title}
            </h1>
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>{formatDate(announcement.createdAt)}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>{getTimeAgo(announcement.createdAt)}</span>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Badge className="bg-[#7371FC]/10 text-[#7371FC] border-[#7371FC]/20">
              Government Announcement
            </Badge>
            {announcement.incident && (
              <Badge className="bg-orange-100 text-orange-800 border-orange-200">
                Incident Related
              </Badge>
            )}
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Description */}
          <div className="bg-white rounded-lg border border-[#E5D9F2] p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Announcement Details
            </h2>
            <div className="prose max-w-none">
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                {announcement.description}
              </p>
            </div>
          </div>

          {/* Related Incident Information */}
          {incident && (
            <div className="bg-white rounded-lg border border-[#E5D9F2] p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Related Incident
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-gray-900">{incident.title || incident.type}</h3>
                  <p className="text-gray-600 mt-1">{incident.description}</p>
                </div>
                
                {incident.location && (
                  <div className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 text-gray-400 mt-1 flex-shrink-0" />
                    <div>
                      <span className="text-sm font-medium text-gray-700">Location:</span>
                      <p className="text-sm text-gray-600">
                        {incident.location.address || 
                         (incident.location.coordinates ? 
                           `Lat: ${incident.location.coordinates[1]}, Lng: ${incident.location.coordinates[0]}` : 
                           'Location not specified')}
                      </p>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-4 text-sm">
                  <span className="text-gray-500">Status:</span>
                  <Badge className={
                    incident.status === 'critical' ? 'bg-red-100 text-red-800' :
                    incident.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    incident.status === 'resolved' ? 'bg-green-100 text-green-800' :
                    'bg-gray-100 text-gray-800'
                  }>
                    {incident.status || 'Unknown'}
                  </Badge>
                  
                  <span className="text-gray-500">Type:</span>
                  <Badge className="bg-blue-100 text-blue-800">
                    {incident.type || 'General'}
                  </Badge>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Organizations Invited */}
          <div className="bg-white rounded-lg border border-[#E5D9F2] p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Users className="h-5 w-5" />
              Organizations Invited
            </h3>
            <div className="text-sm text-gray-600">
              <p>{announcement.charities?.length || 0} organization{(announcement.charities?.length || 0) !== 1 ? 's' : ''} invited to respond to this announcement.</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="bg-white rounded-lg border border-[#E5D9F2] p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Your Response
            </h3>
            
            {/* Current Status Display */}
            {charityResponse ? (
              <div className="mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm font-medium text-gray-700">Current Status:</span>
                  <Badge className={
                    charityResponse.response === "Accepted" 
                      ? "bg-green-100 text-green-800 border-green-200"
                      : charityResponse.response === "Rejected"
                      ? "bg-red-100 text-red-800 border-red-200"
                      : "bg-yellow-100 text-yellow-800 border-yellow-200"
                  }>
                    {charityResponse.response}
                  </Badge>
                </div>
                
                {charityResponse.response === "Accepted" && (
                  <p className="text-sm text-green-700 mb-3">
                    ✓ You have accepted this announcement. You can create a campaign to support this cause.
                  </p>
                )}
                
                {charityResponse.response === "Rejected" && (
                  <p className="text-sm text-red-700 mb-3">
                    ✗ You have declined this announcement.
                  </p>
                )}
                
                {charityResponse.response === "Pending" && (
                  <p className="text-sm text-gray-600 mb-3">
                    ⏳ Please respond to this announcement.
                  </p>
                )}
              </div>
            ) : (
              <div className="mb-4">
                <Badge className="bg-gray-100 text-gray-800 border-gray-200">
                  Not Invited
                </Badge>
                <p className="text-sm text-gray-600 mt-2">
                  Your organization was not invited to respond to this announcement.
                </p>
              </div>
            )}

            {/* Action Buttons - Only show if charity can respond */}
            {canRespond && (
              <div className="space-y-3">
                <Button
                  onClick={() => setShowAcceptModal(true)}
                  disabled={actionLoading}
                  className="w-full bg-green-600 hover:bg-green-700 text-white"
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Accept & Create Campaign
                </Button>
                
                <Button
                  onClick={() => setShowRejectModal(true)}
                  disabled={actionLoading}
                  variant="outline"
                  className="w-full border-red-300 text-red-600 hover:bg-red-50"
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  Decline Announcement
                </Button>
              </div>
            )}

            {/* Show create campaign button if already accepted */}
            {charityResponse?.response === "Accepted" && (
              <div className="space-y-3">
                <Button
                  onClick={() => navigate(`/charity/ads/new`, { 
                    state: { 
                      announcementId: id,
                      announcementTitle: announcement.title,
                      announcementDescription: announcement.description,
                      incident: incident
                    }
                  })}
                  className="w-full bg-[#7371FC] hover:bg-[#6260e0] text-white"
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Create Campaign
                </Button>
              </div>
            )}
            
            <div className="mt-4 text-xs text-gray-500">
              {canRespond ? (
                <p>Accepting this announcement will allow you to create a charity campaign to support the cause.</p>
              ) : charityResponse?.response === "Accepted" ? (
                <p>You can create multiple campaigns for this announcement if needed.</p>
              ) : (
                <p>Response status is final and cannot be changed.</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Accept Modal */}
      {showAcceptModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Accept Announcement</h3>
            <p className="text-gray-600 mb-6">
              By accepting this announcement, you'll be redirected to create a charity campaign to support this cause. 
              Are you ready to proceed?
            </p>
            <div className="flex gap-3">
              <Button
                onClick={handleAcceptAnnouncement}
                disabled={actionLoading}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white"
              >
                {actionLoading ? "Processing..." : "Yes, Accept"}
              </Button>
              <Button
                onClick={() => setShowAcceptModal(false)}
                variant="outline"
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Decline Announcement</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to decline this announcement? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <Button
                onClick={handleRejectAnnouncement}
                disabled={actionLoading}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white"
              >
                {actionLoading ? "Processing..." : "Yes, Decline"}
              </Button>
              <Button
                onClick={() => setShowRejectModal(false)}
                variant="outline"
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AnnouncementDetail; 