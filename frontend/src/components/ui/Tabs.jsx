import React, { createContext, useContext, useState } from 'react';

const TabsContext = createContext({
  selectedTab: null,
  setSelectedTab: () => {},
});

export const Tabs = ({ children, defaultValue, className = "", ...props }) => {
  const [selectedTab, setSelectedTab] = useState(defaultValue);

  return (
    <TabsContext.Provider value={{ selectedTab, setSelectedTab }}>
      <div className={`w-full ${className}`} {...props}>
        {children}
      </div>
    </TabsContext.Provider>
  );
};

export const TabsList = ({ children, className = "", ...props }) => {
  return (
    <div 
      className={`inline-flex h-10 items-center rounded-md bg-gray-100 p-1 ${className}`}
      role="tablist"
      {...props}
    >
      {children}
    </div>
  );
};

export const TabsTrigger = ({ children, value, className = "", ...props }) => {
  const { selectedTab, setSelectedTab } = useContext(TabsContext);
  const isSelected = selectedTab === value;

  return (
    <button
      role="tab"
      aria-selected={isSelected}
      data-state={isSelected ? "active" : "inactive"}
      className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7371FC] disabled:pointer-events-none disabled:opacity-50 ${
        isSelected 
          ? "bg-white text-[#7371FC] shadow-sm" 
          : "text-gray-600 hover:text-gray-800"
      } ${className}`}
      onClick={() => setSelectedTab(value)}
      {...props}
    >
      {children}
    </button>
  );
};

export const TabsContent = ({ children, value, className = "", ...props }) => {
  const { selectedTab } = useContext(TabsContext);
  
  if (selectedTab !== value) return null;
  
  return (
    <div
      role="tabpanel"
      className={`mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7371FC] ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};