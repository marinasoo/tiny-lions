import { useState, useEffect } from "react";
import "./App.css";

// Import standalone workspace sub-components
import Navigation from "./components/navigation";
import BehaviorLog from "./components/behaviorlog";
import CheckStatus from "./components/checkstatus";
import AddKitten from "./components/addkitten";
import AddTamer from "./components/addtamer";

function App() {
  const [activeView, setActiveView] = useState("logSession"); 
  const [kittenOptions, setKittenOptions] = useState([]);
  const [tamerOptions, setTamerOptions] = useState([]);
  const [isLoadingOptions, setIsLoadingOptions] = useState(true);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // webhook link
  const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwaZWSll8pewi0iyr9i7ihnfpm9k1Fespi9mylZYv3Z9TDXc0k06DL80A1Fy_SCiNR6iw/exec";

  // downloads fresh dropdown arrays for kittens/tamers
  useEffect(() => {
    async function fetchDropdownOptions() {
      try {
        setIsLoadingOptions(true);
        const response = await fetch(GOOGLE_SCRIPT_URL);
        const data = await response.json();
        if (data.kittens) setKittenOptions(data.kittens);
        if (data.tamers) setTamerOptions(data.tamers);
      } catch (error) {
        console.error("Error connecting to Google Sheets data endpoint:", error);
      } finally {
        setIsLoadingOptions(false);
      }
    }
    fetchDropdownOptions();
  }, [isSubmitted, activeView]);

  if (isSubmitted) {
    return (
      <main className="page">
        <section className="card" style={{ textAlign: "center", padding: "60px 40px" }}>
          <div style={{ fontSize: "4rem", marginBottom: "20px" }}></div>
          <h1>Thank You!</h1>
          <p style={{ color: "var(--text-muted)", marginBottom: "32px" }}>
            Your session data has been safely logged in your spreadsheet view.
          </p>
          <button onClick={() => setIsSubmitted(false)} className="submit-btn" style={{ width: "auto" }}>
            log another session
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
          <p className="app-subtitle">log behavior, check status, and add kittens/tamers for ASAP cats</p>
        </header>

        {/* navigation bar */}
        <Navigation activeView={activeView} setActiveView={setActiveView} />

        <section className="card">
          {/* log a training session */}
          {activeView === "logSession" && (
            <BehaviorLog 
              kittenOptions={kittenOptions} 
              tamerOptions={tamerOptions} 
              isLoadingOptions={isLoadingOptions} 
              GOOGLE_SCRIPT_URL={GOOGLE_SCRIPT_URL}
              setIsSubmitted={setIsSubmitted}
            />
          )}

          {/* look up kitten's history and past training sessions */}
          {activeView === "checkStatus" && (
            <CheckStatus 
              kittenOptions={kittenOptions}
              isLoadingOptions={isLoadingOptions}
              GOOGLE_SCRIPT_URL={GOOGLE_SCRIPT_URL}
            />
          )}

          {/* register new kitten */}
          {activeView === "addKitten" && (
            <AddKitten GOOGLE_SCRIPT_URL={GOOGLE_SCRIPT_URL} setActiveView={setActiveView} />
          )}

          {/* register new tamer */}
          {activeView === "addTamer" && (
            <AddTamer GOOGLE_SCRIPT_URL={GOOGLE_SCRIPT_URL} setActiveView={setActiveView} />
          )}
        </section>
      </div>
    </main>
  );
}

export default App;
