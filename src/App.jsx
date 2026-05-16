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
    "Hissing",
    "Hiding",
    "Ate from chopstick",
    "Ate from hand",
    "Comes to front with encouragement",
    "Comes to front without encouragement",
    "Stays up front when the door is open",
    "Plays",
    "Able to pet",
    "Able to pick up / hold"
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
        <p>Feral kitten socialization tracker</p>

        <form onSubmit={handleSubmit}>
          {/* Kitten Name Dropdown */}
        <label>
          Kitten name
          <select value={kittenName} onChange={(event) => setKittenName(event.target.value)}>
            <option value="">-- Select a Kitten --</option>
            {kittenOptions.map(name => (
              <option key={name} value={name}>{name}</option>
            ))}
          </select>
        </label>

        {/* Volunteer Name Dropdown */}
        <label>
          Volunteer name
          <select value={volunteerName} onChange={(event) => setVolunteerName(event.target.value)}>
            <option value="">-- Select Your Name --</option>
            {volunteerOptions.map(name => (
              <option key={name} value={name}>{name}</option>
            ))}
          </select>
        </label>
          <div>
            <p className="field-title">Behaviors observed</p>

            <div className="checkbox-grid">
              {behaviorOptions.map((behavior) => (
                /* 1. We keep the unique key on the parent container */
                <label key={behavior}>
                  <input
                    type="checkbox"
                    checked={behaviors.includes(behavior)}
                    onChange={() => toggleBehavior(behavior)}
                  />
                  {/* 2. Giving the text its own class allows the CSS to hide the checkbox 
                      and style this whole pill element cleanly! */}
                  <span className="checkbox-label">
                    {behavior}
                  </span>
                </label>
              ))}
            </div>
          </div>
          <label>
            Notes
            <textarea
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
              placeholder="How did the session go?"
            />
          </label>

          <button type="submit">Save session</button>
        </form>
      </section>
    </main>
  );
}

export default App;