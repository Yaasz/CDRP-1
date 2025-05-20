import React from 'react';
import { Bell } from 'lucide-react';
import { Button } from '../ui/Button';
import { Avatar, AvatarImage, AvatarFallback } from '../ui/Avatar';

const CharityHeader = ({ title = "Dashboard" }) => {
  return (
    <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-white px-6">
      <div className="flex-1">
        <h1 className="text-2xl font-semibold">{title}</h1>
      </div>
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          <span className="absolute right-1 top-1 flex h-2 w-2 rounded-full bg-purple-600"></span>
          <span className="sr-only">Notifications</span>
        </Button>
        <div className="flex items-center gap-2">
          <Avatar>
            <AvatarImage src="/images/volunteers/volunteer1.jpg" alt="Admin" />
            <AvatarFallback>ST</AvatarFallback>
          </Avatar>
          <div className="hidden md:block">
            <p className="text-sm font-medium">Selam Tesfaye</p>
            <p className="text-xs text-gray-500">Administrator</p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default CharityHeader; 