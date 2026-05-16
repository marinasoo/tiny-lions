import { useState } from "react";
import "./App.css";

function App() {
  // Navigation View state: "logSession", "addKitten", or "addTamer"
  const [activeView, setActiveView] = useState("logSession"); 

  // Core Form States (Session Log)
  const [kittenName, setKittenName] = useState("");
  const [tamerName, setTamerName] = useState("");
  const [notes, setNotes] = useState("");
  const [behaviors, setBehaviors] = useState([]);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // New Kitten Form States
  const [newKittenName, setNewKittenName] = useState("");
  const [intakeDate, setIntakeDate] = useState("");
  const [isGrouped, setIsGrouped] = useState(false);
  const [groupMembers, setGroupMembers] = useState("");

  // New Tamer Form State
  const [newTamerName, setNewTamerName] = useState("");

  const tamerOptions = ["Marina", "Anastasia", "Nicole", "Athena", "Lauren"];
  const kittenOptions = ["Chicken", "Wren", "Finch", "Rey", "Chewy"];

  const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbx9n2sXoQh8j3mL7kKZt1e5n9vVqjHqgXlLh0a/exec";

  // --- SUBMIT 1: LOG A SOCIALIZATION SESSION ---
  async function handleSessionSubmit(event) {
    event.preventDefault();
    const formData = {
      type: "session",
      kittenName: kittenName,   
      tamerName: tamerName,     
      behaviors: behaviors,  
      notes: notes           
    };

    try {
      await fetch(GOOGLE_SCRIPT_URL, {
        method: "POST",
        mode: "no-cors", 
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      setIsSubmitted(true);
      setNotes("");
      setBehaviors([]);
      setKittenName("");
      setTamerName("");
    } catch (error) {
      console.error(error);
      alert("❌ Something went wrong saving the session.");
    }
  }

  // --- SUBMIT 2: REGISTER A NEW KITTEN ---
  async function handleNewKittenSubmit(event) {
    event.preventDefault();
    if (!newKittenName || !intakeDate) {
      alert("Please fill out the Kitten Name and Intake Date!");
      return;
    }

    const kittenData = {
      type: "newKitten",
      kittenName: newKittenName,
      intakeDate: intakeDate,
      isGrouped: isGrouped,
      groupMembers: isGrouped ? groupMembers : ""
    };

    try {
      await fetch(GOOGLE_SCRIPT_URL, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(kittenData),
      });

      alert(`🐾 ${newKittenName} has been successfully added to the Master List!`);
      
      setNewKittenName("");
      setIntakeDate("");
      setIsGrouped(false);
      setGroupMembers("");
      setActiveView("logSession"); 
    } catch (error) {
      console.error(error);
      alert("❌ Something went wrong registering the kitten.");
    }
  }

  // --- SUBMIT 3: REGISTER A NEW TAMER ---
  async function handleNewTamerSubmit(event) {
    event.preventDefault();
    if (!newTamerName.trim()) {
      alert("Please enter a tamer name!");
      return;
    }

    const tamerData = {
      type: "newTamer",
      tamerName: newTamerName
    };

    try {
      await fetch(GOOGLE_SCRIPT_URL, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(tamerData),
      });

      alert(`👋 ${newTamerName} has been added as an authorized Tamer!`);
      setNewTamerName("");
      setActiveView("logSession");
    } catch (error) {
      console.error(error);
      alert("❌ Something went wrong registering the tamer.");
    }
  }

  const behaviorOptions = [
    "hissing", "hiding", "eats from chopstick", "eats from hand",
    "comes to front w/ encouragement", "comes to front w/o encouragement",
    "stays up front w/ door open", "plays", "able to pet", "able to pick up or hold"
  ];

  function toggleBehavior(behavior) {
    if (behaviors.includes(behavior)) {
      setBehaviors(behaviors.filter((item) => item !== behavior));
    } else {
      setBehaviors([...behaviors, behavior]);
    }
  }

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
          <p className="app-subtitle">
            The premiere tiny lion tracking site of Santa Barbara County
          </p>
        </header>

        {/* FLOATING GLASS TABS BAR CONTAINER */}
        <div className="floating-nav-container">
          <button 
            type="button"
            onClick={() => setActiveView("logSession")}
            className={`nav-tab ${activeView === "logSession" ? "active" : "inactive"}`}
          >
            📝 Behavior Log
          </button>
          <button 
            type="button"
            onClick={() => setActiveView("addKitten")}
            className={`nav-tab ${activeView === "addKitten" ? "active" : "inactive"}`}
          >
            🦁 New Lion
          </button>
          <button 
            type="button"
            onClick={() => setActiveView("addTamer")}
            className={`nav-tab ${activeView === "addTamer" ? "active" : "inactive"}`}
          >
           🧍 New Tamer
          </button>
        </div>

        <section className="card">
          {activeView === "logSession" && (
            <>
              <h2 className="workspace-heading">Behavior Log</h2>
              <form onSubmit={handleSessionSubmit} className="session-form">
                <div className="form-top-row">
                  <label>
                    Kitten
                    <select value={kittenName} onChange={(event) => setKittenName(event.target.value)}>
                      <option value="">choose a kitten</option>
                      {kittenOptions.map(name => <option key={name} value={name}>{name}</option>)}
                    </select>
                  </label>

                  <label>
                    Tamer
                    <select value={tamerName} onChange={(event) => setTamerName(event.target.value)}>
                      <option value="">choose a tamer</option>
                      {tamerOptions.map(name => <option key={name} value={name}>{name}</option>)}
                    </select>
                  </label>
                </div>

                <div className="form-behaviors-section">
                  <p className="field-title">Behaviors observed</p>
                  <div className="checkbox-grid">
                    {behaviorOptions.map((behavior) => (
                      <label key={behavior}>
                        <input type="checkbox" checked={behaviors.includes(behavior)} onChange={() => toggleBehavior(behavior)} />
                        <span className="checkbox-label">{behavior}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="form-notes-section">
                  <label>
                    Notes
                    <textarea value={notes} onChange={(event) => setNotes(event.target.value)} placeholder="how did the session go?" />
                  </label>
                </div>

                <button type="submit">Save session</button>
              </form>
            </>
          )}

          {activeView === "addKitten" && (
            <>
              <h2 className="workspace-heading">Add Kitten</h2>
              <form onSubmit={handleNewKittenSubmit} className="kitten-form">
                <label>
                  Kitten Name
                  <input 
                    type="text" 
                    value={newKittenName} 
                    onChange={(e) => setNewKittenName(e.target.value)} 
                    placeholder="e.g. belluscious"
                  />
                </label>

                <label>
                  Date of Intake
                  <input 
                    type="date" 
                    value={intakeDate} 
                    onChange={(e) => setIntakeDate(e.target.value)} 
                  />
                </label>

                <div className="sibling-panel">
                  <input 
                    type="checkbox" 
                    id="grouped"
                    checked={isGrouped} 
                    onChange={(e) => setIsGrouped(e.target.checked)} 
                  />
                  <label htmlFor="grouped">
                    Is this kitten grouped with siblings?
                  </label>
                </div>

                {isGrouped && (
                  <label style={{ gridColumn: "1 / -1" }}>
                    Group Member Names
                    <input 
                      type="text" 
                      value={groupMembers} 
                      onChange={(e) => setGroupMembers(e.target.value)} 
                      placeholder="e.g. Gravy, Waffles"
                    />
                  </label>
                )}

                <button type="submit">
                  Register Kitten
                </button>
              </form>
            </>
          )}

          {activeView === "addTamer" && (
            <>
              <h2 className="workspace-heading">Add Tamer</h2>
              <form onSubmit={handleNewTamerSubmit} className="tamer-form">
                <label>
                  Tamer Name
                  <input 
                    type="text" 
                    value={newTamerName} 
                    onChange={(e) => setNewTamerName(e.target.value)} 
                    placeholder="e.g. Kitty"
                  />
                </label>

                <button type="submit">
                  Register Tamer
                </button>
              </form>
            </>
          )}
        </section>
      </div>
    </main>
  );
}

export default App;