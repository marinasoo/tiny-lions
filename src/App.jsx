import { useState } from "react";
import "./App.css";

function App() {
  // Your actual state variables
  const [kittenName, setKittenName] = useState("");
  const [tamerName, setTamerName] = useState("");
  const [notes, setNotes] = useState("");
  const [behaviors, setBehaviors] = useState([]);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const tamerOptions = ["Marina", "Anastasia", "Nicole", "Athena", "Lauren"];
  const kittenOptions = ["Chicken", "Wren", "Finch", "Rey", "Chewy"];

  async function handleSubmit(event) {
    event.preventDefault();

    const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwnrtVjG5pPMmuVTQPh1qEYw9ODaeN5bo1N6h_XXDNtkwHcd6hciek74IfNkfrhyrXnXg/exec";

    // FIXED: Mapped these keys perfectly to your real state variable names above
    const formData = {
      kittenName: kittenName,   
      tamerName: tamerName,     
      behaviors: behaviors,  
      notes: notes           
    };

    try {
      await fetch(GOOGLE_SCRIPT_URL, {
        method: "POST",
        mode: "no-cors", 
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      // Show the beautiful thank you card screen
      setIsSubmitted(true);

      // FIXED: Sweeps your real variables back to empty states
      setNotes("");
      setBehaviors([]);
      setKittenName("");
      setTamerName("");

    } catch (error) {
      console.error("Submission failed:", error);
      alert("❌ Something went wrong saving the session to Google Sheets.");
    }
  }

  const behaviorOptions = [
    "hissing",
    "hiding",
    "eats from chopstick",
    "eats from hand",
    "comes to front w/ encouragement",
    "comes to front w/o encouragement",
    "stays up front w/ door open",
    "plays",
    "able to pet",
    "able to pick up or hold"
  ];

  function toggleBehavior(behavior) {
    if (behaviors.includes(behavior)) {
      setBehaviors(behaviors.filter((item) => item !== behavior));
    } else {
      setBehaviors([...behaviors, behavior]);
    }
  }

  // ADDED: The screen switcher trigger rule
  if (isSubmitted) {
    return (
      <main className="page">
        <div className="bubble bubble-1"></div>
        <div className="bubble bubble-2"></div>
        <div className="bubble bubble-3"></div>

        <section className="card" style={{ textAlign: "center", padding: "60px 40px" }}>
          <div style={{ fontSize: "4rem", marginBottom: "20px" }}>🐾</div>
          <h1 style={{ marginBottom: "16px" }}>Thank You!</h1>
          <p style={{ color: "var(--text-muted)", marginBottom: "32px", lineHeight: "1.6" }}>
            Your socialization session data has been safely recorded in Google Sheets.<br />
            Marina and the kittens appreciate your hard work!
          </p>
          
          <button 
            onClick={() => setIsSubmitted(false)} 
            className="submit-btn"
            style={{ width: "auto", padding: "14px 36px", margin: "0 auto" }}
          >
            Log Another Session
          </button>
        </section>
      </main>
    );
  }

  return (
    <main className="page">
      {/* Floating Decorative Background Blobs */}
      <div className="bubble bubble-1"></div>
      <div className="bubble bubble-2"></div>
      <div className="bubble bubble-3"></div>

      <section className="card">
        <h1>Tiny Lions</h1>
        <p>Welcome to the Tiny Lions tracker!<br />Log information about your sessions with the kittens.<br />Try to include as much detail as possible in your notes!</p>

        <form onSubmit={handleSubmit}>
          
          {/* ROW 1: Both dropdowns side-by-side */}
          <div className="form-top-row">
            <label>
              Kitten
              <select value={kittenName} onChange={(event) => setKittenName(event.target.value)}>
                <option value="">choose a kitten</option>
                {kittenOptions.map(name => (
                  <option key={name} value={name}>{name}</option>
                ))}
              </select>
            </label>

            <label>
              Tamer
              <select value={tamerName} onChange={(event) => setTamerName(event.target.value)}>
                <option value="">choose a tamer</option>
                {tamerOptions.map(name => (
                  <option key={name} value={name}>{name}</option>
                ))}
              </select>
            </label>
          </div>

          {/* ROW 2: Behaviors Observed Grid */}
          <div className="form-behaviors-section">
            <p className="field-title">Behaviors observed</p>
            <div className="checkbox-grid">
              {behaviorOptions.map((behavior) => (
                <label key={behavior}>
                  <input
                    type="checkbox"
                    checked={behaviors.includes(behavior)}
                    onChange={() => toggleBehavior(behavior)}
                  />
                  <span className="checkbox-label">
                    {behavior}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* ROW 3: Notes Section */}
          <label>
            Notes
            <textarea
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
              placeholder="how did the session go?"
            />
          </label>

          {/* ROW 4: Submit Button */}
          <button type="submit">Save session</button>
          
        </form>
      </section>
    </main>
  );
}

export default App;