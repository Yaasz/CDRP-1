import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Users, Eye } from "lucide-react";

import { Card, CardContent } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Avatar, AvatarImage, AvatarFallback } from "../../components/ui/Avatar";

import api from "../../utils/api";

const Volunteers = () => {
  const [volunteers, setVolunteers] = useState([]);
  const [groupedVolunteers, setGroupedVolunteers] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalVolunteers, setTotalVolunteers] = useState(0);

  useEffect(() => {
    fetchVolunteersFromCharityAds();
  }, []);

  const fetchVolunteersFromCharityAds = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch all charity ads which contain volunteers
      const response = await api.get('/charityad');
      
      if (response.data && response.data.success && response.data.data) {
        // Extract all volunteers from all charity ads
        const allVolunteers = [];
        const groupedByCharityAd = {};
        
        response.data.data.forEach(charityAd => {
          if (charityAd.volunteers && charityAd.volunteers.length > 0) {
            const charityAdKey = charityAd._id;
            const charityAdInfo = {
              id: charityAd._id,
              title: charityAd.title,
              charityName: charityAd.charity?.organizationName || 'Unknown Charity',
              description: charityAd.description,
              status: charityAd.status
            };

            groupedByCharityAd[charityAdKey] = {
              charityAdInfo,
              volunteers: charityAd.volunteers.map(volunteer => ({
                ...volunteer,
                charityAdId: charityAd._id,
                charityAdTitle: charityAd.title,
                charityName: charityAd.charity?.organizationName || 'Unknown Charity'
              }))
            };

            // Add to total volunteers array
            charityAd.volunteers.forEach(volunteer => {
              allVolunteers.push({
                ...volunteer,
                charityAdId: charityAd._id,
                charityAdTitle: charityAd.title,
                charityName: charityAd.charity?.organizationName || 'Unknown Charity'
              });
            });
          }
        });

        setVolunteers(allVolunteers);
        setTotalVolunteers(allVolunteers.length);
        setGroupedVolunteers(groupedByCharityAd);
      }
    } catch (err) {
      console.error('Error fetching volunteers:', err);
      setError('Failed to load volunteers. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Function to truncate text
  const truncateText = (text, maxLength = 10) => {
    if (!text) return 'N/A';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  // Function to render a volunteer table for a charity ad
  const renderVolunteerTable = (charityAdData) => {
    const { charityAdInfo, volunteers } = charityAdData;

    if (!volunteers || volunteers.length === 0) {
      return null;
    }

    return (
      <div className="mb-8" key={charityAdInfo.id}>
        <div className="mb-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg sm:text-xl font-semibold text-gray-800">
                {charityAdInfo.title}
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                {charityAdInfo.charityName} • {volunteers.length} volunteer{volunteers.length !== 1 ? 's' : ''}
              </p>
            </div>
            <div className="text-left sm:text-right">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                charityAdInfo.status === 'open' 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-gray-100 text-gray-800'
              }`}>
                {charityAdInfo.status || 'Unknown'}
              </span>
            </div>
          </div>
          {charityAdInfo.description && (
            <p className="text-sm text-gray-500 mt-2 line-clamp-2">
              {charityAdInfo.description}
            </p>
          )}
        </div>
        
        {/* Mobile Card Layout */}
        <div className="block sm:hidden space-y-4">
          {volunteers.map((volunteer) => (
            <div key={volunteer._id} className="bg-white border border-[#E5D9F2] rounded-lg p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-[#E5D9F2] flex items-center justify-center">
                    <span className="text-[#7371FC] font-medium">
                      {volunteer.fullName?.charAt(0) || 'V'}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{volunteer.fullName || 'N/A'}</p>
                    <p className="text-sm text-gray-600">{volunteer.email || 'N/A'}</p>
                  </div>
                </div>
                <Link to={`/charity/volunteers/${volunteer._id}`}>
                  <Button size="sm" className="bg-[#7371FC] hover:bg-[#A594F9] text-white">
                    <Eye className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-gray-500">Phone:</span>
                  <p className="text-gray-900">{volunteer.phone || 'N/A'}</p>
                </div>
                <div>
                  <span className="text-gray-500">Expertise:</span>
                  <p className="text-gray-900">{truncateText(volunteer.expertise)}</p>
                </div>
                <div className="col-span-2">
                  <span className="text-gray-500">Contribution:</span>
                  <p className="text-gray-900">{volunteer.contribution || 'N/A'}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop Table Layout */}
        <div className="hidden sm:block overflow-hidden rounded-lg border border-[#E5D9F2] bg-white">
          <div className="overflow-x-auto">
            <table className="w-full min-w-full">
              <thead>
                <tr className="border-b border-[#F5EFFF] text-left text-sm font-medium text-gray-500">
                  <th className="px-4 py-3">Profile</th>
                  <th className="px-4 py-3">Full Name</th>
                  <th className="px-4 py-3 hidden lg:table-cell">Email</th>
                  <th className="px-4 py-3 hidden md:table-cell">Phone</th>
                  <th className="px-4 py-3">Expertise</th>
                  <th className="px-4 py-3 hidden lg:table-cell">Contribution</th>
                  <th className="px-4 py-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F5EFFF]">
                {volunteers.map((volunteer) => (
                  <tr key={volunteer._id} className="text-sm hover:bg-[#F5EFFF]">
                    <td className="px-4 py-3">
                      <div className="h-10 w-10 rounded-full bg-[#E5D9F2] flex items-center justify-center">
                        <span className="text-[#7371FC] font-medium">
                          {volunteer.fullName?.charAt(0) || 'V'}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 font-medium">{volunteer.fullName || 'N/A'}</td>
                    <td className="px-4 py-3 text-gray-600 hidden lg:table-cell">{volunteer.email || 'N/A'}</td>
                    <td className="px-4 py-3 text-gray-600 hidden md:table-cell">{volunteer.phone || 'N/A'}</td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800" title={volunteer.expertise || 'N/A'}>
                        {truncateText(volunteer.expertise)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-600 hidden lg:table-cell">{truncateText(volunteer.contribution, 15)}</td>
                    <td className="px-4 py-3 text-center">
                      <Link to={`/charity/volunteers/${volunteer._id}`}>
                        <Button size="sm" className="bg-[#7371FC] hover:bg-[#A594F9] text-white">
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-t-[#7371FC] border-[#E5D9F2]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <p className="text-red-600">{error}</p>
        <Button 
          onClick={fetchVolunteersFromCharityAds}
          className="mt-4 bg-[#7371FC] hover:bg-[#A594F9]"
        >
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      <div className="bg-white rounded-lg border border-[#E5D9F2] mb-6 p-4 sm:p-6">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#CDC1FF] text-[#7371FC]">
            <Users className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Total Volunteers</p>
            <p className="text-xl sm:text-2xl font-bold text-gray-900">{totalVolunteers}</p>
          </div>
        </div>
      </div>

      {totalVolunteers === 0 ? (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
          <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Volunteers Found</h3>
          <p className="text-gray-600">There are currently no volunteers registered for any charity ads.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {Object.values(groupedVolunteers).map((charityAdData) => 
            renderVolunteerTable(charityAdData)
          )}
        </div>
      )}
    </div>
  );
};

export default Volunteers; 