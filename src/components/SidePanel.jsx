import React, { useContext } from "react";
import "../styles/side-panel.css";
import dspaceClient from "../services/DspaceClient";
import { AppStateContext } from "../context/AppStateContext"; 

const SidePanel = () => {
    const { userDirectory, setUserDirectory, currentId,  setCurrentId} = useContext(AppStateContext);

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
            return window.alert("Something went wrong, target destination not found.");
        }

        if (foundRecord.type === "directory") {
            const remotePath = `${foundRecord.path}\\${file.name}`;
            try {
                await dspaceClient.uploadFile(file, remotePath);
                const response = await dspaceClient.getUserDirectory();
                setUserDirectory(response.userDirectory);
            } catch (error) {
                window.alert("File upload failed. Please try again.");
            }
        } else {
            window.alert("Cannot upload at the current location.");
        }

        event.target.value = ""; 
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
                style={{ display: "none" }}
            />
        </div>
    );
};

export default SidePanel;
