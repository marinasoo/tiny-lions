import { useState, useEffect } from "react";
import "./App.css";

// Import standalone workspace sub-components
import Navigation from "./components/Navigation";
import BehaviorLog from "./components/BehaviorLog";
import CheckStatus from "./components/CheckStatus";
import AddKitten from "./components/AddKitten";
import AddTamer from "./components/AddTamer";

function App() {
  const [activeView, setActiveView] = useState("logSession"); 
  const [activeKittenOptions, setActiveKittenOptions] = useState([]);
  const [allKittenOptions, setAllKittenOptions] = useState([]);
  const [tamerOptions, setTamerOptions] = useState([]);
  const [isLoadingOptions, setIsLoadingOptions] = useState(true);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzN_OGa_e3DG_-jJQeDW-fjpohC5Wz9rifZGeoJYjNgmqyJ3fN3-VbX7ciMPB6vjK5G2w/exec";

  useEffect(() => {
    async function fetchDropdownOptions() {
      try {
        setIsLoadingOptions(true);
        const response = await fetch(GOOGLE_SCRIPT_URL);
        const data = await response.json();

        if (data.activeKittens) setActiveKittenOptions(data.activeKittens);
        if (data.allKittens) setAllKittenOptions(data.allKittens);
        if (data.tamers) setTamerOptions(data.tamers);
      } catch (error) {
        console.error("Error connecting to Google Sheets data endpoint:", error);
      } finally {
        setIsLoadingOptions(false);
      }
    }
    fetchDropdownOptions();
  }, [isSubmitted, activeView]);

  return (
    <main className="page" style={{ 
      height: "100vh", 
      display: "flex", 
      flexDirection: "column",
      overflow: "hidden", // Prevents the whole browser screen from scrolling blindly
      boxSizing: "border-box"
    }}>
      
      {/* FIXED MASTER APPLICATION CROWN CONTAINER */}
      <div style={{
        position: "sticky",
        top: 0,
        zIndex: 100,
        background: "linear-gradient(to bottom, rgba(255, 255, 255, 0) 85%, rgba(255,255,255,0) 100%)",
        padding: "30px 20px 15px 20px",
        display: "grid",
        gap: "12px",
        justifyItems: "center",
        width: "100%",
        boxSizing: "border-box"
      }}>
        {/* APP BRAND HEADER ROW */}
        <header className="app-header" style={{ 
          display: "flex", 
          alignItems: "center", 
          justifyContent: "center", 
          gap: "16px",
          margin: 0
        }}>
          <img src="/asaplogoround.png" className="app-logo" alt="Logo" style={{ height: "45px", width: "45px" }} />
          <h1 style={{ margin: 0, fontSize: "2.25rem", fontWeight: 800 }}>Tiny Lions</h1>
          <img src="/asaplogoround.png" className="app-logo" alt="Logo" style={{ height: "45px", width: "45px" }} />
        </header>
        
        {/* PERSISTENT SUBTITLE */}
        <p className="app-subtitle" style={{ margin: 0, color: "var(--text-muted)", fontSize: "0.95rem", fontWeight: 500 }}>
          Log behavior, check status, and manage kittens or tamers for ASAP Cats
        </p>

        {/* PERSISTENT NAVIGATION CONTROLS */}
        <div style={{ width: "100%", maxWidth: "650px", marginTop: "8px" }}>
          <Navigation activeView={activeView} setActiveView={setActiveView} />
        </div>
      </div>

      {/* 💡 SCROLLABLE COMPONENT DASHBOARD VIEWPORT CONTAINER */}
      <div style={{ 
        flex: 1, 
        overflowY: "auto", // Allows only this workspace to scroll vertically
        padding: "10px 20px 40px 20px",
        width: "100%",
        boxSizing: "border-box",
        display: "flex",
        justifyContent: "center"
      }}>
        <div style={{ width: "100%", maxWidth: "700px" }}>
          
          {isSubmitted ? (
            <section className="card" style={{ textAlign: "center", padding: "60px 40px" }}>
              <div style={{ fontSize: "4rem", marginBottom: "20px" }}>🎉</div>
              <h1 style={{ margin: "0 0 12px 0" }}>Thank You!</h1>
              <p style={{ color: "var(--text-muted)", marginBottom: "32px" }}>
                Your session data has been safely logged in your spreadsheet view.
              </p>
              <button onClick={() => setIsSubmitted(false)} className="submit-btn" style={{ width: "auto" }}>
                Log Another Session
              </button>
            </section>
          ) : (
            <section className="card" style={{ 
              background: "#ffffff",
              border: "1px solid rgba(0, 0, 0, 0.08)",
              borderRadius: "16px",
              padding: "32px 24px",
              boxShadow: "0 10px 30px rgba(0,0,0,0.02)",
              width: "100%",
              boxSizing: "border-box"
            }}>
              {/* LOG ACTIVE TRAINING SESSION VIEW */}
              {activeView === "logSession" && (
                <BehaviorLog 
                  kittenOptions={activeKittenOptions} 
                  tamerOptions={tamerOptions} 
                  isLoadingOptions={isLoadingOptions} 
                  GOOGLE_SCRIPT_URL={GOOGLE_SCRIPT_URL}
                  setIsSubmitted={setIsSubmitted}
                />
              )}

              {/* HISTORICAL PROGRESS LOOKUP VIEW */}
              {activeView === "checkStatus" && (
                <CheckStatus 
                  kittenOptions={allKittenOptions}
                  isLoadingOptions={isLoadingOptions}
                  GOOGLE_SCRIPT_URL={GOOGLE_SCRIPT_URL}
                />
              )}

              {/* REGISTER A NEW KITTEN ENTRY VIEW */}
              {activeView === "addKitten" && (
                <AddKitten GOOGLE_SCRIPT_URL={GOOGLE_SCRIPT_URL} setActiveView={setActiveView} />
              )}

              {/* REGISTER A NEW TAMER ACCOUNT VIEW */}
              {activeView === "addTamer" && (
                <AddTamer GOOGLE_SCRIPT_URL={GOOGLE_SCRIPT_URL} setActiveView={setActiveView} />
              )}
            </section>
          )}
          
        </div>
      </div>
      
    </main>
  );
}

export default App;