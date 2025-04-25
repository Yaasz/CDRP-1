import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; // Keep Link for potential detail view
// Add/Remove Icons as needed
import { Loader2, ServerCrash, Search, Grid, List, ChevronDown } from 'lucide-react'; 
import axios from 'axios';
// Import the new modal component
import VolunteerRegistrationModal from '../components/VolunteerRegistrationForm'; 

// Image Placeholder Component (can be reused)
const ImagePlaceholder = ({ src, alt, className = "", ...props }) => (
    <div className={`w-full h-full bg-gray-200 flex items-center justify-center ${className}`} {...props}>
        {src ? (
        <img src={src} alt={alt} className="object-cover w-full h-full" loading="lazy"/>
        ) : (
            <span className="text-xs text-gray-500 text-center p-2">{alt} (No Image)</span>
        )}
    </div>
);

export default function VolunteerListPage() {
  // State for ads, loading, error, modal control
  const [charityAds, setCharityAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showRegistrationModal, setShowRegistrationModal] = useState(false);
  const [selectedCharityAdId, setSelectedCharityAdId] = useState(null);
  // Add state for checking if user is already a general volunteer (mock for now)
  const [isRegisteredGlobally, setIsRegisteredGlobally] = useState(false); 

  // Remove SearchTerm / ViewMode if not implementing search/toggle now
  // const [searchTerm, setSearchTerm] = useState('');
  // const [viewMode, setViewMode] = useState('grid');

  // Mock check for global volunteer registration status
  useEffect(() => {
    const registrationStatus = localStorage.getItem('volunteerRegistrationStatus');
    setIsRegisteredGlobally(registrationStatus === 'registered');
  }, []);

  // Fetch Charity Ads
  useEffect(() => {
    const fetchCharityAds = async () => {
      setLoading(true);
      setError(null);
      const backendUrl = import.meta.env.VITE_BACKEND_URL;
      try {
        console.log(`Fetching charity ads from: ${backendUrl}/api/charityad`);
        const response = await axios.get(`${backendUrl}/api/charityad`);
        console.log("Charity Ads response data:", response.data);
        // Assuming response is { success: true, data: [...] }
        setCharityAds(response.data.data || []); 
      } catch (err) {
        console.error("Error fetching charity ads:", err);
        const errorMsg = err.response?.data?.error || err.response?.data?.message || "Failed to load volunteer opportunities.";
        setError(errorMsg);
      } finally {
        setLoading(false);
      }
    };
    fetchCharityAds();
  }, []); // Fetch once on mount

  // Handler for Volunteer button click
  const handleVolunteerClick = (e, adId) => {
    e.preventDefault(); // Prevent link navigation if button is inside a Link
    console.log(`Volunteer clicked for Ad ID: ${adId}`);
    // In a real app, check if user is logged in first
    
    if (isRegisteredGlobally) {
       // If already globally registered, maybe directly apply?
       // This backend endpoint doesn't exist yet. Just alert for now.
       alert(`Applying for opportunity ID: ${adId} (Mock - Already Registered Globally)`);
    } else {
        // If not globally registered, open registration modal
        setSelectedCharityAdId(adId);
      setShowRegistrationModal(true);
    }
  };

  // Placeholder for actual registration submission (will be called by Modal)
  const handleRegistrationSuccess = (submittedData) => {
    console.log('Registration succeeded:', submittedData);
    // Update global registration status state and localStorage
    localStorage.setItem('volunteerRegistrationStatus', 'registered');
    setIsRegisteredGlobally(true);
    setShowRegistrationModal(false);
    alert('Thank you for registering as a volunteer! You might need to click apply again if needed.');
    // Optionally: trigger refetch of ads or specific logic if needed
  };

  // --- Loading State --- 
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        <p className="ml-2 text-gray-600">Loading Opportunities...</p>
      </div>
    );
  }

  // --- Error State --- 
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64 bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <ServerCrash className="h-12 w-12 text-red-500 mb-4" />
        <h3 className="text-lg font-semibold text-red-700 mb-2">Loading Failed</h3>
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  // --- Render Page --- 
  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-1">Volunteer Hub</h1>
        <p className="text-gray-600 text-sm">Find ways to help your community.</p>
      </div>

      {/* REMOVE Filters (Location, Cause, Time, Skills) */}
      {/* <div className="mb-8 space-y-4"> ... Filters ... </div> */}

      {/* Optional: Keep Search Bar (would need backend implementation) */}
      {/* <div className="relative mb-8"> ... Search Bar ... </div> */}

      {/* REMOVE Results Header & View Toggle */}
      {/* <div className="mb-6 flex items-center justify-between"> ... </div> */}

      {/* Display Opportunities Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {charityAds.map(ad => (
          // Use ad._id as key
          <div key={ad._id} className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200 flex flex-col hover:shadow-md transition-shadow duration-200">
            {/* Link to potential detail page (if exists) */}
            {/* <Link to={`/dashboard/volunteer/${ad._id}`} className="block"> */}
                  <div className="h-40 relative">
                  <ImagePlaceholder src={ad.image || null} alt={ad.title || 'Opportunity'} className="object-cover" />
                </div>
            {/* </Link> */} 
            <div className="p-4 flex flex-col flex-grow">
              {/* Display Ad Title */}
              <h3 className="font-medium text-gray-800 leading-snug mb-2">{ad.title || 'Volunteer Opportunity'}</h3>
              {/* Display Ad Description */}
              <p className="text-sm text-gray-600 mb-3 line-clamp-3 flex-grow">{ad.description || 'No description available.'}</p>
              {/* Removed location, hours, category */}
              <div className="mt-auto pt-2 border-t border-gray-100">
                 {/* Display Status */}
                 <p className="text-xs text-gray-500 mb-3">Status: <span className={`font-medium ${ad.status === 'open' ? 'text-green-600' : 'text-gray-500'}`}>{ad.status === 'open' ? 'Open' : 'Completed'}</span></p>
                 {/* Volunteer Button */}
                 <button
                    onClick={(e) => handleVolunteerClick(e, ad._id)} // Pass ad._id
                    disabled={ad.status !== 'open'} // Disable if not open
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white px-3 py-1.5 rounded-md text-xs font-medium transition-colors duration-150 disabled:bg-gray-300 disabled:cursor-not-allowed"
                  >
                    {isRegisteredGlobally ? 'Apply Now (Mock)' : 'Volunteer'}
                  </button>
                  </div>
              </div>
            </div>
          ))}
        </div>

      {/* Display message if no ads found */}
      {charityAds.length === 0 && !loading && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center mt-6">
          <p className="text-gray-600">No volunteer opportunities found at this time.</p>
        </div>
      )}

      {/* Replace Placeholder Modal with the Actual Component */}
      <VolunteerRegistrationModal
        isOpen={showRegistrationModal}
        onClose={() => setShowRegistrationModal(false)}
        onSubmitSuccess={handleRegistrationSuccess} // Pass the success handler
        charityAdId={selectedCharityAdId} 
      />

    </div>
  );
}
