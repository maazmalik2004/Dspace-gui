import React, { useState, useContext, useEffect } from "react";
import "../styles/main-panel.css";
import ItemCard from "./ItemCard";
import { AppStateContext } from "../context/AppStateContext";
import dspaceClient from "../services/DspaceClient";

const MainPanel = () => {
  const { userDirectory, setUserDirectory, currentId, setCurrentId } =
    useContext(AppStateContext);
  const [files, setFiles] = useState([]);
  const [currentPath, setCurrentPath] = useState("");
  const [historyStack, setHistoryStack] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (userDirectory) {
      const topLevelFiles = getTopLevelChildrenById(userDirectory, currentId);
      setFiles(topLevelFiles);

      const foundRecord = searchUserDirectory(userDirectory, "id", currentId);
      if (foundRecord) {
        setCurrentPath(foundRecord.path);
      }
    }
  }, [userDirectory, currentId]);

  useEffect(() => {
    const fetchUserDirectory = async () => {
      setIsLoading(true);
      try {
        const response = await dspaceClient.getUserDirectory();
        setUserDirectory(response.userDirectory);
      } catch (error) {
        console.error("Failed to set user directory:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserDirectory();
  }, []);

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

  const searchUserDirectory = (directory, key, value) => {
    const queue = [directory];

    while (queue.length > 0) {
      const current = queue.shift();

      if (current[key] === value) {
        return current;
      }

      if (current.children) {
        queue.push(...current.children);
      }
    }

    return null;
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

  const handleDelete = async () => {
    const parentId = historyStack[historyStack.length - 1];
    setIsLoading(true);

    try {
      await dspaceClient.delete(currentId);
      const response = await dspaceClient.getUserDirectory();
      setUserDirectory(response.userDirectory);

      setHistoryStack((prevStack) => {
        const newStack = [...prevStack];
        newStack.pop();

        if (parentId) {
          setCurrentId(parentId);
        }
        return newStack;
      });
    } catch (error) {
      console.error("Failed to delete:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = async () => {
    setIsLoading(true);

    try {
      await dspaceClient.retrieve(currentId);
    } catch (error) {
      window.alert("Failed to fetch file");
    } finally {
      setIsLoading(false);
    }
  };

  if (!userDirectory) {
    return <div className="main-panel">Loading...</div>;
  }

  return (
    <div className="main-panel">
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
          Go Back
        </button>
        <button onClick={handleDownload} className="download-button">
          Download
        </button>
        <button onClick={handleDelete} className="delete-button">
          Delete
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
