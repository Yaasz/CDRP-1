import React from 'react';

export const Button = ({ 
  children, 
  variant = "default", 
  size = "default", 
  className = "", 
  ...props 
}) => {
  const variantClassNames = {
    default: "bg-[#7371FC] text-white hover:bg-[#6260e0]",
    primary: "bg-[#7371FC] text-white hover:bg-[#6260e0]",
    secondary: "bg-[#A594F9] text-white hover:bg-[#8f80e9]",
    outline: "border border-gray-300 bg-transparent text-gray-700 hover:bg-gray-50 hover:text-[#7371FC]",
    ghost: "bg-transparent text-gray-700 hover:bg-gray-50 hover:text-[#7371FC]",
    link: "bg-transparent text-[#7371FC] hover:underline p-0 h-auto"
  };

  const sizeClassNames = {
    default: "h-10 px-4 py-2",
    sm: "h-8 px-3 py-1 text-sm",
    lg: "h-12 px-6 py-3 text-lg",
    icon: "h-10 w-10 p-2"
  };

  const baseClassNames = "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7371FC] focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";
  const variantClassName = variantClassNames[variant] || variantClassNames.default;
  const sizeClassName = sizeClassNames[size] || sizeClassNames.default;

  return (
    <button 
      className={`${baseClassNames} ${variantClassName} ${sizeClassName} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
