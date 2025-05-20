import React from 'react';

export const Avatar = ({ children, className = "", ...props }) => {
  return (
    <div 
      className={`relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full ${className}`} 
      {...props}
    >
      {children}
    </div>
  );
};

export const AvatarImage = ({ src, alt = "", className = "", ...props }) => {
  return (
    <img 
      src={src} 
      alt={alt} 
      className={`aspect-square h-full w-full object-cover ${className}`} 
      {...props}
    />
  );
};

export const AvatarFallback = ({ className = "", ...props }) => {
  return (
    <div 
      className={`flex h-full w-full items-center justify-center bg-gray-100 text-gray-800 ${className}`} 
      {...props}
    />
  );
};
