import { Briefcase, Users, Calendar, BarChart3 } from 'lucide-react';
import { Button } from '../ui/Button';

export default function CharityStats({ activeCharity, campaigns = [] }) {
  if (!activeCharity) return null;

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 text-blue-600 mr-4">
              <Briefcase size={24} />
            </div>
            <div>
              <p className="text-blue-600 text-sm font-medium">Total Campaigns</p>
              <p className="text-2xl font-bold">{campaigns.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-green-50 p-4 rounded-lg">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 text-green-600 mr-4">
              <Users size={24} />
            </div>
            <div>
              <p className="text-green-600 text-sm font-medium">Total Volunteers</p>
              <p className="text-2xl font-bold">
                {campaigns.reduce((acc, campaign) => {
                  // Check if volunteers exist and is an array
                  if (campaign.volunteers && Array.isArray(campaign.volunteers)) {
                    return acc + campaign.volunteers.length;
                  }
                  return acc;
                }, 0)}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-purple-50 p-4 rounded-lg">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100 text-purple-600 mr-4">
              <Calendar size={24} />
            </div>
            <div>
              <p className="text-purple-600 text-sm font-medium">Active Since</p>
              <p className="text-2xl font-bold">
                {activeCharity.createdAt ? 
                  Math.max(1, Math.ceil((new Date() - new Date(activeCharity.createdAt)) / (1000 * 60 * 60 * 24 * 30))) : 
                  'N/A'} {activeCharity.createdAt ? 'months' : ''}
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="border rounded-lg p-4">
        <h3 className="font-medium mb-4">Campaign Status Distribution</h3>
        <div className="h-8 w-full bg-gray-200 rounded overflow-hidden">
          {campaigns.length > 0 ? (
            <>
              <div 
                className="h-full bg-green-500" 
                style={{ 
                  width: `${(campaigns.filter(c => c.status === 'open').length / campaigns.length) * 100}%`,
                  display: 'inline-block'
                }}
              ></div>
              <div 
                className="h-full bg-gray-500" 
                style={{ 
                  width: `${(campaigns.filter(c => c.status === 'closed').length / campaigns.length) * 100}%`,
                  display: 'inline-block'
                }}
              ></div>
            </>
          ) : (
            <div className="h-full bg-gray-300"></div>
          )}
        </div>
        <div className="flex justify-between mt-2 text-sm">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-green-500 rounded mr-1"></div>
            Open: {campaigns.filter(c => c.status === 'open').length}
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-gray-500 rounded mr-1"></div>
            Closed: {campaigns.filter(c => c.status === 'closed').length}
          </div>
        </div>
      </div>
      
      <div className="mt-6">
        <Button variant="outline" className="text-sm">
          <BarChart3 size={14} className="mr-1" /> Export Analytics Report
        </Button>
      </div>
    </div>
  );
} 