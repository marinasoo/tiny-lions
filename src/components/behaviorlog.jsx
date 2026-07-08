import { useState } from "react";

export default function BehaviorLog({ kittenOptions, tamerOptions, isLoadingOptions, GOOGLE_SCRIPT_URL, setIsSubmitted }) {
  const [kittenName, setKittenName] = useState("");
  const [tamerName, setTamerName] = useState("");
  const [notes, setNotes] = useState("");
  const [behaviors, setBehaviors] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  const selectedKitten = kittenOptions.find((kitten) => {
    const name = typeof kitten === "string" ? kitten : kitten.name;
    return name === kittenName;
  });

  const kittenDescription =
    typeof selectedKitten === "object" && selectedKitten?.description?.trim()
      ? selectedKitten.description.trim()
      : null;

  // Values must match Apps Script BEHAVIORS exactly (for POST).
  // Labels are lowercase for display only.
  const behaviorOptions = [
    { value: "Hisses",                        label: "hisses" },
    { value: "Hides",                         label: "hides" },
    { value: "Eats from Chopstick",           label: "eats from chopstick" },
    { value: "Eats from Finger",              label: "eats from finger" },
    { value: "Approaches with Encouragement", label: "approaches with encouragement" },
    { value: "Approaches Freely",             label: "approaches freely" },
    { value: "Stays Up Front",                label: "stays up front" },
    { value: "Plays",                         label: "plays" },
    { value: "Can Pet",                       label: "can pet" },
    { value: "Can Pick Up or Hold",           label: "can pick up or hold" },
  ];

  function toggleBehavior(value) {
    setBehaviors(prev =>
      prev.includes(value)
        ? prev.filter(b => b !== value)
        : [...prev, value]
    );
  }

  async function handleSessionSubmit(event) {
    event.preventDefault();
    setSubmitError(null);
    setIsSubmitting(true);

    try {
      const response = await fetch(GOOGLE_SCRIPT_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "session",
          kittenName,
          tamerName,
          behaviors,
          notes
        })
      });

      const result = await response.json();

      if (result.status === "success") {
        setKittenName("");
        setTamerName("");
        setNotes("");
        setBehaviors([]);
        setIsSubmitted(true);
      } else {
        setSubmitError(result.message || "Something went wrong. Please try again.");
      }
    } catch (error) {
      console.error(error);
      setSubmitError("Could not reach the server. Check your connection and try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSessionSubmit} className="session-form">
      <p className="intro-copy">
        We have a very specific set of procedures! Please check the Resources tab for more information.
      </p>

      <div className="form-top-row">
        <label>
          kitten
          <select
            value={kittenName}
            onChange={(e) => setKittenName(e.target.value)}
            disabled={isLoadingOptions}
            required
          >
            <option value="">{isLoadingOptions ? "fetching kittens..." : "select a kitten"}</option>
            {kittenOptions.map((kitten) => {
              const name = typeof kitten === "string" ? kitten : kitten.name;
              return <option key={name} value={name}>{name}</option>;
            })}
          </select>
        </label>

        <label>
          tamer
          <select
            value={tamerName}
            onChange={(e) => setTamerName(e.target.value)}
            disabled={isLoadingOptions}
            required
          >
            <option value="">{isLoadingOptions ? "fetching tamers..." : "select your name"}</option>
            {tamerOptions.map(name => (
              <option key={name} value={name}>{name}</option>
            ))}
          </select>
        </label>
      </div>

      {kittenDescription && (
        <p className="kitten-description">{kittenDescription}</p>
      )}

      <div className="form-behaviors-section">
        <p className="field-title">observed behaviors</p>
        <div className="checkbox-grid">
          {behaviorOptions.map(({ value, label }) => (
            <label key={value}>
              <input
                type="checkbox"
                checked={behaviors.includes(value)}
                onChange={() => toggleBehavior(value)}
              />
              <span className="checkbox-label">{label}</span>
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
            placeholder="how was your interaction today? about how long did you spend with the kitten? any toys that they particularly liked?"
          />
        </label>
      </div>

      {submitError && (
        <p className="submit-error">{submitError}</p>
      )}

      <button type="submit" disabled={!kittenName || !tamerName || isSubmitting}>
        {isSubmitting ? "saving..." : "submit"}
      </button>
    </form>
  );
}