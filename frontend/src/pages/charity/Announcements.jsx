import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Search, Calendar, Clock, Users, AlertTriangle, CheckCircle, XCircle } from "lucide-react";

import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { Badge } from "../../components/ui/Badge";
import api from "../../utils/api";

const Announcements = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const itemsPerPage = 10;

  // Get current organization ID from localStorage
  const currentCharityId = localStorage.getItem("userId");
  
  console.log("Current Charity ID from localStorage:", currentCharityId);
  console.log("All localStorage items:", {
    userId: localStorage.getItem("userId"),
    accountType: localStorage.getItem("accountType"),
    userRole: localStorage.getItem("userRole"),
    authToken: localStorage.getItem("authToken")
  });

  useEffect(() => {
    fetchAnnouncements();
  }, [currentPage, searchTerm]);

  const fetchAnnouncements = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await api.get("/announcement", {
        params: {
          page: currentPage,
          limit: itemsPerPage,
          search: searchTerm
        }
      });

      console.log("API Response:", response.data);
      console.log("Current Charity ID:", currentCharityId);

      if (response.data && response.data.data) {
        // Filter announcements that include this charity
        const allAnnouncements = response.data.data;
        console.log("All announcements:", allAnnouncements);
        
        const relevantAnnouncements = allAnnouncements.filter(announcement => {
          console.log("Checking announcement:", announcement.title);
          console.log("Announcement charities:", announcement.charities);
          
          const isRelevant = announcement.charities && announcement.charities.some(charityObj => {
            console.log("Checking charity object:", charityObj);
            const match = (typeof charityObj === 'string' && charityObj === currentCharityId) ||
                         (typeof charityObj === 'object' && charityObj.charity === currentCharityId);
            console.log("Match result:", match);
            return match;
          });
          
          console.log("Is relevant:", isRelevant);
          return isRelevant;
        });
        
        console.log("Relevant announcements:", relevantAnnouncements);
        
        // Temporarily show all announcements for debugging
        setAnnouncements(allAnnouncements);
        setTotalCount(response.data.totalCount || 0);
        setTotalPages(Math.ceil((response.data.searchCount || 0) / itemsPerPage));
      }
    } catch (error) {
      console.error("Error fetching announcements:", error);
      setError("Failed to load announcements. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchAnnouncements();
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
          <p className="mt-4 text-gray-500">Loading announcements...</p>
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
          <Button onClick={fetchAnnouncements} className="bg-[#7371FC] text-white hover:bg-[#6260e0]">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Header Section */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div>
            <p className="text-gray-500">
              Review and respond to announcements from government agencies
            </p>
          </div>
          <div className="text-sm text-gray-500">
            {totalCount} announcement{totalCount !== 1 ? 's' : ''} available
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
              placeholder="Search announcements..."
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

      {/* Announcements Grid */}
      {announcements.length === 0 ? (
        <div className="text-center py-12">
          <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No announcements found</h3>
          <p className="text-gray-500">
            {searchTerm 
              ? "Try adjusting your search terms." 
              : "There are no announcements available for your organization at this time."
            }
          </p>
        </div>
      ) : (
        <div className="grid gap-6">
          {announcements.map((announcement) => (
            <div
              key={announcement._id}
              className="bg-white rounded-lg border border-[#E5D9F2] shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {announcement.title}
                    </h3>
                    <p className="text-gray-600 line-clamp-3">
                      {announcement.description}
                    </p>
                  </div>
                  <div className="ml-4 flex flex-col items-end gap-2">
                    <Badge className="bg-[#7371FC]/10 text-[#7371FC] border-[#7371FC]/20">
                      Government
                    </Badge>
                    {announcement.incident && (
                      <Badge className="bg-orange-100 text-orange-800 border-orange-200">
                        Incident Related
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>{formatDate(announcement.createdAt)}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>{getTimeAgo(announcement.createdAt)}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    <span>{announcement.charities?.length || 0} organization{(announcement.charities?.length || 0) !== 1 ? 's' : ''} invited</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4 border-t border-gray-100">
                  <Link to={`/charity/announcements/${announcement._id}`} className="flex-1">
                    <Button className="w-full bg-[#7371FC] text-white hover:bg-[#6260e0]">
                      <CheckCircle className="h-4 w-4 mr-2" />
                      View & Respond
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    className="px-4 border-[#CDC1FF] text-gray-700 hover:bg-[#F5EFFF]"
                    onClick={() => {
                      // Quick reject functionality
                      // You could implement a modal or direct API call here
                      console.log("Quick reject:", announcement._id);
                    }}
                  >
                    <XCircle className="h-4 w-4" />
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
    </>
  );
};

export default Announcements; 