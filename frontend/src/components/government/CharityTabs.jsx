import { useState } from 'react';
import { Edit } from 'lucide-react';
import { Button } from '../ui/Button';
import CharityCampaigns from './CharityCampaigns';
import CharityStats from './CharityStats';
import CharityEdit from './CharityEdit';

export default function CharityTabs({ 
  activeCharity, 
  charityAds, 
  closeCharityDetails, 
  handleVerify, 
  handleDeactivate, 
  handleReactivate, 
  actionLoading,
  saveEditedCharity
}) {
  const [activeTab, setActiveTab] = useState('details');
  const [editMode, setEditMode] = useState(false);

  // Function to handle switching to edit mode
  const handleEditCharity = () => {
    setEditMode(true);
  };

  // If we're in edit mode, show the edit form
  if (editMode) {
    return (
      <div className="w-full md:w-3/4">
        <div className="flex justify-between items-center mb-2">
          <h1 className="text-2xl font-bold text-gray-900">{activeCharity.organizationName}</h1>
        </div>
        
        <CharityEdit 
          activeCharity={activeCharity}
          saveEditedCharity={(formData) => {
            saveEditedCharity(formData);
            setEditMode(false);
          }}
          setEditMode={setEditMode}
          actionLoading={actionLoading}
        />
      </div>
    );
  }

  return (
    <div className="w-full md:w-3/4">
      <div className="flex justify-between items-center mb-2">
        <h1 className="text-2xl font-bold text-gray-900">{activeCharity.organizationName}</h1>
        <Button 
          onClick={handleEditCharity}
          className="bg-blue-600 text-white flex items-center"
        >
          <Edit size={16} className="mr-1" /> Edit Details
        </Button>
      </div>
      
      <div className="mb-6">
        <div className="flex border-b">
          <button
            className={`px-4 py-2 font-medium text-sm ${
              activeTab === 'details' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'
            }`}
            onClick={() => setActiveTab('details')}
          >
            Organization Details
          </button>
          <button
            className={`px-4 py-2 font-medium text-sm ${
              activeTab === 'campaigns' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'
            }`}
            onClick={() => setActiveTab('campaigns')}
          >
            Campaigns ({charityAds.length})
          </button>
          <button
            className={`px-4 py-2 font-medium text-sm ${
              activeTab === 'stats' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'
            }`}
            onClick={() => setActiveTab('stats')}
          >
            Statistics
          </button>
        </div>
      </div>
      
      {activeTab === 'details' && (
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium text-gray-500">Mission Statement</h3>
            <p className="mt-1 text-gray-900">{activeCharity.mission || 'No mission statement provided'}</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Email Address</h3>
              <p className="mt-1 text-gray-900">{activeCharity.email}</p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-500">Phone Number</h3>
              <p className="mt-1 text-gray-900">{activeCharity.phone}</p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-500">Tax ID</h3>
              <p className="mt-1 text-gray-900">{activeCharity.taxId}</p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-500">Registered On</h3>
              <p className="mt-1 text-gray-900">
                {new Date(activeCharity.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      )}
      
      {activeTab === 'campaigns' && (
        <CharityCampaigns campaigns={charityAds} />
      )}
      
      {activeTab === 'stats' && (
        <CharityStats activeCharity={activeCharity} campaigns={charityAds} />
      )}
    </div>
  );
} 