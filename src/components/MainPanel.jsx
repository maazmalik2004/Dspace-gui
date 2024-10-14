import React, { useState, useContext, useEffect } from "react";
import "../styles/main-panel.css";
import ItemCard from "./ItemCard";
import { AppStateContext } from "../context/AppStateContext";
import dspaceClient from "../services/DspaceClient";
import StatusPanel from "./StatusPanel";

const MainPanel = () => {
  const {
    userDirectory,
    setUserDirectory,
    currentId,
    setCurrentId,
    currentPath,
    setCurrentPath,
    isLoading,
    setIsLoading,
    historyStack, 
    setHistoryStack
  } = useContext(AppStateContext);

  const [files, setFiles] = useState([]);

  useEffect(() => {
    if (userDirectory) {
      const topLevelFiles = getTopLevelChildrenById(userDirectory, currentId);
      setFiles(topLevelFiles);
    }
  }, [userDirectory, currentId]);

  const getTopLevelChildrenById = (directory, id) => {
    const queue = [directory];

    while (queue.length > 0) {
      const current = queue.shift();

      if (current.id === id) {
        return current.children
          ? current.children.map(({ children, ...rest }) => ({ ...rest }))
          : [];
      }

      if (current.children) {
        queue.push(...current.children);
      }
    }

    return [];
  };

  const handleCardClick = (id) => {
    setHistoryStack((prevStack) => [...prevStack, currentId]);
    setCurrentId(id);
  };

  const handleGoBack = () => {
    setHistoryStack((prevStack) => {
      const newStack = [...prevStack];
      const lastId = newStack.pop();
      setCurrentId(lastId);
      return newStack;
    });
  };


  if (!userDirectory) {
    return <div className="main-panel">Loading...</div>;
  }

  return (
    <div className="main-panel">
    <StatusPanel />
      {isLoading && (
        <div className="loading-bar">
          <div className="loading-indicator"></div>
        </div>
      )}
      <div className="go-back-and-path-container">
        <button
          onClick={handleGoBack}
          disabled={historyStack.length === 0}
          className="back-button"
        >
        {"<"}
        </button>
        <div className="path">
          {currentPath && currentPath.includes("\\") ? (
            <>
              {currentPath.substring(0, currentPath.lastIndexOf("\\"))}\
              <strong>
                {currentPath.substring(currentPath.lastIndexOf("\\") + 1)}
              </strong>
            </>
          ) : (
            currentPath
          )}
        </div>
      </div>

      <div className="item-cards-container">
        {files.map((file) => (
          <ItemCard
            key={file.id}
            file={file}
            onClick={() => handleCardClick(file.id)}
          />
        ))}
      </div>
    </div>
  );
};

export default MainPanel;
