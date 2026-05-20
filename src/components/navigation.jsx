import React from "react";

export default function Navigation({ activeView, setActiveView }) {
  return (
    <div className="floating-nav-container">
      <button 
        type="button"
        onClick={() => setActiveView("logSession")}
        className={`nav-tab ${activeView === "logSession" ? "active" : "inactive"}`}
      >
        Behavior Log
      </button>
      <button 
        type="button"
        onClick={() => setActiveView("checkStatus")}
        className={`nav-tab ${activeView === "checkStatus" ? "active" : "inactive"}`}
      >
        Check Status
      </button>
      <button 
        type="button"
        onClick={() => setActiveView("addKitten")}
        className={`nav-tab ${activeView === "addKitten" ? "active" : "inactive"}`}
      >
        Add Kitten
      </button>
      <button 
        type="button"
        onClick={() => setActiveView("addTamer")}
        className={`nav-tab ${activeView === "addTamer" ? "active" : "inactive"}`}
      >
        Add Tamer
      </button>
    </div>
  );
}