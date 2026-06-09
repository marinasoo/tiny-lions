import { useState, useEffect } from "react";
import "./App.css";

// Import standalone workspace sub-components
import Navigation from "./components/navigation";
import BehaviorLog from "./components/behaviorlog";
import CheckStatus from "./components/checkstatus";

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
    <main className="page">
      <section className="app-shell" aria-label="Tiny Lions workspace">
        <header className="app-header">
          <h1>Tiny Lions<sup>TM</sup></h1>
          <p className="noun">noun</p>
          <p className="definition">
            :a kitten that is under-socialized and requires time,
            <br />
            patience, and a calm approach so they learn to trust humans.
          </p>
        </header>

        <Navigation activeView={activeView} setActiveView={setActiveView} />

        {isSubmitted ? (
          <section className="card success-card">
            <h2>Thank You!</h2>
            <p>Your session data has been logged.</p>
            <button onClick={() => setIsSubmitted(false)} className="submit-btn">
              log another session
            </button>
          </section>
        ) : (
          <section className="card">
            {activeView === "logSession" && (
              <BehaviorLog 
                kittenOptions={activeKittenOptions} 
                tamerOptions={tamerOptions} 
                isLoadingOptions={isLoadingOptions} 
                GOOGLE_SCRIPT_URL={GOOGLE_SCRIPT_URL}
                setIsSubmitted={setIsSubmitted}
              />
            )}

            {activeView === "checkStatus" && (
              <CheckStatus 
                kittenOptions={allKittenOptions}
                isLoadingOptions={isLoadingOptions}
                GOOGLE_SCRIPT_URL={GOOGLE_SCRIPT_URL}
              />
            )}

            {activeView === "resources" && (
              <div className="resources-placeholder">
                <p>resources coming soon</p>
              </div>
            )}
          </section>
        )}
      </section>
    </main>
  );
}

export default App;
