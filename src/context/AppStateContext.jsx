import React, { createContext, useState } from 'react';

// Create the context
export const AppStateContext = createContext();

export const AppStateProvider = ({ children }) => {

  // State values for the context
  const [userDirectory, setUserDirectory] = useState(null);
  const [currentId, setCurrentId] = useState("894440eb-d195-422b-9926-571142b5265c");

  return (
    <AppStateContext.Provider value={{ userDirectory, setUserDirectory, currentId, setCurrentId }}>
      {children}
    </AppStateContext.Provider>
  );
};
