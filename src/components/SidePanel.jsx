import React, { useContext, useEffect, useState } from "react";
import ItemDetailsCard from "./ItemDetailsCard";

import { AppStateContext } from "../context/AppStateContext";
import { JobContext } from "../context/JobContext";

import dspaceClient from "../services/DspaceClient";

import "../styles/side-panel.css";

function SidePanel() {
  const {
    userDirectory,
    setUserDirectory,
    currentId,
    setCurrentId,
    currentPath,
    setCurrentPath,
    historyStack,
    setHistoryStack,
    isLoading,
    setIsLoading,
  } = useContext(AppStateContext);

  const { addJob, updateJob, jobs } = useContext(JobContext);

  const [currentRecord, setCurrentRecord] = useState(null);

  setIsLoading(jobs.some((job) => job.status === "in progress"));

  useEffect(() => {
    if (userDirectory && currentId) {
      const foundRecord = searchUserDirectory(userDirectory, "id", currentId);
      if (foundRecord) {
        setCurrentRecord(foundRecord);
        setCurrentPath(foundRecord.path);
      }
    }
  }, [userDirectory, currentId]);

  //we will load the user directory the first time the component mounts
  useEffect(() => {
    const fetchUserDirectory = async () => {
      try {
        const response = await dspaceClient.getUserDirectory();
        setUserDirectory(response.userDirectory);
      } catch (error) {
        console.log(error);
        window.alert("Failed to fetch user directory");
      }
    };

    fetchUserDirectory();
  }, []);

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
    if (!file) {
      return window.alert("Please select a file to upload.");
    }

    const foundRecord = searchUserDirectory(userDirectory, "id", currentId);
    if (!foundRecord) {
      return window.alert("Target destination not found.");
    }

    if (foundRecord.type === "directory") {
      const remotePath = `${foundRecord.path}\\${file.name}`;

      const jobId = Date.now();
      addJob({
        id: jobId,
        type: "upload",
        status: "in progress",
        itemname: file.name,
      });

      try {
        await dspaceClient.uploadFile(file, remotePath);
        const response = await dspaceClient.getUserDirectory();
        setUserDirectory(response.userDirectory);
        updateJob(jobId, { status: "completed" });
      } catch (error) {
        window.alert("File upload failed.");
        updateJob(jobId, { status: "failed" });
      } finally {
        event.target.value = "";
      }
    } else {
      window.alert("Cannot upload at the current location.");
    }
  };

  const handleFolderUpload = async (event) => {
    const files = event.target.files;

    if (files.length === 0) {
      return window.alert("Please select folder to upload.");
    }

    const foundRecord = searchUserDirectory(userDirectory, "id", currentId);
    if (!foundRecord) {
      return window.alert("Target destination not found.");
    }

    if (foundRecord.type === "directory") {
      const folderName = files[0].webkitRelativePath.split("/")[0];

      const jobId = Date.now();
      addJob({
        id: jobId,
        type: "upload",
        status: "in progress",
        itemname: folderName,
      });

      try {
        await dspaceClient.upload(Array.from(files), currentPath);
        const response = await dspaceClient.getUserDirectory();
        setUserDirectory(response.userDirectory);
        updateJob(jobId, { status: "completed" });
      } catch (error) {
        window.alert("Folder upload failed.");
        updateJob(jobId, { status: "failed" });
      } finally {
        event.target.value = "";
      }
    } else {
      window.alert("Cannot upload at the current location.");
    }
  };

  const handleDelete = async () => {
    const parentId = historyStack[historyStack.length - 1];

    const jobId = Date.now();
    addJob({
      id: jobId,
      type: "delete",
      status: "in progress",
      itemname: currentRecord.name,
    });

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
    const jobId = Date.now();
    addJob({
      id: jobId,
      type: "download",
      status: "in progress",
      itemname: currentRecord.name,
    });

    try {
      await dspaceClient.retrieve(currentId);
      updateJob(jobId, { status: "completed" });
    } catch (error) {
      window.alert("Failed to fetch item");
      updateJob(jobId, { status: "failed" });
    }
  };

  return (
    <div className="side-panel">
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

      <label htmlFor="folder-upload" className="upload-button">
        Upload Folder
      </label>
      <input
        type="file"
        id="folder-upload"
        webkitdirectory="true"
        directory="true"
        multiple
        style={{ display: "none" }}
        onChange={handleFolderUpload}
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
}

export default SidePanel;
