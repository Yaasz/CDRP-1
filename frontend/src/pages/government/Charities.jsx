import { useState, useEffect } from 'react';
import { Search, ChevronLeft, ChevronRight, CheckCircle, XCircle, RefreshCw, 
  Eye, ArrowLeft, Calendar, Users, ExternalLink, BarChart3, Briefcase, Edit } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import api from '../../utils/api';
import CharityList from '../../components/government/CharityList';
import CharityDetails from '../../components/government/CharityDetails';
import CharityTabs from '../../components/government/CharityTabs';

export default function GovernmentCharities() {
  const [charities, setCharities] = useState([]);
  const [filteredCharities, setFilteredCharities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [totalPages, setTotalPages] = useState(1);
  const [activeCharity, setActiveCharity] = useState(null);
  const [activeTab, setActiveTab] = useState('details'); // details, campaigns, stats
  const [actionLoading, setActionLoading] = useState(null);
  const [charityAds, setCharityAds] = useState([]); // Store charity ads
  const [totalCount, setTotalCount] = useState(0);
  const [editMode, setEditMode] = useState(false);
  const [editFormData, setEditFormData] = useState({
    organizationName: '',
    email: '',
    phone: '',
    taxId: '',
    mission: '',
    status: ''
  });
  const [editErrors, setEditErrors] = useState({});

  useEffect(() => {
    fetchCharities();
    fetchCharityAds();
  }, [currentPage]);

  // Fetch charities from backend
  const fetchCharities = async () => {
    try {
      setLoading(true);
      const response = await api.get('/org', {
        params: { 
          page: currentPage, 
          limit: itemsPerPage, 
          search: searchTerm,
          role: 'charity' // Only get charity organizations
        }
      });
      
      if (response.data && response.data.data) {
        setCharities(response.data.data);
        setFilteredCharities(response.data.data);
        setTotalCount(response.data.totalCount || 0);
        setTotalPages(Math.ceil((response.data.totalCount || 0) / itemsPerPage));
      }
    } catch (error) {
      console.error('Error fetching charities:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch charity ads from backend
  const fetchCharityAds = async () => {
    try {
      const response = await api.get('/charityad');
      if (response.data && response.data.data) {
        setCharityAds(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching charity ads:', error);
    }
  };

  useEffect(() => {
    // When search term changes, refetch charities with search filter
    if (searchTerm.trim()) {
      fetchCharities();
    } else {
      setFilteredCharities(charities);
      setTotalPages(Math.ceil(charities.length / itemsPerPage));
    }
  }, [searchTerm]);

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchCharities();
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleVerify = async (_id) => {
    setActionLoading(_id);
    try {
      const response = await api.patch(`/org/verify/${_id}`);
      
      // Update local state if successful
      if (response.data && response.data.success) {
        // Update local state immediately
        setCharities((prev) =>
          prev.map((c) => (c._id === _id ? { ...c, isVerified: true, status: 'active' } : c))
        );
        
        if (activeCharity && activeCharity._id === _id) {
          setActiveCharity({ ...activeCharity, isVerified: true, status: 'active' });
        }

        // Force a refresh of the charity list to ensure the UI is updated
        fetchCharities();
      }
    } catch (error) {
      console.error('Error verifying organization:', error);
      alert(`Verification failed: ${error.response?.data?.error || 'Unknown error'}`);
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeactivate = async (_id) => {
    setActionLoading(_id);
    try {
      // Use PATCH to update just the status field
      const response = await api.patch(`/org/${_id}`, { status: 'inactive' });
      
      if (response.data) {
        // Update local state immediately
        setCharities((prev) =>
          prev.map((c) => (c._id === _id ? { ...c, status: 'inactive' } : c))
        );
        
        if (activeCharity && activeCharity._id === _id) {
          setActiveCharity({ ...activeCharity, status: 'inactive' });
        }
        
        // Force a refresh of the charity list to ensure the UI is updated
        fetchCharities();
      }
    } catch (error) {
      console.error('Error deactivating organization:', error);
      alert(`Failed to deactivate: ${error.response?.data?.message || 'Unknown error'}`);
    } finally {
      setActionLoading(null);
    }
  };

  const handleReactivate = async (_id) => {
    setActionLoading(_id);
    try {
      // Use PATCH to update just the status field
      const response = await api.patch(`/org/${_id}`, { status: 'active' });
      
      if (response.data) {
        // Update local state immediately
        setCharities((prev) =>
          prev.map((c) => (c._id === _id ? { ...c, status: 'active' } : c))
        );
        
        if (activeCharity && activeCharity._id === _id) {
          setActiveCharity({ ...activeCharity, status: 'active' });
        }
        
        // Force a refresh of the charity list to ensure the UI is updated
        fetchCharities();
      }
    } catch (error) {
      console.error('Error reactivating organization:', error);
      alert(`Failed to reactivate: ${error.response?.data?.message || 'Unknown error'}`);
    } finally {
      setActionLoading(null);
    }
  };

  // Fetch detailed charity information including charityads
  const viewCharityDetails = async (charity) => {
    try {
      setLoading(true);
      // Fetch detailed charity information
      const response = await api.get(`/org/${charity._id}`);
      
      if (response.data && response.data.data) {
        // Get charity ads specifically for this charity
        await fetchCharityAdsForCharity(charity._id);
        setActiveCharity(response.data.data);
      } else {
        setActiveCharity(charity);
      }
    } catch (error) {
      console.error('Error fetching charity details:', error);
      // Fall back to the summary data we already have
      setActiveCharity(charity);
    } finally {
      setLoading(false);
    }
  };

  // Fetch charity ads specifically for a charity
  const fetchCharityAdsForCharity = async (charityId) => {
    try {
      const response = await api.get('/charityad', {
        params: { charity: charityId }
      });
      
      if (response.data && response.data.data) {
        // Update only the ads for this charity
        setCharityAds(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching charity ads for charity:', error);
    }
  };

  const getCharityAds = (charityId) => {
    return charityAds.filter(ad => {
      // Check if charity is a string (ID) or an object with _id
      if (typeof ad.charity === 'string' || ad.charity instanceof String) {
        return ad.charity === charityId;
      } else if (ad.charity && ad.charity._id) {
        return ad.charity._id === charityId;
      }
      return false;
    });
  };

  // Calculate pagination
  const paginatedCharities = filteredCharities;
  // We don't need to slice the data as the API already returns paginated results

  // Restore closeCharityDetails function
  const closeCharityDetails = () => {
    setActiveCharity(null);
    setActiveTab('details');
  };

  // Add edit charity function
  const handleEditCharity = () => {
    setEditFormData({
      organizationName: activeCharity.organizationName || '',
      email: activeCharity.email || '',
      phone: activeCharity.phone || '',
      taxId: activeCharity.taxId || '',
      mission: activeCharity.mission || '',
      status: activeCharity.status || 'active'
    });
    setEditMode(true);
  };

  // Handle edit form input changes
  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditFormData({
      ...editFormData,
      [name]: value
    });
    
    // Clear error for this field
    if (editErrors[name]) {
      setEditErrors({
        ...editErrors,
        [name]: null
      });
    }
  };

  // Validate the edit form
  const validateEditForm = () => {
    const errors = {};
    if (!editFormData.organizationName) errors.organizationName = 'Organization name is required';
    if (!editFormData.email) errors.email = 'Email is required';
    if (!editFormData.phone) errors.phone = 'Phone is required';
    if (!editFormData.taxId) errors.taxId = 'Tax ID is required';
    
    setEditErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Save edited charity data
  const saveEditedCharity = async () => {
    if (!validateEditForm()) return;
    
    setActionLoading(activeCharity._id);
    try {
      const response = await api.patch(`/org/${activeCharity._id}`, editFormData);
      
      if (response.data && response.data.success) {
        // Update local state with the updated charity
        setActiveCharity({
          ...activeCharity,
          ...editFormData
        });
        
        // Update the charity in the list
        setFilteredCharities(prev => 
          prev.map(c => c._id === activeCharity._id ? {
            ...c,
            ...editFormData
          } : c)
        );
        
        setEditMode(false);
      }
    } catch (error) {
      console.error('Error updating organization:', error);
      setEditErrors({
        submit: error.response?.data?.message || 'Failed to update organization'
      });
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[#7371FC]" />
      </div>
    );
  }

  if (activeCharity) {
    // Get the charity's campaigns
    const charityCampaigns = getCharityAds(activeCharity._id);
    
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="bg-white overflow-hidden shadow-sm rounded-lg border border-gray-200 mb-6">
          <div className="p-6">
            <div className="flex flex-col md:flex-row gap-6">
              {/* Left sidebar with image and actions */}
              <div className="w-full md:w-1/4">
                <img 
                  src={activeCharity.image || 'https://placehold.co/400'} 
                  alt={activeCharity.organizationName}
                  className="w-full h-48 object-cover rounded-lg mb-4"
                />
                <CharityDetails 
                  activeCharity={activeCharity}
                  closeCharityDetails={closeCharityDetails}
                  handleVerify={handleVerify}
                  handleDeactivate={handleDeactivate}
                  handleReactivate={handleReactivate}
                  actionLoading={actionLoading}
                />
              </div>
              
              {/* Right content area with tabs */}
              <CharityTabs 
                activeCharity={activeCharity}
                charityAds={charityCampaigns}
                closeCharityDetails={closeCharityDetails}
                handleVerify={handleVerify}
                handleDeactivate={handleDeactivate}
                handleReactivate={handleReactivate}
                actionLoading={actionLoading}
                saveEditedCharity={saveEditedCharity}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show the charity list view
  return (
    <CharityList 
      charities={charities}
      totalCount={totalCount}
      searchTerm={searchTerm}
      setSearchTerm={setSearchTerm}
      currentPage={currentPage}
      totalPages={totalPages}
      loading={loading}
      goToNextPage={goToNextPage}
      goToPreviousPage={goToPreviousPage}
      handleVerify={handleVerify}
      handleDeactivate={handleDeactivate}
      handleReactivate={handleReactivate}
      viewCharityDetails={viewCharityDetails}
      actionLoading={actionLoading}
    />
  );
} 