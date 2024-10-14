import React from "react";
import folderIcon from "../resources/folder.png"; 
import fileIcon from "../resources/file.png"; 
import "../styles/item-details-card.css";

const formatFileSize = (size) => {
  if (size === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(size) / Math.log(k));
  return `${parseFloat((size / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
};

const getFileExtension = (name) => {
    const parts = name.split(".");
    if (parts.length > 1 && parts[0] !== "") {
        return parts.pop();
    }
    return "";
};

const ItemDetailsCard = ({ item, onDelete, onDownload }) => {
  const { name, type, size, path, extension } = item;

  return (
    <div className="item-details-card">
      <div className="icon">
        <img
          src={type === "directory" ? folderIcon : fileIcon}
          alt={type === "directory" ? "Folder Icon" : "File Icon"}
          className="item-icon"
        />
      </div>

      <p><strong>Name </strong>{name}</p>
      <p><strong>Type </strong>{type === "file"?"file":"directory"}</p>
      <p><strong>Path </strong>{path}</p>
      {type === "file" && (
        <>
          <p><strong>Extension </strong>{getFileExtension(name)}</p>
          <p><strong>Size </strong> {formatFileSize(size)}</p>
        </>
      )}

      <div className="button-container">
        <button onClick={onDownload} className="side-panel-download-button">
          Download
        </button>
        <button onClick={onDelete} className="side-panel-delete-button">
          Delete
        </button>
      </div>
    </div>
  );
};

export default ItemDetailsCard;
