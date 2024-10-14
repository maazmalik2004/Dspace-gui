import React from "react";
import "../styles/item-card.css";
import folderIcon from "../resources/folder.png";
import fileIcon from "../resources/file.png";

const formatFileSize = (size) => {
  if (size === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(size) / Math.log(k));
  return `${parseFloat((size / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
};

const ItemCard = ({ file, onClick }) => (
  <div className="item-card" onClick={onClick}>
    <div className="icon">
      {file.type === "directory" ? (
        <img src={folderIcon} alt="folder icon" className="folder-icon" />
      ) : (
        <img src={fileIcon} alt="file icon" className="file-icon" />
      )}
    </div>
    <strong className="name">{file.name}</strong>
    {file.type === "file" && <p className="size">{formatFileSize(file.size)}</p>}
  </div>
);

export default ItemCard;
