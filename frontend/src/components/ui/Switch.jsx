import React from 'react';

export const Switch = ({ defaultChecked = false, id, ...props }) => {
  return (
    <label 
      htmlFor={id} 
      className="relative inline-flex cursor-pointer items-center"
    >
      <input
        type="checkbox"
        id={id}
        defaultChecked={defaultChecked}
        className="peer sr-only"
        {...props}
      />
      <div className="h-6 w-11 rounded-full bg-gray-200 after:absolute after:start-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-all after:content-[''] peer-checked:bg-purple-600 peer-checked:after:translate-x-full peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-500"></div>
    </label>
  );
}; 