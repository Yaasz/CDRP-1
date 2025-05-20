import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';

export default function CharityCampaigns({ campaigns = [] }) {
  if (campaigns.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No campaigns found for this charity.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {campaigns.map(campaign => (
        <div key={campaign._id} className="border rounded-lg overflow-hidden shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-3">
            <div className="h-48 md:h-auto">
              <img 
                src={campaign.image || 'https://placehold.co/600x400'} 
                alt={campaign.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-4 md:col-span-2">
              <div className="flex justify-between">
                <h3 className="text-lg font-bold">{campaign.title}</h3>
                <Badge className={
                  campaign.status === 'open' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                }>
                  {campaign.status || 'Unknown'}
                </Badge>
              </div>
              <p className="text-gray-700 mt-2 line-clamp-2">{campaign.description}</p>
              
              {campaign.categories && campaign.categories.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1">
                  {campaign.categories.map((category, i) => (
                    <Badge key={i} className="bg-blue-50 text-blue-700">{category}</Badge>
                  ))}
                </div>
              )}
              
              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                {campaign.requirements && campaign.requirements.length > 0 && (
                  <div>
                    <span className="text-gray-500">Locations:</span>{' '}
                    {campaign.requirements.map(req => req.location).filter(Boolean).join(', ') || 'No locations specified'}
                  </div>
                )}
                {campaign.volunteers && (
                  <div>
                    <span className="text-gray-500">Volunteers:</span>{' '}
                    {Array.isArray(campaign.volunteers) ? campaign.volunteers.length : 0}
                  </div>
                )}
                {campaign.expiresAt && (
                  <div>
                    <span className="text-gray-500">Expires:</span>{' '}
                    {new Date(campaign.expiresAt).toLocaleDateString()}
                  </div>
                )}
              </div>
              
              <div className="mt-4 flex justify-end">
                <Button variant="outline" size="sm">
                  View Details
                </Button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
} 