import React, { createContext, useContext, useState } from 'react';

const RadioGroupContext = createContext({
  value: '',
  onChange: () => {},
});

export const RadioGroup = ({ defaultValue, children, className = "", ...props }) => {
  const [value, setValue] = useState(defaultValue);

  const onChange = (newValue) => {
    setValue(newValue);
  };

  return (
    <RadioGroupContext.Provider value={{ value, onChange }}>
      <div className={`space-y-2 ${className}`} role="radiogroup" {...props}>
        {children}
      </div>
    </RadioGroupContext.Provider>
  );
};

export const RadioGroupItem = ({ value, id, className = "", ...props }) => {
  const { value: groupValue, onChange } = useContext(RadioGroupContext);
  const checked = value === groupValue;

  return (
    <input
      type="radio"
      id={id}
      value={value}
      checked={checked}
      onChange={() => onChange(value)}
      className={`h-4 w-4 border-gray-300 text-purple-600 focus:ring-purple-500 ${className}`}
      {...props}
    />
  );
}; 