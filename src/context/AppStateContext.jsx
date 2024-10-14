import React, { createContext, useState } from 'react';

export const AppStateContext = createContext();

export const AppStateProvider = ({ children }) => {

  const [userDirectory, setUserDirectory] = useState(null);
  const [currentId, setCurrentId] = useState("894440eb-d195-422b-9926-571142b5265c");
  const [currentPath, setCurrentPath] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [historyStack, setHistoryStack] = useState([]);

  return (
    <AppStateContext.Provider value={{ userDirectory, setUserDirectory, currentId, setCurrentId, currentPath, setCurrentPath, isLoading, setIsLoading, historyStack, setHistoryStack}}>
      {children}
    </AppStateContext.Provider>
  );
};
