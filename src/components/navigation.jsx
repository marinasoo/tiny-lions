export default function Navigation({ activeView, setActiveView }) {
  return (
    <div className="floating-nav-container">
      <button 
        type="button"
        onClick={() => setActiveView("logSession")}
        className={`nav-tab ${activeView === "logSession" ? "active" : "inactive"}`}
      >
        Log Session
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
        onClick={() => setActiveView("resources")}
        className={`nav-tab ${activeView === "resources" ? "active" : "inactive"}`}
      >
        Resources
      </button>
    </div>
  );
}
