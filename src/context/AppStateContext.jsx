import React, { createContext, useState } from 'react';

export const AppStateContext = createContext();

export const AppStateProvider = ({ children }) => {

  const [userDirectory, setUserDirectory] = useState(null);
  const [currentId, setCurrentId] = useState("6fe3ff90-4f4e-4c83-ac20-4153c2cf70fa");
  const [currentPath, setCurrentPath] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [historyStack, setHistoryStack] = useState([]);

  return (
    <AppStateContext.Provider value={{ userDirectory, setUserDirectory, currentId, setCurrentId, currentPath, setCurrentPath, isLoading, setIsLoading, historyStack, setHistoryStack}}>
      {children}
    </AppStateContext.Provider>
  );
};
