import React, { useContext, useEffect, useState } from "react";
import "../styles/side-panel.css";
import dspaceClient from "../services/DspaceClient";
import { AppStateContext } from "../context/AppStateContext";
import { JobContext } from "../context/JobContext";
import ItemDetailsCard from "./ItemDetailsCard";

const SidePanel = () => {
  const {
    userDirectory,
    setUserDirectory,
    currentId,
    setCurrentId,
    currentPath,
    setCurrentPath,
    historyStack,
    setHistoryStack,
  } = useContext(AppStateContext);

  const { addJob, updateJob, jobs } = useContext(JobContext); // Jobs context

  const [currentRecord, setCurrentRecord] = useState(null);

  // Determine if any job is still in progress
  const isLoading = jobs.some((job) => job.status === "in progress");

  useEffect(() => {
    if (userDirectory && currentId) {
      const foundRecord = searchUserDirectory(userDirectory, "id", currentId);
      if (foundRecord) {
        setCurrentRecord(foundRecord);
        setCurrentPath(foundRecord.path);
      }
    }
  }, [userDirectory, currentId]);

  useEffect(() => {
    const fetchUserDirectory = async () => {
      try {
        const response = await dspaceClient.getUserDirectory();
        setUserDirectory(response.userDirectory);
      } catch (error) {
        window.alert("Failed to fetch user directory");
      }
    };

    fetchUserDirectory();
  }, [setUserDirectory]);

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

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    const jobId = Date.now(); // Unique ID for the job

    if (!file) {
      return window.alert("Please select a file to upload.");
    }

    const foundRecord = searchUserDirectory(userDirectory, "id", currentId);
    if (!foundRecord) {
      return window.alert("Target destination not found.");
    }

    if (foundRecord.type === "directory") {
      const remotePath = `${foundRecord.path}\\${file.name}`;
      
      // Add job to track the upload
      addJob({ id: jobId, type: "upload", status: "in progress", filename: file.name });
      
      try {
        await dspaceClient.uploadFile(file, remotePath);
        const response = await dspaceClient.getUserDirectory();
        setUserDirectory(response.userDirectory);
        updateJob(jobId, { status: "completed" }); // Update job as completed
      } catch (error) {
        window.alert("File upload failed.");
        updateJob(jobId, { status: "failed" }); // Update job as failed
      } finally {
        event.target.value = "";
      }
    } else {
      window.alert("Cannot upload at the current location.");
    }
  };

  const handleDelete = async () => {
    const jobId = Date.now(); // Unique ID for delete job
    const parentId = historyStack[historyStack.length - 1];

    addJob({ id: jobId, type: "delete", status: "in progress", filename: currentId });

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

      updateJob(jobId, { status: "completed" });
    } catch (error) {
      console.error("Failed to delete:", error);
      updateJob(jobId, { status: "failed" });
    }
  };

  const handleDownload = async () => {
    const jobId = Date.now(); // Unique ID for download job

    addJob({ id: jobId, type: "download", status: "in progress", filename: currentId });

    try {
      await dspaceClient.retrieve(currentId);
      updateJob(jobId, { status: "completed" });
    } catch (error) {
      window.alert("Failed to fetch file");
      updateJob(jobId, { status: "failed" });
    }
  };

  return (
    <div className="side-panel">
      {isLoading && (
        <div className="loading-bar">
          <div className="loading-indicator"></div>
        </div>
      )}

      <div className="logo-container">
        <h1>ᗡ:\\space</h1>
      </div>

      <label htmlFor="file-upload" className="upload-button">
        Upload File
      </label>
      <input
        type="file"
        id="file-upload"
        style={{ display: "none" }}
        onChange={handleFileUpload}
      />

      {currentRecord && (
        <ItemDetailsCard
          item={currentRecord}
          onDelete={handleDelete}
          onDownload={handleDownload}
        />
      )}
    </div>
  );
};

export default SidePanel;
