import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  Users, 
  MapPin,
  Tag,
  Image as ImageIcon,
  Edit3,
  Trash2,
  AlertTriangle,
  CheckCircle,
  User,
  Mail,
  Phone
} from "lucide-react";

import { Button } from "../../components/ui/Button";
import { Badge } from "../../components/ui/Badge";
import api from "../../utils/api";

const CampaignDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [campaign, setCampaign] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Get current charity ID from localStorage
  const currentCharityId = localStorage.getItem("userId");

  useEffect(() => {
    fetchCampaign();
  }, [id]);

  const fetchCampaign = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await api.get(`/charityAd/${id}`);
      
      if (response.data && response.data.data) {
        const campaignData = response.data.data;
        
        // Check if this campaign belongs to the current charity
        if (campaignData.charity && campaignData.charity._id !== currentCharityId) {
          setError("You don't have permission to view this campaign.");
          return;
        }
        
        setCampaign(campaignData);
      } else {
        setError("Campaign not found.");
      }
    } catch (error) {
      console.error("Error fetching campaign:", error);
      setError("Failed to load campaign details. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      setDeleteLoading(true);
      
      const response = await api.delete(`/charityAd/${id}`);
      
      if (response.data.success) {
        // Navigate back to campaigns with success message
        navigate("/charity/campaigns", {
          state: { message: "Campaign deleted successfully!" }
        });
      }
    } catch (error) {
      console.error("Error deleting campaign:", error);
      setError("Failed to delete campaign. Please try again.");
    } finally {
      setDeleteLoading(false);
      setShowDeleteConfirm(false);
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

  const getTimeRemaining = (expiresAt) => {
    if (!expiresAt) return "No expiry";
    try {
      const now = new Date();
      const expiry = new Date(expiresAt);
      const diffInHours = Math.floor((expiry - now) / (1000 * 60 * 60));
      
      if (diffInHours < 0) return "Expired";
      if (diffInHours < 24) return `${diffInHours}h remaining`;
      
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays}d remaining`;
    } catch (error) {
      return "Invalid date";
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "open":
        return "bg-green-100 text-green-800 border-green-200";
      case "closed":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#7371FC] mx-auto"></div>
          <p className="mt-4 text-gray-500">Loading campaign details...</p>
        </div>
      </div>
    );
  }

  if (error || !campaign) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-600 mb-4">{error || "Campaign not found"}</p>
          <Link to="/charity/campaigns">
            <Button className="bg-[#7371FC] text-white hover:bg-[#6260e0]">
              Back to Campaigns
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
          to="/charity/campaigns"
          className="inline-flex items-center gap-2 text-[#7371FC] hover:text-[#6260e0] mb-4"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Campaigns
        </Link>
        
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold text-gray-900">
                {campaign.title}
              </h1>
              <Badge className={getStatusColor(campaign.status)}>
                {campaign.status}
              </Badge>
            </div>
            <p className="text-gray-600">
              Campaign details and volunteer management
            </p>
          </div>
          
          <div className="flex gap-3">
            <Link to={`/charity/campaigns/${id}/edit`}>
              <Button variant="outline" className="border-[#CDC1FF] text-gray-700 hover:bg-[#F5EFFF]">
                <Edit3 className="h-4 w-4 mr-2" />
                Edit Campaign
              </Button>
            </Link>
            <Button
              variant="outline"
              className="border-red-200 text-red-600 hover:bg-red-50"
              onClick={() => setShowDeleteConfirm(true)}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Campaign
            </Button>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Campaign Information */}
          <div className="bg-white rounded-lg border border-[#E5D9F2] p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Campaign Information
            </h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-1">Description</h3>
                <p className="text-gray-900">{campaign.description}</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-1">Created</h3>
                  <p className="text-gray-900 flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {formatDate(campaign.createdAt)}
                  </p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-1">Expires</h3>
                  <p className="text-gray-900 flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {campaign.expiresAt ? formatDate(campaign.expiresAt) : "No expiry"}
                  </p>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-1">Time Remaining</h3>
                <p className="text-gray-900 flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {getTimeRemaining(campaign.expiresAt)}
                </p>
              </div>
              
              {campaign.requirements?.location && (
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-1">Location</h3>
                  <p className="text-gray-900 flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {campaign.requirements.location}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Categories */}
          {campaign.categories && campaign.categories.length > 0 && (
            <div className="bg-white rounded-lg border border-[#E5D9F2] p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Tag className="h-5 w-5" />
                Categories
              </h2>
              <div className="flex gap-2 flex-wrap">
                {campaign.categories.map((category, index) => (
                  <Badge 
                    key={index}
                    className="bg-[#7371FC]/10 text-[#7371FC] border-[#7371FC]/20"
                  >
                    {category}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Required Skills */}
          {campaign.requirements?.skills && campaign.requirements.skills.length > 0 && (
            <div className="bg-white rounded-lg border border-[#E5D9F2] p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Required Skills
              </h2>
              <div className="flex gap-2 flex-wrap">
                {campaign.requirements.skills.map((skill, index) => (
                  <Badge 
                    key={index}
                    className="bg-blue-50 text-blue-700 border-blue-200"
                  >
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Volunteers */}
          <div className="bg-white rounded-lg border border-[#E5D9F2] p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Users className="h-5 w-5" />
              Volunteers ({campaign.volunteers?.length || 0})
            </h2>
            
            {campaign.volunteers && campaign.volunteers.length > 0 ? (
              <div className="space-y-3">
                {campaign.volunteers.map((volunteer, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-[#7371FC] rounded-full flex items-center justify-center">
                        <User className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {volunteer.name || volunteer.email || "Volunteer"}
                        </p>
                        {volunteer.email && (
                          <p className="text-sm text-gray-500 flex items-center gap-1">
                            <Mail className="h-3 w-3" />
                            {volunteer.email}
                          </p>
                        )}
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-[#CDC1FF] text-gray-700 hover:bg-[#F5EFFF]"
                      onClick={() => {
                        // Navigate to volunteer detail
                        console.log("View volunteer:", volunteer._id);
                      }}
                    >
                      View Profile
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Users className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                <p>No volunteers have joined this campaign yet.</p>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Campaign Image */}
          {campaign.image && (
            <div className="bg-white rounded-lg border border-[#E5D9F2] p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <ImageIcon className="h-5 w-5" />
                Campaign Image
              </h3>
              <img
                src={campaign.image}
                alt={campaign.title}
                className="w-full h-48 object-cover rounded-lg border border-gray-200"
              />
            </div>
          )}

          {/* Quick Stats */}
          <div className="bg-white rounded-lg border border-[#E5D9F2] p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Status</span>
                <Badge className={getStatusColor(campaign.status)}>
                  {campaign.status}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Volunteers</span>
                <span className="font-medium">{campaign.volunteers?.length || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Categories</span>
                <span className="font-medium">{campaign.categories?.length || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Required Skills</span>
                <span className="font-medium">{campaign.requirements?.skills?.length || 0}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <AlertTriangle className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Delete Campaign</h3>
                <p className="text-gray-600">This action cannot be undone.</p>
              </div>
            </div>
            
            <p className="text-gray-700 mb-6">
              Are you sure you want to delete "<strong>{campaign.title}</strong>"? 
              All volunteer applications and campaign data will be permanently removed.
            </p>
            
            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setShowDeleteConfirm(false)}
                disabled={deleteLoading}
              >
                Cancel
              </Button>
              <Button
                className="flex-1 bg-red-600 text-white hover:bg-red-700"
                onClick={handleDelete}
                disabled={deleteLoading}
              >
                {deleteLoading ? "Deleting..." : "Delete Campaign"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CampaignDetail; 