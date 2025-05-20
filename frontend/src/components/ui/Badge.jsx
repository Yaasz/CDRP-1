import React from 'react';

export const Badge = ({ children, variant = "default", className = "", ...props }) => {
  const variantClassNames = {
    default: "bg-gray-100 text-gray-800",
    primary: "bg-blue-100 text-blue-800",
    secondary: "bg-purple-100 text-purple-800",
    success: "bg-green-100 text-green-800",
    danger: "bg-red-100 text-red-800",
    warning: "bg-yellow-100 text-yellow-800",
    outline: "bg-transparent border border-gray-200 text-gray-800"
  };

  const baseClassNames = "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold";
  const variantClassName = variantClassNames[variant] || variantClassNames.default;

  return (
    <div className={`${baseClassNames} ${variantClassName} ${className}`} {...props}>
      {children}
    </div>
  );
}; 