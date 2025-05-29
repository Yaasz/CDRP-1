import { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Clock, MapPin, User, ArrowLeft, Heart, Tag, Building } from 'lucide-react';
import VolunteerRegistrationForm from '../components/VolunteerRegistrationForm';
import DonationInfoModal from '../components/DonationInfoModal';
import api from '../utils/api';

// Reusable Image Placeholder
const ImagePlaceholder = ({ src, alt, className = "", ...props }) => (
    <div className={`w-full h-full bg-gray-300 flex items-center justify-center ${className}`} {...props}>
        <img src={src} alt={alt} className="object-cover w-full h-full" loading="lazy"/>
    </div>
);

export default function VolunteerDetailPage() {
  const { volunteerId } = useParams(); // This is actually the charity ad ID
  const navigate = useNavigate();
  const [charityAd, setCharityAd] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [showRegistrationModal, setShowRegistrationModal] = useState(false);
  const [showDonationModal, setShowDonationModal] = useState(false);

  useEffect(() => {
    // Fetch charity ad details
    fetchCharityAdDetails();
  }, [volunteerId]);

  const fetchCharityAdDetails = async () => {
    try {
      setLoading(true);
      setError(false);
      
      const response = await api.get(`/charityad/${volunteerId}`);
      
      if (response.data && response.data.data) {
        setCharityAd(response.data.data);
      } else {
        setError(true);
      }
    } catch (err) {
      console.error('Error fetching charity ad details:', err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const handleVolunteerClick = () => {
    setShowRegistrationModal(true);
  };

  const handleDonateClick = () => {
    setShowDonationModal(true);
  };

  const handleRegistrationSubmit = (formData) => {
    console.log('Registration submitted:', formData);
    setShowRegistrationModal(false);
    // The toast notification is handled in the registration form component
  };

  // Format the charity ad data to match the expected structure
  const formatCharityAdData = (ad) => {
    if (!ad) return null;
    
    // Calculate days from duration in milliseconds
    const durationDays = Math.floor(ad.duration / (24 * 60 * 60 * 1000));
    
    // Format expiration date
    const expiresAt = ad.expiresAt ? new Date(ad.expiresAt).toLocaleDateString() : 'No expiration date';
    
    return {
      id: ad._id,
      title: ad.title,
      organization: ad.charity?.organizationName || ad.charity?.name || `Charity (ID: ${ad.charity?._id?.slice(-6) || 'Unknown'})`,
      orgType: 'Charity Organization',
      description: ad.description,
      location: ad.requirements?.location || 'Location not specified',
      timeCommitment: `Duration: ${durationDays} days • Expires: ${expiresAt}`,
      skillsNeeded: ad.requirements?.skills?.join(', ') || 'No specific skills required',
      categories: ad.categories || [],
      image: ad.image || 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      status: ad.status,
      volunteersCount: ad.volunteers?.length || 0,
      expiresAt: ad.expiresAt,
      createdAt: ad.createdAt
    };
  };

  const opportunity = formatCharityAdData(charityAd);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin h-8 w-8 border-4 border-blue-600 rounded-full border-t-transparent"></div>
      </div>
    );
  }

  if (error || !opportunity) {
     return (
      <div className="text-center py-12 max-w-lg mx-auto bg-white p-8 rounded-lg shadow border border-gray-200">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Opportunity Not Found</h1>
        <p className="text-gray-600 mb-6">The volunteer opportunity you're looking for doesn't exist or is no longer available.</p>
        <Link
          to="/dashboard/volunteer"
          className="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors"
        >
           <ArrowLeft className="h-4 w-4 mr-2" />
           Back to Volunteer Hub
        </Link>
      </div>
    );
  }

  // Check if the charity ad is closed
  if (charityAd?.status === 'closed') {
    return (
      <div className="text-center py-12 max-w-lg mx-auto bg-white p-8 rounded-lg shadow border border-gray-200">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Opportunity Closed</h1>
        <p className="text-gray-600 mb-6">This volunteer opportunity is no longer accepting applications.</p>
        <Link
          to="/dashboard/volunteer"
          className="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors"
        >
           <ArrowLeft className="h-4 w-4 mr-2" />
           Back to Volunteer Hub
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <button onClick={() => navigate(-1)} className="flex items-center text-blue-600 mb-6 hover:underline text-sm focus:outline-none">
        <ArrowLeft className="h-4 w-4 mr-1" />
        Back to opportunities
      </button>

      <div className="bg-white rounded-lg overflow-hidden shadow-md border border-gray-200">
        {/* Image Header */}
        <div className="h-56 md:h-64 relative w-full">
          <ImagePlaceholder
            src={opportunity.image}
            alt={opportunity.title}
            className="object-cover"
          />
        </div>

        {/* Main Content */}
        <div className="p-6 md:p-8">
          {/* Header Info */}
          <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-4 gap-4">
            <div className="flex-1">
              <span className="inline-block px-2.5 py-0.5 bg-blue-100 text-blue-800 text-xs font-semibold rounded-full mb-2 border border-blue-200">
                {opportunity.orgType}
              </span>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight">{opportunity.title}</h1>
              <div className="flex items-center text-sm text-gray-600 mt-1">
                  <Building className="h-4 w-4 mr-1.5 text-gray-400" />
                  <span>{opportunity.organization}</span>
              </div>
            </div>
             {/* Action Buttons */}
            <div className="flex space-x-3 flex-shrink-0 mt-2 md:mt-0">
              <button
                onClick={handleVolunteerClick}
                className="inline-flex items-center justify-center px-5 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                 <Heart className="h-4 w-4 mr-2"/>
                 Volunteer
              </button>
               <button
                  onClick={handleDonateClick}
                  className="inline-flex items-center justify-center px-5 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Donate
               </button>
            </div>
          </div>

          {/* Details Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6 pt-4 border-t border-gray-100">
              <div className="flex items-start">
                <Clock className="h-5 w-5 text-gray-500 mr-3 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="text-sm font-semibold text-gray-800">Time Commitment</h3>
                  <p className="text-sm text-gray-700">{opportunity.timeCommitment}</p>
                </div>
              </div>
              <div className="flex items-start">
                <MapPin className="h-5 w-5 text-gray-500 mr-3 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="text-sm font-semibold text-gray-800">Location</h3>
                  <p className="text-sm text-gray-700">{opportunity.location}</p>
                </div>
              </div>
              <div className="flex items-start">
                 <User className="h-5 w-5 text-gray-500 mr-3 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="text-sm font-semibold text-gray-800">Skills Needed</h3>
                  <p className="text-sm text-gray-700">{opportunity.skillsNeeded}</p>
                </div>
              </div>
          </div>

          {/* Additional Stats Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 pt-4 border-t border-gray-100">
              <div className="flex items-start">
                <Heart className="h-5 w-5 text-gray-500 mr-3 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="text-sm font-semibold text-gray-800">Volunteers Registered</h3>
                  <p className="text-sm text-gray-700">{opportunity.volunteersCount} volunteers have joined</p>
                </div>
              </div>
              <div className="flex items-start">
                <Clock className="h-5 w-5 text-gray-500 mr-3 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="text-sm font-semibold text-gray-800">Campaign Status</h3>
                  <p className="text-sm text-gray-700">
                    {charityAd?.expiresAt ? `Expires on ${new Date(charityAd.expiresAt).toLocaleDateString()}` : 'No expiration date'}
                  </p>
                </div>
              </div>
          </div>

          {/* About the Role Section */}
          <section className="mb-6 pt-6 border-t border-gray-100">
            <h2 className="text-lg font-semibold mb-2 text-gray-800">About the Opportunity</h2>
            {/* Use prose for potential basic HTML or just render text */}
            <div className="prose prose-sm max-w-none text-gray-700 leading-relaxed">
               {opportunity.description.split('\n').map((paragraph, index) => (
                    <p key={index}>{paragraph}</p> // Render paragraphs if description has newlines
               ))}
            </div>
          </section>

          {/* Categories Section */}
          {opportunity.categories && opportunity.categories.length > 0 && (
            <section className="pt-6 border-t border-gray-100">
              <h2 className="text-lg font-semibold mb-3 text-gray-800">Related Categories</h2>
              <div className="flex flex-wrap gap-2">
                {opportunity.categories.map((category, index) => (
                  <span key={index} className="inline-flex items-center px-3 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full border border-gray-200">
                     <Tag className="h-3 w-3 mr-1.5 text-gray-400" />
                    {category}
                  </span>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>

      {/* Modals */}
      <VolunteerRegistrationForm
        isOpen={showRegistrationModal}
        onClose={() => setShowRegistrationModal(false)}
        onSubmitSuccess={handleRegistrationSubmit}
        charityAdId={charityAd?._id} // Pass the charity ad ID for registration
      />
      <DonationInfoModal
        isOpen={showDonationModal}
        onClose={() => setShowDonationModal(false)}
        organization={opportunity.organization}
      />
    </div>
  );
}
