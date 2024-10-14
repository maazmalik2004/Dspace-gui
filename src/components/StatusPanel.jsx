import React, { useContext } from "react";
import { JobContext } from "../context/JobContext";

const StatusPanel = () => {
  const { jobs } = useContext(JobContext);

  return (
    <div className="status-panel">
      <h3>Current Jobs</h3>
      <ul>
        {jobs.map((job) => (
          <li key={job.id}>
            <strong>{job.type.toUpperCase()}:</strong> {job.filename} - {job.status}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default StatusPanel;
