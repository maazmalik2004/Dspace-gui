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

const DetailRow = ({ label, value, index }) => {
  const backgroundColor = index % 2 === 0 ? "#f0f0f0" : "white"; // Gray for even rows

  return (
    <div style={{ backgroundColor, padding: "5px" }}>
      <strong>{label}</strong> {value}
    </div>
  );
};

const ItemDetailsCard = ({ item, onDelete, onDownload }) => {
  const { name, type, size, path } = item;

  return (
    <div className="item-details-card">
      <div className="icon">
        <img
          src={type === "directory" ? folderIcon : fileIcon}
          alt={type === "directory" ? "Folder Icon" : "File Icon"}
          className="item-icon"
        />
      </div>

      <DetailRow label="Name" value={name} index={0} />
      <DetailRow label="Type" value={type === "file" ? "file" : "directory"} index={1} />
      <DetailRow label="Path" value={path} index={2} />
      {type === "file" && (
        <>
          <DetailRow label="Extension" value={getFileExtension(name)} index={3} />
          <DetailRow label="Size" value={formatFileSize(size)} index={4} />
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
