import { useState, useEffect } from "react";
import "./App.css";

// Import our custom sub-components
import Navigation from "./components/Navigation";
import BehaviorLog from "./components/BehaviorLog";
import AddKitten from "./components/AddKitten";
import AddTamer from "./components/AddTamer";

function App() {
  const [activeView, setActiveView] = useState("logSession"); 
  const [kittenOptions, setKittenOptions] = useState([]);
  const [tamerOptions, setTamerOptions] = useState([]);
  const [isLoadingOptions, setIsLoadingOptions] = useState(true);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwaZWSll8pewi0iyr9i7ihnfpm9k1Fespi9mylZYv3Z9TDXc0k06DL80A1Fy_SCiNR6iw/exec";

  // Fetch current database entries when the app displays
  useEffect(() => {
    async function fetchDropdownOptions() {
      try {
        setIsLoadingOptions(true);
        const response = await fetch(GOOGLE_SCRIPT_URL);
        const data = await response.json();
        if (data.kittens) setKittenOptions(data.kittens);
        if (data.tamers) setTamerOptions(data.tamers);
      } catch (error) {
        console.error("Error downloading options from Google Sheets:", error);
      } finally {
        setIsLoadingOptions(false);
      }
    }
    fetchDropdownOptions();
  }, [isSubmitted, activeView]); 

  // Success view block
  if (isSubmitted) {
    return (
      <main className="page">
        <section className="card" style={{ textAlign: "center", padding: "60px 40px" }}>
          <div style={{ fontSize: "4rem", marginBottom: "20px" }}>🐾</div>
          <h1>Thank You!</h1>
          <p style={{ color: "var(--text-muted)", marginBottom: "32px" }}>
            Your session data has been safely logged in your spreadsheet view.
          </p>
          <button onClick={() => setIsSubmitted(false)} className="submit-btn" style={{ width: "auto" }}>
            Log Another Session
          </button>
        </section>
      </main>
    );
  }

  return (
    <main className="page">
      <div className="bubble bubble-1"></div>
      <div className="bubble bubble-2"></div>
      <div className="bubble bubble-3"></div>

      <div className="app-container">
        <header className="app-header">
          <h1>Tiny Lions</h1>
          <p className="app-subtitle">log behavior, check status, add kittens/tamers, and...not much else</p>
        </header>

        {/* Render Navigation component */}
        <Navigation activeView={activeView} setActiveView={setActiveView} />

        <section className="card">
          {/* Dynamically render the form sub-component chosen by the tabs view */}
          {activeView === "logSession" && (
            <BehaviorLog 
              kittenOptions={kittenOptions} 
              tamerOptions={tamerOptions} 
              isLoadingOptions={isLoadingOptions} 
              GOOGLE_SCRIPT_URL={GOOGLE_SCRIPT_URL}
              setIsSubmitted={setIsSubmitted}
            />
          )}

          {activeView === "addKitten" && (
            <AddKitten GOOGLE_SCRIPT_URL={GOOGLE_SCRIPT_URL} setActiveView={setActiveView} />
          )}

          {activeView === "addTamer" && (
            <AddTamer GOOGLE_SCRIPT_URL={GOOGLE_SCRIPT_URL} setActiveView={setActiveView} />
          )}
        </section>
      </div>
    </main>
  );
}
 export default App;