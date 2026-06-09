import { useState } from "react";

export default function BehaviorLog({ kittenOptions, tamerOptions, isLoadingOptions, GOOGLE_SCRIPT_URL, setIsSubmitted }) {
  const [kittenName, setKittenName] = useState("");
  const [tamerName, setTamerName] = useState("");
  const [notes, setNotes] = useState("");
  const [behaviors, setBehaviors] = useState([]);

  const behaviorOptions = [
    "hisses", "hides", "chopstick", "finger",
    "approach - encouraged", "approach - freely",
    "stays up front", "plays", "can pet", "can pick up"
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
        <p className="intro-copy">
          We have a very specific set of procedures that we use to gain the kittens
          trust and to eventually seek out attention. It is a very rewarding
          experience seeing these little kittens go from being terrified and
          hissing at us to sitting on our laps and purring and sending them off to
          a home.
        </p>

        <div className="form-top-row">
          <label>
            kitten
            <select value={kittenName} onChange={(e) => setKittenName(e.target.value)} disabled={isLoadingOptions}>
              <option value="">{isLoadingOptions ? "fetching kittens..." : "e.g. Artemis"}</option>
              {kittenOptions.map(name => <option key={name} value={name}>{name}</option>)}
            </select>
          </label>

          <label>
            tamer
            <select value={tamerName} onChange={(e) => setTamerName(e.target.value)} disabled={isLoadingOptions}>
              <option value="">{isLoadingOptions ? "fetching tamers..." : "e.g. Athena"}</option>
              {tamerOptions.map(name => <option key={name} value={name}>{name}</option>)}
            </select>
          </label>
        </div>

        <div className="form-behaviors-section">
          <p className="field-title">observed behaviors</p>
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
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="how was your interaction today? about how long did you spend with the kitten? any toys that they particularly like?"
            />
          </label>
        </div>
        <button type="submit">submit</button>
      </form>
    </>
  );
}
