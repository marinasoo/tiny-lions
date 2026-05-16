import { useState } from "react";
import "./App.css";
import { supabase } from "./supabaseClient";

function App() {
  const [kittenName, setKittenName] = useState("");
  const [volunteerName, setVolunteerName] = useState("");
  const [notes, setNotes] = useState("");
  const [behaviors, setBehaviors] = useState([]);
  const volunteerOptions = ["Marina", "Anastasia", "Nicole", "Athena", "Lauren"];
  const kittenOptions = ["Chicken", "Wren", "Finch", "Rey", "Chewy"];

  async function handleSubmit(event) {
  event.preventDefault();

  const { error } = await supabase.from("sessions").insert({
    kitten_name: kittenName,
    volunteer_name: volunteerName,
    behaviors: behaviors,
    notes: notes,
  });

  if (error) {
    alert("Something went wrong. The session was not saved.");
    console.error(error);
    return;
  }

  alert("Session saved!");

  setKittenName("");
  setVolunteerName("");
  setBehaviors([]);
  setNotes("");
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
              <select value={volunteerName} onChange={(event) => setVolunteerName(event.target.value)}>
                <option value="">choose a tamer</option>
                {volunteerOptions.map(name => (
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