import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, MapPin, Clock, Grid, List, ChevronDown } from 'lucide-react';
import VolunteerRegistrationModal from '../components/VolunteerRegistrationModal'; // Adjust path if needed

// Mock data (Same as Next.js version)
const mockOpportunities = [
  { id: 1, title: "Tree Planting in Gullele", description: "Join us to plant native trees...", location: "Gullele Botanical Garden, Addis Ababa", hours: "4 hours • July 25, 2024", image: "https://images.unsplash.com/photo-1523741543316-beb7fc7023d8?...", category: "Environment", icon: "🌳", organization: "Addis Ababa Parks Agency", orgType: "Government Agency" },
  { id: 2, title: "Tutoring Support in Bahir Dar", description: "Provide academic support...", location: "Bahir Dar", hours: "3 hours/week (flexible)", image: "https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?...", category: "Education", icon: "📚", organization: "Youth Education Initiative Ethiopia", orgType: "Local NGO" },
  { id: 3, title: "Health Checkup Assistance", description: "Assist medical staff...", location: "Hawassa Referral Hospital", hours: "Full Day • August 5, 2024", image: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?...", category: "Healthcare", icon: "❤️", organization: "Ministry of Health - SNNPR Bureau", orgType: "Government Health Service" },
   // Add other opportunities
];

// Reusable Image Placeholder
const ImagePlaceholder = ({ src, alt, className = "", ...props }) => (
    <div className={`w-full h-full bg-gray-300 flex items-center justify-center ${className}`} {...props}>
        <img src={src} alt={alt} className="object-cover w-full h-full" loading="lazy"/>
    </div>
);


export default function VolunteerListPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [isRegistered, setIsRegistered] = useState(false);
  const [showRegistrationModal, setShowRegistrationModal] = useState(false);
  // Store which opportunity triggered the modal (though not strictly needed for generic registration)
  const [selectedOpportunityId, setSelectedOpportunityId] = useState(null);

  useEffect(() => {
    // Check localStorage on mount (replace with actual auth check later)
    const registrationStatus = localStorage.getItem('volunteerRegistrationStatus');
    setIsRegistered(registrationStatus === 'registered');
  }, []);

  const filteredOpportunities = mockOpportunities.filter(opportunity => {
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
    if (isRegistered) {
      alert(`Applying for opportunity ID: ${opportunityId} (Mock - Already Registered)`);
      // Add logic to sign up for this specific opportunity
    } else {
      setSelectedOpportunityId(opportunityId);
      setShowRegistrationModal(true);
    }
  };

  const handleRegistrationSubmit = (formData) => {
    console.log('Registration submitted:', formData);
    localStorage.setItem('volunteerRegistrationStatus', 'registered');
    localStorage.setItem('volunteerData', JSON.stringify(formData)); // Store mock data
    setIsRegistered(true);
    setShowRegistrationModal(false);
    alert('Thank you for registering as a volunteer! You can now apply for opportunities.');
    // Optionally, automatically apply for the originally clicked opportunity:
    // if (selectedOpportunityId) {
    //   alert(`Applying for opportunity ID: ${selectedOpportunityId} (Mock)`);
    // }
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-1">Volunteer Hub</h1>
        <p className="text-gray-600 text-sm">Find ways to help your community.</p>
      </div>

      {/* Search and Filters */}
      <div className="mb-8 space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search opportunities by title, location, category..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        {/* Filter Dropdowns (Placeholders matching Next.js version) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Location Filter */}
          <div className="relative">
            <select defaultValue="" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none text-sm">
              <option value="">All Locations</option>
              {/* Add options dynamically or statically */}
              <option value="addis">Addis Ababa</option>
              <option value="bahir dar">Bahir Dar</option>
              <option value="hawassa">Hawassa</option>
              <option value="gambella">Gambella</option>
              <option value="mekelle">Mekelle</option>
              <option value="remote">Remote</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <ChevronDown className="h-4 w-4 text-gray-400" />
            </div>
          </div>
           {/* Cause/Category Filter */}
           <div className="relative">
            <select defaultValue="" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none text-sm">
              <option value="">All Causes</option>
              <option value="Environment">Environment</option>
              <option value="Education">Education</option>
              <option value="Healthcare">Healthcare</option>
              <option value="Disaster Relief">Disaster Relief</option>
              <option value="Food Security">Food Security</option>
              {/* Add more */}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
               <ChevronDown className="h-4 w-4 text-gray-400" />
            </div>
          </div>
           {/* Time Commitment Filter */}
           <div className="relative">
            <select defaultValue="" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none text-sm">
              <option value="">Any Time</option>
              <option value="1-3">1-3 hours</option>
              <option value="4-6">4-6 hours</option>
              <option value="full-day">Full Day</option>
              <option value="flexible">Flexible</option>
              <option value="commitment">Commitment</option>
              {/* Add more */}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
               <ChevronDown className="h-4 w-4 text-gray-400" />
            </div>
          </div>
           {/* Skills Filter */}
           <div className="relative">
            <select defaultValue="" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none text-sm">
              <option value="">All Skills</option>
              <option value="manual">Manual Labor</option>
              <option value="teaching">Teaching</option>
              <option value="medical">Medical</option>
              <option value="logistics">Logistics</option>
              <option value="communication">Communication</option>
              {/* Add more */}
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
                    {isRegistered ? 'Apply Now' : 'Volunteer'}
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
                              {isRegistered ? 'Apply' : 'Volunteer'}
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

      {filteredOpportunities.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          No volunteer opportunities found matching your criteria.
        </div>
      )}

      {/* Registration Modal */}
      <VolunteerRegistrationModal
        isOpen={showRegistrationModal}
        onClose={() => setShowRegistrationModal(false)}
        onSubmit={handleRegistrationSubmit}
      />
    </div>
  );
}
