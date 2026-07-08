import { useEffect, useState } from "react";
import confetti from "canvas-confetti";

export default function CheckStatus({ kittenOptions, isLoadingOptions, GOOGLE_SCRIPT_URL }) {
  const [selectedKitten, setSelectedKitten] = useState("");
  const [historyLogs, setHistoryLogs] = useState([]);
  const [isGraduated, setIsGraduated] = useState(false);
  const [graduationDate, setGraduationDate] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [lookupError, setLookupError] = useState(null);

  useEffect(() => {
    if (!isGraduated) return;

    const duration = 5 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 28, spread: 360, ticks: 70, zIndex: 1000 };

    function randomInRange(min, max) {
      return Math.random() * (max - min) + min;
    }

    const interval = window.setInterval(() => {
      const timeLeft = animationEnd - Date.now();
      if (timeLeft <= 0) return window.clearInterval(interval);

      const particleCount = 45 * (timeLeft / duration);
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.08, 0.28), y: randomInRange(0, 0.25) } });
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.72, 0.92), y: randomInRange(0, 0.25) } });
    }, 250);

    return () => window.clearInterval(interval);
  }, [isGraduated]);

   const behaviorLabels = {
    "Hisses": "hisses",
    "Hides": "hides",
    "Eats from Chopstick": "chopstick",
    "Eats from Finger": "finger",
    "Approaches with Encouragement": "approach - encouraged",
    "Approaches Freely": "approach - freely",
    "Stays Up Front": "stays up front",
    "Plays": "plays",
    "Can Pet": "can pet",
    "Can Pick Up or Hold": "can pick up",
  };

  async function handleLookup(event) {
    event.preventDefault();
    if (!selectedKitten) return;

    setIsSearching(true);
    setHasSearched(true);
    setIsGraduated(false);
    setHistoryLogs([]);
    setLookupError(null);
    setGraduationDate(null);

    try {
      const response = await fetch(`${GOOGLE_SCRIPT_URL}?kitten=${encodeURIComponent(selectedKitten)}`);
      const data = await response.json();

      if (data.error) {
        setLookupError(data.error);
        return;
      }

      if (data.graduated) {
        setIsGraduated(true);
        setGraduationDate(data.graduationDate || null);
      }

      setHistoryLogs(data.history || []);

    } catch (error) {
      console.error(error);
      setLookupError("Could not load session history. Check your connection and try again.");
    } finally {
      setIsSearching(false);
    }
  }

  return (
    <>
      <form onSubmit={handleLookup} className="status-form">
        <p className="intro-copy">
          Check in on past behavior sessions for a kitten.
        </p>

        <label
          className="status-search"
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: "100%",
            maxWidth: "320px",
            margin: "0 auto 16px auto"
          }}
        >
          kitten
          <input
            list="all-kittens-list"
            value={selectedKitten}
            placeholder={isLoadingOptions ? "fetching kittens..." : "start typing to search..."}
            onChange={(e) => {
              setSelectedKitten(e.target.value);
              setHasSearched(false);
              setIsGraduated(false);
              setLookupError(null);
            }}
            disabled={isLoadingOptions}
          />
          <datalist id="all-kittens-list">
            {kittenOptions.map(name => (
              <option key={name} value={name} />
            ))}
          </datalist>
        </label>

        <button type="submit" disabled={!selectedKitten || isSearching}>
          {isSearching ? "searching..." : "check"}
        </button>
      </form>

      {hasSearched && !isSearching && (
        <div className="status-results">
          {lookupError ? (
            <p className="empty-state">{lookupError}</p>
          ) : isGraduated ? (
            <>
              <div className="graduation-card">
                <img src="/asaplogo.png" alt="" />
                <div>
                  <h2>{selectedKitten.toUpperCase()}</h2>
                  <p>has fulfilled all of the kitten credits needed to</p>
                  <h3>GRADUATE!</h3>
                  {graduationDate && (
                    <p style={{ fontFamily: "var(--mono)", fontSize: "0.9rem", marginTop: "8px", opacity: 0.7 }}>
                      graduated {graduationDate}
                    </p>
                  )}
                </div>
                <img src="/asaplogo.png" alt="" />
              </div>

              {historyLogs.length > 0 && (
                <>
                  <p className="field-title" style={{ marginTop: "24px" }}>session history</p>
                  {historyLogs.map((session, index) => (
                    <SessionCard key={index} session={session} behaviorLabels={behaviorLabels} />
                  ))}
                </>
              )}
            </>
          ) : historyLogs.length === 0 ? (
            <p className="empty-state">no recorded sessions found</p>
          ) : (
            historyLogs.map((session, index) => (
              <SessionCard key={index} session={session} behaviorLabels={behaviorLabels} />
            ))
          )}
        </div>
      )}
    </>
  );
}

function SessionCard({ session, behaviorLabels }) {
  return (
    <article className="history-card">
      <div className="history-card-header">
        <span>{session.date}</span>
        <span>{session.tamer}</span>
      </div>

      <div className="history-behaviors">
        {session.behaviors.length === 0 ? (
          <span>none marked</span>
        ) : (
          <div>
            {session.behaviors.map((b, i) => (
              <span key={i}>{behaviorLabels[b] || b}</span>
            ))}
          </div>
        )}
      </div>

      {session.notes && (
        <p className="history-notes">{session.notes}</p>
      )}
    </article>
  );
}