import { useState, useEffect } from "react";
import "./App.css";

import Navigation from "./components/navigation";
import BehaviorLog from "./components/behaviorlog";
import CheckStatus from "./components/checkstatus";
import AdminPanel from "./components/adminpanel";

const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbziFeuD7x0Qqd2inFoaLZdqT-xZbjgIVkVefZf5iaSAoDs47YhNI21CNSNbOs6WHwWR/exec";
const ADMIN_PASSWORD = "kittenparty";

function App() {
  const [activeView, setActiveView] = useState("logSession");
  const [activeKittenOptions, setActiveKittenOptions] = useState([]);
  const [allKittenOptions, setAllKittenOptions] = useState([]);
  const [tamerOptions, setTamerOptions] = useState([]);
  const [isLoadingOptions, setIsLoadingOptions] = useState(true);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [catShower, setCatShower] = useState([]);

  // Admin state
  const [showAdminPrompt, setShowAdminPrompt] = useState(false);
  const [adminUnlocked, setAdminUnlocked] = useState(false);
  const [adminPasswordInput, setAdminPasswordInput] = useState("");
  const [adminPasswordError, setAdminPasswordError] = useState(false);

  // Fetch dropdown data once on mount only
  useEffect(() => {
    fetchDropdownOptions();
  }, []);

  async function fetchDropdownOptions() {
    try {
      setIsLoadingOptions(true);
      const response = await fetch(GOOGLE_SCRIPT_URL);
      const data = await response.json();
      if (data.activeKittens) setActiveKittenOptions(data.activeKittens);
      if (data.allKittens) setAllKittenOptions(data.allKittens.map(k => typeof k === "string" ? k : k.name));
      if (data.tamers) setTamerOptions(data.tamers);
    } catch (error) {
      console.error("Error fetching dropdown options:", error);
    } finally {
      setIsLoadingOptions(false);
    }
  }

  // Cat shower on submission
  useEffect(() => {
    if (!isSubmitted) return setCatShower([]);
    const freshCats = Array.from({ length: 45 }).map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 0.8,
      duration: 0.6 + Math.random() * 1.7,
      size: 1.5 + Math.random() * 2,
      spin: Math.random() > 0.5 ? 360 : -360
    }));
    setCatShower(freshCats);
  }, [isSubmitted]);

  // Clear submission state when switching tabs
  function handleSetActiveView(view) {
    setIsSubmitted(false);
    setActiveView(view);
  }

  // Admin unlock
  function handleAdminClick() {
    if (adminUnlocked) {
      setActiveView("admin");
      return;
    }
    setShowAdminPrompt(true);
  }

  function handleAdminSubmit(e) {
    e.preventDefault();
    if (adminPasswordInput === ADMIN_PASSWORD) {
      setAdminUnlocked(true);
      setShowAdminPrompt(false);
      setAdminPasswordInput("");
      setAdminPasswordError(false);
      setActiveView("admin");
    } else {
      setAdminPasswordError(true);
      setAdminPasswordInput("");
    }
  }

  return (
    <main className="page">
      {/* Cat shower */}
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

      {/* Admin password prompt */}
      {showAdminPrompt && (
        <div className="admin-overlay" onClick={() => setShowAdminPrompt(false)}>
          <form
            className="admin-prompt"
            onClick={(e) => e.stopPropagation()}
            onSubmit={handleAdminSubmit}
          >
            <p className="admin-prompt-label">admin password</p>
            <input
              type="password"
              value={adminPasswordInput}
              onChange={(e) => {
                setAdminPasswordInput(e.target.value);
                setAdminPasswordError(false);
              }}
              placeholder="••••••••••••"
              autoFocus
            />
            {adminPasswordError && (
              <p className="admin-error">incorrect password</p>
            )}
            <button type="submit">enter</button>
          </form>
        </div>
      )}

      {/* Admin corner button */}
      <button
        className={`admin-corner-btn ${activeView === "admin" ? "active" : ""}`}
        onClick={handleAdminClick}
        aria-label="Admin panel"
      >
        <img
          src="/asaplogo.png"
          alt=""
          className="admin-corner-logo"
        />
      </button>

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

        {activeView !== "admin" && (
          <Navigation activeView={activeView} setActiveView={handleSetActiveView} />
        )}

        <section className="card">
          {activeView === "admin" ? (
            <AdminPanel
              GOOGLE_SCRIPT_URL={GOOGLE_SCRIPT_URL}
              activeKittenOptions={activeKittenOptions}
              isLoadingOptions={isLoadingOptions}
              onDataChange={fetchDropdownOptions}
              onExit={() => handleSetActiveView("logSession")}
            />
          ) : isSubmitted ? (
            <div className="card-submission-success">
              <h2>Thank You!</h2>
              <p>Your session data has been logged.</p>
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