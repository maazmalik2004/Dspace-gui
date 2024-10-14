import React, { useState, useContext } from "react";
import { AppStateContext } from "../context/AppStateContext";
import { JobContext } from "../context/JobContext";
import "../styles/status-panel.css";

const StatusPanel = () => {
  const {isLoading} = useContext(AppStateContext);
  const { jobs } = useContext(JobContext);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleToggle = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div className="status-panel">
      <h3 onClick={handleToggle} className="panel-header">
        Status
        <span className="toggle-arrow">{isCollapsed ? "▼" : "▲"}</span>
      </h3>

      {isLoading && (
        <div className="loading-bar">
          <div className="loading-indicator"></div>
        </div>
      )}

      <div
        className={`jobs-container ${isCollapsed ? "collapsed" : ""}`}
        style={{
          maxHeight: isCollapsed ? "0" : "500px",
          transition: "max-height 0.3s ease-in-out, padding 0.3s ease-in-out",
          overflow: "hidden",
        }}
      >
        {jobs.map((job, index) => (
          <div
            key={job.id}
            className={`job-item ${index % 2 === 0 ? "gray-background" : ""}`}
          >
            <div className="job-type">
              <strong>{job.type.toUpperCase()} </strong>
            </div>
            <div className="job-name">{job.itemname}</div>
            <div className="job-identifier">{job.id}</div>
            <div className="job-status">{job.status}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StatusPanel;
