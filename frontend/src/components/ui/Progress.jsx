import React from 'react';

export const Progress = ({ value = 0, max = 100, className = "", indicatorClassName = "" }) => {
  const percentage = Math.min(Math.max(value, 0), max) / max * 100;
  
  return (
    <div className={`h-2 w-full overflow-hidden rounded-full bg-gray-200 ${className}`}>
      <div 
        className={`h-full bg-[#7371FC] transition-all ${indicatorClassName}`}
        style={{ width: `${percentage}%` }}
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin="0"
        aria-valuemax={max}
      />
    </div>
  );
}; 