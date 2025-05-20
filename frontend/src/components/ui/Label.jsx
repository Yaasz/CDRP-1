import React from 'react';

export const Label = ({ htmlFor, children, className = "", ...props }) => {
  return (
    <label
      htmlFor={htmlFor}
      className={`text-sm font-medium leading-none text-gray-700 ${className}`}
      {...props}
    >
      {children}
    </label>
  );
}; 