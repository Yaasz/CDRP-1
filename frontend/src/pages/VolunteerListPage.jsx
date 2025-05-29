import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, MapPin, Clock, Grid, List, ChevronDown } from 'lucide-react';
import VolunteerRegistrationForm from '../components/VolunteerRegistrationForm';
import api from '../utils/api';

// Reusable Image Placeholder
const ImagePlaceholder = ({ src, alt, className = "", ...props }) => (
    <div className={`w-full h-full bg-gray-300 flex items-center justify-center ${className}`} {...props}>
        <img src={src} alt={alt} className="object-cover w-full h-full" loading="lazy"/>
    </div>
);

export default function VolunteerListPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [showRegistrationModal, setShowRegistrationModal] = useState(false);
  const [selectedOpportunityId, setSelectedOpportunityId] = useState(null);
  const [charityAds, setCharityAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch charity ads
    fetchCharityAds();
  }, []);

  const fetchCharityAds = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await api.get('/charityad');
      
      if (response.data && response.data.data) {
        // Filter only open charity ads
        const openAds = response.data.data.filter(ad => ad.status === 'open');
        setCharityAds(openAds);
      } else {
        setError('No charity ads found');
      }
    } catch (err) {
      console.error('Error fetching charity ads:', err);
      setError('Failed to load volunteer opportunities. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Format charity ad data to match the expected structure
  const formatCharityAd = (ad) => {
    // Calculate days from duration in milliseconds
    const durationDays = Math.floor(ad.duration / (24 * 60 * 60 * 1000));
    
    return {
      id: ad._id,
      title: ad.title,
      description: ad.description,
      location: ad.requirements?.location || 'Location not specified',
      hours: `Duration: ${durationDays} days`,
      image: ad.image || 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      category: ad.categories?.[0] || 'General',
      icon: getCategoryIcon(ad.categories?.[0]),
      organization: ad.charity?.organizationName || ad.charity?.name || `Charity (ID: ${ad.charity?._id?.slice(-6) || 'Unknown'})`,
      orgType: 'Charity Organization',
      volunteersCount: ad.volunteers?.length || 0,
      expiresAt: ad.expiresAt,
      skillsNeeded: ad.requirements?.skills || []
    };
  };

  // Get icon based on category
  const getCategoryIcon = (category) => {
    const iconMap = {
      'Healthcare': '❤️',
      'Health': '❤️',
      'Education': '📚',
      'Environment': '🌳',
      'Emergency': '🚨',
      'Construction': '🏗️',
      'Medical': '⚕️',
      'Youth': '👥',
      'Community': '🏘️',
      'Water': '💧',
      'Fundraising': '💰',
      'Outreach': '📢'
    };
    return iconMap[category] || '🤝';
  };

  const formattedOpportunities = charityAds.map(formatCharityAd);

  const filteredOpportunities = formattedOpportunities.filter(opportunity => {
      if (!searchTerm) return true;
      const lowerSearch = searchTerm.toLowerCase();
      return (
        opportunity.title.toLowerCase().includes(lowerSearch) ||
        opportunity.description.toLowerCase().includes(lowerSearch) ||
        opportunity.location.toLowerCase().includes(lowerSearch) ||
        opportunity.category.toLowerCase().includes(lowerSearch) ||
        opportunity.organization.toLowerCase().includes(lowerSearch)
      );
  });

  const handleVolunteerClick = (e, opportunityId) => {
    e.preventDefault(); // Prevent link navigation if button is inside a Link
    setSelectedOpportunityId(opportunityId);
    setShowRegistrationModal(true);
  };

  const handleRegistrationSubmit = (formData) => {
    console.log('Registration submitted:', formData);
    setShowRegistrationModal(false);
    // The toast notification is handled in the registration form component
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin h-8 w-8 border-4 border-blue-600 rounded-full border-t-transparent"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Unable to Load Opportunities</h1>
        <p className="text-gray-600 mb-6">{error}</p>
        <button 
          onClick={fetchCharityAds}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-1">Volunteer Hub</h1>
        <p className="text-gray-600 text-sm">Find ways to help your community.</p>
      </div>

      {/* Search and Filters */}
      <div className="mb-6 flex flex-col lg:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <input
              type="text"
              placeholder="Search opportunities..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 pl-10 text-sm"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          </div>
        </div>
        
        <div className="flex gap-3 flex-wrap lg:flex-nowrap">
          <div className="relative min-w-[140px]">
            <select defaultValue="" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none text-sm">
              <option value="">All Categories</option>
              <option value="healthcare">Healthcare</option>
              <option value="education">Education</option>
              <option value="environment">Environment</option>
              <option value="emergency">Emergency</option>
              <option value="construction">Construction</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
               <ChevronDown className="h-4 w-4 text-gray-400" />
            </div>
          </div>
          <div className="relative min-w-[120px]">
            <select defaultValue="" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none text-sm">
              <option value="">All Locations</option>
              <option value="addis">Addis Ababa</option>
              <option value="bahir">Bahir Dar</option>
              <option value="hawassa">Hawassa</option>
              <option value="mekelle">Mekelle</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
               <ChevronDown className="h-4 w-4 text-gray-400" />
            </div>
          </div>
          <div className="relative min-w-[120px]">
            <select defaultValue="" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none text-sm">
              <option value="">All Skills</option>
              <option value="manual">Manual Labor</option>
              <option value="teaching">Teaching</option>
              <option value="medical">Medical</option>
              <option value="logistics">Logistics</option>
              <option value="communication">Communication</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
               <ChevronDown className="h-4 w-4 text-gray-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Results Header & View Toggle */}
      <div className="mb-6 flex items-center justify-between">
        <div className="text-sm text-gray-600">
          Showing {filteredOpportunities.length} opportunities
        </div>
        <div className="flex space-x-1">
          <button
            title="Grid View"
            className={`p-2 rounded-md transition-colors duration-150 ${viewMode === 'grid' ? 'bg-blue-100 text-blue-600' : 'text-gray-400 hover:bg-gray-100 hover:text-gray-600'}`}
            onClick={() => setViewMode('grid')}
          >
            <Grid className="h-5 w-5" />
          </button>
          <button
            title="List View"
            className={`p-2 rounded-md transition-colors duration-150 ${viewMode === 'list' ? 'bg-blue-100 text-blue-600' : 'text-gray-400 hover:bg-gray-100 hover:text-gray-600'}`}
            onClick={() => setViewMode('list')}
          >
            <List className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Opportunities Display */}
      {viewMode === 'grid' ? (
        // Grid View
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredOpportunities.map(op => (
            <div key={op.id} className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200 flex flex-col hover:shadow-md transition-shadow duration-200">
              <Link to={`/dashboard/volunteer/${op.id}`} className="block">
                  <div className="h-40 relative">
                    <ImagePlaceholder src={op.image} alt={op.title} className="object-cover" />
                  </div>
              </Link>
              <div className="p-4 flex flex-col flex-grow">
                <div className="flex items-center mb-2">
                   <span className="text-xl mr-2">{op.icon || '🤝'}</span>
                   <Link to={`/dashboard/volunteer/${op.id}`} className="block flex-grow">
                    <h3 className="font-medium text-gray-800 leading-snug hover:text-blue-700">{op.title}</h3>
                    <p className="text-xs text-gray-500">{op.organization}</p>
                   </Link>
                </div>
                <p className="text-sm text-gray-600 mb-3 line-clamp-3 flex-grow">{op.description}</p>
                <div className="text-xs text-gray-500 space-y-1 mt-auto pt-2 border-t border-gray-100">
                  <div className="flex items-center"><MapPin className="h-3 w-3 mr-1.5" /> {op.location}</div>
                  <div className="flex items-center"><Clock className="h-3 w-3 mr-1.5" /> {op.hours}</div>
                </div>
                 <button
                    onClick={(e) => handleVolunteerClick(e, op.id)}
                    className="mt-4 w-full bg-blue-500 hover:bg-blue-600 text-white px-3 py-1.5 rounded-md text-xs font-medium transition-colors duration-150"
                  >
                    Volunteer
                  </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        // List View
        <div className="space-y-4">
          {filteredOpportunities.map(op => (
            <div key={op.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200">
              <div className="flex flex-col sm:flex-row">
                  <div className="sm:w-1/4 md:w-1/5 lg:w-1/6 flex-shrink-0 h-32 sm:h-auto relative">
                      <ImagePlaceholder src={op.image} alt={op.title} className="object-cover" />
                  </div>
                  <div className="p-4 flex flex-col flex-grow sm:w-3/4 md:w-4/5 lg:w-5/6">
                      <div className="flex items-start justify-between mb-1 gap-2">
                          <Link to={`/dashboard/volunteer/${op.id}`} className="block">
                              <h3 className="font-semibold text-gray-800 leading-snug hover:text-blue-700">{op.title}</h3>
                              <p className="text-xs text-gray-500">{op.organization}</p>
                          </Link>
                          <button
                              onClick={(e) => handleVolunteerClick(e, op.id)}
                              className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1.5 rounded-md text-xs font-medium transition-colors duration-150 flex-shrink-0 whitespace-nowrap"
                            >
                              Volunteer
                          </button>
                      </div>
                       <p className="text-xs text-gray-600 mb-3 line-clamp-2 flex-grow">{op.description}</p>
                       <div className="text-xs text-gray-500 flex flex-wrap gap-x-3 gap-y-1 mt-auto pt-2 border-t border-gray-100">
                          <div className="flex items-center"><MapPin className="h-3 w-3 mr-1" /> {op.location}</div>
                          <div className="flex items-center"><Clock className="h-3 w-3 mr-1" /> {op.hours}</div>
                          <div className="flex items-center"><span className="mr-1">{op.icon || '🤝'}</span> {op.category}</div>
                       </div>
                  </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {filteredOpportunities.length === 0 && !loading && (
        <div className="text-center py-12 text-gray-500">
          No volunteer opportunities found matching your criteria.
        </div>
      )}

      {/* Registration Modal */}
      <VolunteerRegistrationForm
        isOpen={showRegistrationModal}
        onClose={() => setShowRegistrationModal(false)}
        onSubmitSuccess={handleRegistrationSubmit}
        charityAdId={selectedOpportunityId}
      />
    </div>
  );
}
