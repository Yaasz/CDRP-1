import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { 
  Search, 
  Calendar, 
  Clock, 
  Users, 
  AlertTriangle, 
  Plus,
  Eye,
  Edit3,
  Trash2,
  MapPin,
  Tag,
  Image as ImageIcon,
  CheckCircle,
  X
} from "lucide-react";

import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { Badge } from "../../components/ui/Badge";
import api from "../../utils/api";

const Campaigns = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [successMessage, setSuccessMessage] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const itemsPerPage = 10;

  // Get current charity ID from localStorage
  const currentCharityId = localStorage.getItem("userId");

  useEffect(() => {
    fetchCampaigns();
  }, [currentPage, searchTerm]);

  useEffect(() => {
    // Check for success message from navigation state
    if (location.state?.message) {
      setSuccessMessage(location.state.message);
      // Clear the message from navigation state
      navigate(location.pathname, { replace: true });
      // Auto-hide success message after 5 seconds
      setTimeout(() => setSuccessMessage(null), 5000);
    }
  }, [location.state, navigate]);

  const fetchCampaigns = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await api.get("/charityAd", {
        params: {
          page: currentPage,
          limit: itemsPerPage,
          search: searchTerm
        }
      });

      if (response.data && response.data.data) {
        // Filter campaigns that belong to this charity
        const allCampaigns = response.data.data;
        const myCampaigns = allCampaigns.filter(campaign => 
          campaign.charity && campaign.charity._id === currentCharityId
        );
        
        setCampaigns(myCampaigns);
        setTotalCount(response.data.totalCount || 0);
        setTotalPages(Math.ceil((response.data.searchCount || 0) / itemsPerPage));
      }
    } catch (error) {
      console.error("Error fetching campaigns:", error);
      setError("Failed to load campaigns. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchCampaigns();
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

  const handleDelete = async (campaignId) => {
    try {
      setDeleteLoading(campaignId);
      
      const response = await api.delete(`/charityAd/${campaignId}`);
      
      if (response.data.success) {
        setSuccessMessage("Campaign deleted successfully!");
        // Refresh campaigns list
        fetchCampaigns();
      }
    } catch (error) {
      console.error("Error deleting campaign:", error);
      setError("Failed to delete campaign. Please try again.");
    } finally {
      setDeleteLoading(null);
      setShowDeleteConfirm(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#7371FC] mx-auto"></div>
          <p className="mt-4 text-gray-500">Loading campaigns...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={fetchCampaigns} className="bg-[#7371FC] text-white hover:bg-[#6260e0]">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Success Message */}
      {successMessage && (
        <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm text-green-700">{successMessage}</p>
            </div>
            <button
              onClick={() => setSuccessMessage(null)}
              className="ml-auto text-green-600 hover:text-green-800"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Header Section */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div>
            <p className="text-gray-500">
              Manage your volunteer recruitment campaigns
            </p>
          </div>
          <div className="flex gap-3">
            <div className="text-sm text-gray-500">
              {campaigns.length} campaign{campaigns.length !== 1 ? 's' : ''}
            </div>
            <Link to="/charity/ads/new">
              <Button className="bg-[#7371FC] text-white hover:bg-[#6260e0]">
                <Plus className="h-4 w-4 mr-2" />
                New Campaign
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Search Section */}
      <div className="mb-6">
        <form onSubmit={handleSearch} className="flex gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              type="search"
              placeholder="Search campaigns..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 border-[#CDC1FF] focus:border-[#A594F9] focus:ring-[#A594F9]"
            />
          </div>
          <Button 
            type="submit" 
            className="bg-[#7371FC] text-white hover:bg-[#6260e0]"
          >
            Search
          </Button>
        </form>
      </div>

      {/* Campaigns Grid */}
      {campaigns.length === 0 ? (
        <div className="text-center py-12">
          <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No campaigns found</h3>
          <p className="text-gray-500 mb-4">
            {searchTerm 
              ? "Try adjusting your search terms." 
              : "You haven't created any volunteer recruitment campaigns yet."
            }
          </p>
          <Link to="/charity/ads/new">
            <Button className="bg-[#7371FC] text-white hover:bg-[#6260e0]">
              <Plus className="h-4 w-4 mr-2" />
              Create Your First Campaign
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid gap-6">
          {campaigns.map((campaign) => (
            <div
              key={campaign._id}
              className="bg-white rounded-lg border border-[#E5D9F2] shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-semibold text-gray-900">
                        {campaign.title}
                      </h3>
                      <Badge className={getStatusColor(campaign.status)}>
                        {campaign.status}
                      </Badge>
                    </div>
                    <p className="text-gray-600 line-clamp-3 mb-3">
                      {campaign.description}
                    </p>
                    
                    {/* Campaign Details */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                      <div className="flex items-center gap-2 text-gray-500">
                        <Users className="h-4 w-4" />
                        <span>{campaign.volunteers?.length || 0} volunteer{(campaign.volunteers?.length || 0) !== 1 ? 's' : ''}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-500">
                        <Clock className="h-4 w-4" />
                        <span>{getTimeRemaining(campaign.expiresAt)}</span>
                      </div>
                      {campaign.requirements?.location && (
                        <div className="flex items-center gap-2 text-gray-500">
                          <MapPin className="h-4 w-4" />
                          <span className="truncate">{campaign.requirements.location}</span>
                        </div>
                      )}
                      {campaign.image && (
                        <div className="flex items-center gap-2 text-gray-500">
                          <ImageIcon className="h-4 w-4" />
                          <span>Has image</span>
                        </div>
                      )}
                    </div>

                    {/* Categories */}
                    {campaign.categories && campaign.categories.length > 0 && (
                      <div className="flex items-center gap-2 mt-3">
                        <Tag className="h-4 w-4 text-gray-400" />
                        <div className="flex gap-1 flex-wrap">
                          {campaign.categories.map((category, index) => (
                            <Badge 
                              key={index}
                              className="bg-[#7371FC]/10 text-[#7371FC] border-[#7371FC]/20 text-xs"
                            >
                              {category}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Required Skills */}
                    {campaign.requirements?.skills && campaign.requirements.skills.length > 0 && (
                      <div className="mt-2">
                        <p className="text-xs text-gray-500 mb-1">Required Skills:</p>
                        <div className="flex gap-1 flex-wrap">
                          {campaign.requirements.skills.map((skill, index) => (
                            <Badge 
                              key={index}
                              className="bg-blue-50 text-blue-700 border-blue-200 text-xs"
                            >
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* Campaign Image */}
                  {campaign.image && (
                    <div className="ml-4 flex-shrink-0">
                      <img
                        src={campaign.image}
                        alt={campaign.title}
                        className="w-24 h-24 object-cover rounded-lg border border-gray-200"
                      />
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-4 text-sm text-gray-500 mb-4 pt-4 border-t border-gray-100">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>Created {formatDate(campaign.createdAt)}</span>
                  </div>
                  {campaign.expiresAt && (
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>Expires {formatDate(campaign.expiresAt)}</span>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <Link to={`/charity/campaigns/${campaign._id}`} className="flex-1">
                    <Button className="w-full bg-[#7371FC] text-white hover:bg-[#6260e0]">
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </Button>
                  </Link>
                  <Link to={`/charity/campaigns/${campaign._id}/edit`}>
                    <Button
                      variant="outline"
                      className="px-4 border-[#CDC1FF] text-gray-700 hover:bg-[#F5EFFF]"
                    >
                      <Edit3 className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    className="px-4 border-red-200 text-red-600 hover:bg-red-50"
                    onClick={() => setShowDeleteConfirm(campaign._id)}
                    disabled={deleteLoading === campaign._id}
                  >
                    {deleteLoading === campaign._id ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600"></div>
                    ) : (
                      <Trash2 className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-8 flex items-center justify-between">
          <div className="text-sm text-gray-500">
            Page {currentPage} of {totalPages}
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="border-[#CDC1FF] text-gray-700 hover:bg-[#F5EFFF]"
            >
              Previous
            </Button>
            <Button
              variant="outline"
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="border-[#CDC1FF] text-gray-700 hover:bg-[#F5EFFF]"
            >
              Next
            </Button>
          </div>
        </div>
      )}

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
              Are you sure you want to delete this campaign? 
              All volunteer applications and campaign data will be permanently removed.
            </p>
            
            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setShowDeleteConfirm(null)}
                disabled={deleteLoading}
              >
                Cancel
              </Button>
              <Button
                className="flex-1 bg-red-600 text-white hover:bg-red-700"
                onClick={() => handleDelete(showDeleteConfirm)}
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

export default Campaigns; 