import React, { createContext, useState, useEffect } from "react";

export const JobContext = createContext();

export const JobProvider = ({ children }) => {
  const [jobs, setJobs] = useState([]);

  const addJob = (job) => {
    setJobs((prevJobs) => [...prevJobs, job]);
  };

  const updateJob = (jobId, updates) => {
    setJobs((prevJobs) =>
      prevJobs.map((job) =>
        job.id === jobId ? { ...job, ...updates } : job
      )
    );

    if (updates.status === "completed") {
      setTimeout(() => {
        removeJob(jobId);
      }, 10000);
    }
  };

  const removeJob = (jobId) => {
    setJobs((prevJobs) => prevJobs.filter((job) => job.id !== jobId));
  };

  return (
    <JobContext.Provider value={{ jobs, addJob, updateJob, removeJob }}>
      {children}
    </JobContext.Provider>
  );
};
