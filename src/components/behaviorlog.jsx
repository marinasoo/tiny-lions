import React, { useState } from "react";

export default function BehaviorLog({ kittenOptions, tamerOptions, isLoadingOptions, GOOGLE_SCRIPT_URL, setIsSubmitted }) {
  const [kittenName, setKittenName] = useState("");
  const [tamerName, setTamerName] = useState("");
  const [notes, setNotes] = useState("");
  const [behaviors, setBehaviors] = useState([]);

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

  async function handleSessionSubmit(event) {
    event.preventDefault();
    const formData = {
      type: "session",
      kittenName,   
      tamerName,     
      behaviors,  
      notes           
    };

    try {
      await fetch(GOOGLE_SCRIPT_URL, {
        method: "POST",
        mode: "no-cors", 
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      setIsSubmitted(true);
    } catch (error) {
      console.error(error);
      alert("Something went wrong saving the session.");
    }
  }

  return (
    <>
      <form onSubmit={handleSessionSubmit} className="session-form">
        <div className="form-top-row">
          <label>
            kitten
            <select value={kittenName} onChange={(e) => setKittenName(e.target.value)} disabled={isLoadingOptions}>
              <option value="">{isLoadingOptions ? "fetching kittens..." : "choose a kitten"}</option>
              {kittenOptions.map(name => <option key={name} value={name}>{name}</option>)}
            </select>
          </label>

          <label>
            tamer
            <select value={tamerName} onChange={(e) => setTamerName(e.target.value)} disabled={isLoadingOptions}>
              <option value="">{isLoadingOptions ? "fetching tamers..." : "choose a tamer"}</option>
              {tamerOptions.map(name => <option key={name} value={name}>{name}</option>)}
            </select>
          </label>
        </div>

        <div className="form-behaviors-section">
          <p className="field-title">behaviors observed</p>
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
            notes
            <textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="how did the session go?" />
          </label>
        </div>
        <button type="submit">save session</button>
      </form>
    </>
  );
}