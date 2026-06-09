import { useState, useEffect } from "react";
import "./App.css";

import Navigation from "./components/navigation";
import BehaviorLog from "./components/behaviorlog";
import CheckStatus from "./components/checkstatus";

const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzN_OGa_e3DG_-jJQeDW-fjpohC5Wz9rifZGeoJYjNgmqyJ3fN3-VbX7ciMPB6vjK5G2w/exec";

function App() {
  const [activeView, setActiveView] = useState("logSession"); 
  const [activeKittenOptions, setActiveKittenOptions] = useState([]);
  const [allKittenOptions, setAllKittenOptions] = useState([]);
  const [tamerOptions, setTamerOptions] = useState([]);
  const [isLoadingOptions, setIsLoadingOptions] = useState(true);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [catShower, setCatShower] = useState([]);

  // Handles API Fetching AND auto-clearing submission view when switching tabs
  useEffect(() => {
    setIsSubmitted(false);

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
  }, [activeView]);

  // Handles generating the high-speed PNG cat shower arrays upon submission
  useEffect(() => {
    if (!isSubmitted) return setCatShower([]);

    const freshCats = Array.from({ length: 45 }).map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 0.8,
      duration: 0.6 + Math.random() * 1.7, // Faster physics values
      size: 1.5 + Math.random() * 2,
      spin: Math.random() > 0.5 ? 360 : -360
    }));
    
    setCatShower(freshCats);
  }, [isSubmitted]);

  return (
    <main className="page">
      {isSubmitted && (
        <div className="custom-cat-shower">
          {catShower.map((cat) => (
            <img
              key={cat.id}
              src="/asaplogo.png"
              alt="falling cat"
              className="falling-cat-guy"
              style={{
                left: `${cat.left}%`,
                animationDelay: `${cat.delay}s`,
                animationDuration: `${cat.duration}s`,
                width: `${cat.size * 20}px`,
                height: "auto",
                "--spin-deg": `${cat.spin}deg`
              }}
            />
          ))}
        </div>
      )}

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

        <section className="card">
          {isSubmitted ? (
            <div className="card-submission-success" style={{ textAlign: 'center', padding: '40px 0' }}>
              <h2>Thank You!</h2>
              <p style={{ marginBottom: '24px' }}>Your session data has been logged.</p>
              <button onClick={() => setIsSubmitted(false)} className="submit-btn">
                log another session
              </button>
            </div>
          ) : (
            <>
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
            </>
          )}
        </section>
      </section>
    </main>
  );
}

export default App;