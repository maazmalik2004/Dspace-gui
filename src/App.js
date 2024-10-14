import React from "react";
import "./App.css";
import SidePanel from "./components/SidePanel";
import MainPanel from "./components/MainPanel";
import UploadStatus from "./components/UploadStatus";
import { AppStateProvider } from './context/AppStateContext';
import { JobProvider } from "./context/JobContext";

const App = () => {

  return (
    <AppStateProvider>
    <JobProvider>
    <div className="container">
      <SidePanel />
      <div className="working-area">
      {/*<UploadStatus uploadedCount="90" totalCount="123" currentFileName="aalugobi.txt" currentFileSize="1024" />*/}
      <MainPanel/>
      </div>
    </div>
    </JobProvider>
    </AppStateProvider>
  );
};

export default App;
