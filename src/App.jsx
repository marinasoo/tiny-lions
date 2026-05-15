import { useState } from "react";
import "./App.css";

function App() {
  const [kittenName, setKittenName] = useState("");
  const [volunteerName, setVolunteerName] = useState("");
  const [notes, setNotes] = useState("");
  const [behaviors, setBehaviors] = useState([]);

  function handleSubmit(event) {
    event.preventDefault();

    const session = {
      kittenName,
      volunteerName,
      notes,
      date: new Date().toLocaleDateString(),
      behaviors,
    };

    console.log("New session:", session);

    setKittenName("");
    setVolunteerName("");
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
      <section className="card">
        <h1>Tiny Lions</h1>
        <p>Feral kitten socialization tracker</p>

        <form onSubmit={handleSubmit}>
          <label>
            Kitten name
            <input
              value={kittenName}
              onChange={(event) => setKittenName(event.target.value)}
              placeholder="Mango"
            />
          </label>

          <label>
            Volunteer name
            <input
              value={volunteerName}
              onChange={(event) => setVolunteerName(event.target.value)}
              placeholder="Jade"
            />
          </label>
          <div>
            <p className="field-title">Behaviors observed</p>

            <div className="checkbox-grid">
              {behaviorOptions.map((behavior) => (
                <label className="checkbox-label" key={behavior}>
                  <input
                    type="checkbox"
                    checked={behaviors.includes(behavior)}
                    onChange={() => toggleBehavior(behavior)}
                  />
                  {behavior}
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