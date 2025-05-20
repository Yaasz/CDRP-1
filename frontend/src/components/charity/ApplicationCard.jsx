import React from 'react';
import { Link } from 'react-router-dom';
import { Avatar, AvatarImage, AvatarFallback } from '../ui/Avatar';
import { Button } from '../ui/Button';

const ApplicationCard = ({ application }) => {
  return (
    <div className="flex items-center gap-3 rounded-lg border p-3">
      <Avatar>
        <AvatarImage src={application.avatar || "/images/volunteers/volunteer1.jpg"} alt={application.name} />
        <AvatarFallback>{application.name.charAt(0)}</AvatarFallback>
      </Avatar>
      <div className="flex-1">
        <p className="text-sm font-medium">{application.name}</p>
        <p className="text-xs text-gray-500">{application.role}</p>
      </div>
      <Link to={`/charity/applications/${application.id}`}>
        <Button
          variant="ghost"
          size="sm"
          className="text-purple-600 hover:bg-purple-50 hover:text-purple-700"
        >
          Review
        </Button>
      </Link>
    </div>
  );
};

export default ApplicationCard; 