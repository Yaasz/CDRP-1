import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '../ui/Avatar';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';

const VolunteerCard = ({ volunteer }) => {
  return (
    <div className="flex items-center gap-4 rounded-lg border p-4 transition-all hover:bg-purple-50">
      <Avatar className="h-14 w-14 border-2 border-purple-200">
        <AvatarImage src={volunteer.avatar || "/images/volunteers/volunteer1.jpg"} alt={volunteer.name} />
        <AvatarFallback>{volunteer.name.charAt(0)}</AvatarFallback>
      </Avatar>
      <div className="flex-1 space-y-1">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium">{volunteer.name}</p>
          <Badge
            variant={volunteer.status === "Available" ? "success" : "outline"}
            className={`ml-auto ${
              volunteer.status === "Available" 
                ? "bg-purple-500 text-white" 
                : "border-purple-300 text-purple-700"
            }`}
          >
            {volunteer.status}
          </Badge>
        </div>
        <p className="text-xs text-gray-500">{volunteer.role}</p>
        <p className="text-xs text-gray-500">{volunteer.experience}</p>
        <Link to={`/charity/volunteers/${volunteer.id}`}>
          <Button variant="link" size="sm" className="h-auto p-0 text-xs text-purple-600">
            Contact <ChevronRight className="ml-1 h-3 w-3" />
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default VolunteerCard; 