import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { 
  CheckCircle,
  Calendar,
  Users,
  MapPin,
  Tag,
  ArrowRight,
  Eye,
  Share2,
  MessageCircle
} from "lucide-react";

import { Button } from "../../components/ui/Button";
import { Badge } from "../../components/ui/Badge";

const CampaignSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [campaignData, setCampaignData] = useState(null);

  // Get campaign data from navigation state
  useEffect(() => {
    const data = location.state?.campaignData;
    if (data) {
      setCampaignData(data);
    } else {
      // If no campaign data, redirect to campaigns page
      navigate("/charity/campaigns");
    }
  }, [location.state, navigate]);

  const formatDate = (dateString) => {
    if (!dateString) return "Unknown date";
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric"
      });
    } catch (error) {
      return "Invalid date";
    }
  };

  const getExpiryDate = (duration) => {
    if (!duration) return "No expiry";
    try {
      const now = new Date();
      const expiry = new Date(now.getTime() + (parseInt(duration) * 24 * 60 * 60 * 1000));
      return formatDate(expiry);
    } catch (error) {
      return "Invalid date";
    }
  };

  if (!campaignData) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#7371FC] mx-auto"></div>
          <p className="mt-4 text-gray-500">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Success Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
          <CheckCircle className="h-8 w-8 text-green-600" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Campaign Created Successfully!
        </h1>
        <p className="text-lg text-gray-600">
          Your volunteer recruitment campaign is now live and ready to attract volunteers.
        </p>
      </div>

      {/* Campaign Summary Card */}
      <div className="bg-white rounded-lg border border-[#E5D9F2] shadow-sm mb-8">
        <div className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                {campaignData.title}
              </h2>
              <p className="text-gray-600 mb-4 line-clamp-3">
                {campaignData.description}
              </p>
              
              {/* Campaign Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm mb-4">
                <div className="flex items-center gap-2 text-gray-500">
                  <Calendar className="h-4 w-4" />
                  <span>Expires {getExpiryDate(campaignData.duration)}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-500">
                  <Users className="h-4 w-4" />
                  <span>0 volunteers (just created)</span>
                </div>
                {campaignData.requirements?.location && (
                  <div className="flex items-center gap-2 text-gray-500">
                    <MapPin className="h-4 w-4" />
                    <span className="truncate">{campaignData.requirements.location}</span>
                  </div>
                )}
              </div>

              {/* Categories */}
              {campaignData.categories && campaignData.categories.length > 0 && (
                <div className="flex items-center gap-2 mb-4">
                  <Tag className="h-4 w-4 text-gray-400" />
                  <div className="flex gap-1 flex-wrap">
                    {campaignData.categories.map((category, index) => (
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
              {campaignData.requirements?.skills && campaignData.requirements.skills.length > 0 && (
                <div>
                  <p className="text-sm text-gray-500 mb-2">Required Skills:</p>
                  <div className="flex gap-1 flex-wrap">
                    {campaignData.requirements.skills.map((skill, index) => (
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
            {campaignData.image && (
              <div className="ml-4 flex-shrink-0">
                <img
                  src={typeof campaignData.image === 'string' ? campaignData.image : URL.createObjectURL(campaignData.image)}
                  alt={campaignData.title}
                  className="w-32 h-32 object-cover rounded-lg border border-gray-200"
                />
              </div>
            )}
          </div>
        </div>
      </div>

      
      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link to="/charity/campaigns">
          <Button className="w-full sm:w-auto bg-[#7371FC] text-white hover:bg-[#6260e0] px-8">
            <Eye className="h-4 w-4 mr-2" />
            View All Campaigns
          </Button>
        </Link>
        
        

        <Link to="/charity/ads/new">
          <Button 
            variant="outline" 
            className="w-full sm:w-auto border-[#CDC1FF] text-gray-700 hover:bg-[#F5EFFF] px-8"
          >
            <ArrowRight className="h-4 w-4 mr-2" />
            Create Another
          </Button>
        </Link>
      </div>

      
    </div>
  );
};

export default CampaignSuccess; 