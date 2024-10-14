import React from 'react';
import '../styles/upload-status.css';

const UploadStatus = ({ uploadedCount, totalCount, currentFileName, currentFileSize }) => {
  const percentageUploaded = totalCount > 0 ? Math.round((uploadedCount / totalCount) * 100) : 0;

  function handleCancelUpload() {
  }

  return (
    <div className="upload-status">
      <p>
        {uploadedCount}/{totalCount} | {percentageUploaded}%
      </p>
      <div className="progress-bar">
        <div className="progress-line" style={{ width: `${percentageUploaded}%` }} />
      </div>
      <div className="file-info-and-cancel-button">
        <span>{currentFileName || 'No file being uploaded'} | {currentFileSize || '0 '} bytes</span>
        <label className="cancel-button" onClick={handleCancelUpload}>
          Cancel Upload
        </label>
      </div>
    </div>
  );
};

export default UploadStatus;
