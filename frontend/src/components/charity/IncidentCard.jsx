import React from 'react';
import { Link } from 'react-router-dom';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';

const IncidentCard = ({ incident }) => {
  // Map status to appropriate background colors
  const getStatusColor = (status) => {
    switch (status) {
      case 'In Progress':
        return 'bg-purple-600';
      case 'Required':
        return 'bg-purple-500';
      case 'New':
        return 'bg-purple-400';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className="flex flex-col space-y-2 rounded-lg border p-3">
      <div className="flex justify-between">
        <h3 className="font-medium">{incident.title}</h3>
        <Badge className={`${getStatusColor(incident.status)} text-white`}>
          {incident.status}
        </Badge>
      </div>
      <p className="text-xs text-gray-500">Assigned by: {incident.assignedBy}</p>
      <Link to={`/charity/incidents/${incident.id}`}>
        <Button
          variant="outline"
          size="sm"
          className="mt-2 w-full border-purple-200 text-purple-700 hover:bg-purple-50 hover:text-purple-800"
        >
          View Details
        </Button>
      </Link>
    </div>
  );
};

export default IncidentCard; 