import React, { createContext, useContext, useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

const SelectContext = createContext({
  value: '',
  onChange: () => {},
  isOpen: false,
  setIsOpen: () => {},
});

export const Select = ({ children, defaultValue, className = "", ...props }) => {
  const [value, setValue] = useState(defaultValue);
  const [isOpen, setIsOpen] = useState(false);

  const onChange = (newValue) => {
    setValue(newValue);
    setIsOpen(false);
  };

  return (
    <SelectContext.Provider value={{ value, onChange, isOpen, setIsOpen }}>
      <div className={`relative ${className}`} {...props}>
        {children}
      </div>
    </SelectContext.Provider>
  );
};

export const SelectTrigger = ({ children, id, className = "", ...props }) => {
  const { isOpen, setIsOpen } = useContext(SelectContext);

  return (
    <button
      id={id}
      type="button"
      onClick={() => setIsOpen(!isOpen)}
      className={`flex w-full items-center justify-between rounded-md border border-gray-300 bg-white p-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      {...props}
    >
      {children}
      <ChevronDown className="h-4 w-4 opacity-50" />
    </button>
  );
};

export const SelectValue = ({ placeholder, className = "", ...props }) => {
  const { value } = useContext(SelectContext);

  return (
    <span className={`flex-1 ${className}`} {...props}>
      {value || placeholder}
    </span>
  );
};

export const SelectContent = ({ children, className = "", ...props }) => {
  const { isOpen, setIsOpen } = useContext(SelectContext);
  const ref = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [setIsOpen]);

  if (!isOpen) return null;

  return (
    <div
      ref={ref}
      className={`absolute mt-1 max-h-60 w-full overflow-auto rounded-md border bg-white py-1 text-sm shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-10 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export const SelectItem = ({ children, value, className = "", ...props }) => {
  const { onChange, value: selectedValue } = useContext(SelectContext);
  const isSelected = selectedValue === value;

  return (
    <div
      className={`relative cursor-default select-none py-1.5 pl-8 pr-2 ${isSelected ? 'bg-blue-100 text-blue-900' : 'text-gray-900 hover:bg-gray-100'} ${className}`}
      onClick={() => onChange(value)}
      {...props}
    >
      {isSelected && (
        <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
          <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M11.4669 3.72684C11.7558 3.91574 11.8369 4.30308 11.648 4.59198L7.39799 11.092C7.29783 11.2452 7.13556 11.3467 6.95402 11.3699C6.77247 11.3931 6.58989 11.3355 6.45446 11.2124L3.70446 8.71241C3.44905 8.48022 3.43023 8.08494 3.66242 7.82953C3.89461 7.57412 4.28989 7.55529 4.5453 7.78749L6.75292 9.79441L10.6018 3.90792C10.7907 3.61902 11.178 3.53795 11.4669 3.72684Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path>
          </svg>
        </span>
      )}
      {children}
    </div>
  );
}; 