import { useEffect, useState } from "react";
import confetti from "canvas-confetti";

export default function CheckStatus({ kittenOptions, isLoadingOptions, GOOGLE_SCRIPT_URL }) {
  const [selectedKitten, setSelectedKitten] = useState("");
  const [historyLogs, setHistoryLogs] = useState([]);
  const [isGraduated, setIsGraduated] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    if (!isGraduated) return undefined;

    const duration = 5 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 28, spread: 360, ticks: 70, zIndex: 1000 };

    function randomInRange(min, max) {
      return Math.random() * (max - min) + min;
    }

    const interval = window.setInterval(() => {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        window.clearInterval(interval);
        return;
      }

      const particleCount = 45 * (timeLeft / duration);
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.08, 0.28), y: randomInRange(0, 0.25) } });
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.72, 0.92), y: randomInRange(0, 0.25) } });
    }, 250);

    return () => window.clearInterval(interval);
  }, [isGraduated]);

  async function handleLookup(event) {
    event.preventDefault();
    if (!selectedKitten) return;

    try {
      setIsSearching(true);
      setHasSearched(true);
      setIsGraduated(false);
      setHistoryLogs([]);
      
      // Append a query parameter to the URL request link: ?kitten=Chicken
      const response = await fetch(`${GOOGLE_SCRIPT_URL}?kitten=${encodeURIComponent(selectedKitten)}`);
      const data = await response.json();
      
      if (data.graduated || data.status === "Graduated") {
        setIsGraduated(true);
      } else {
        setHistoryLogs(data.history || []);
      }

    } catch (error) {
      console.error("Error looking up kitten historical data:", error);
      alert("Could not download history logs.");
    } finally {
      setIsSearching(false);
    }
  }

return (
    <>
      <form onSubmit={handleLookup} className="status-form">
        <p className="intro-copy">
          Check in on past behavior sessions of a kitten. Good resource before
          your start a session. Or kitten missing from the list? Let's see if
          they're graduated!
        </p>

        {/* Added inline styles here to center it and shrink the container boundary */}
        <label 
          className="status-search" 
          style={{ 
            display: "flex", 
            flexDirection: "column", 
            alignItems: "center",
            width: "100%",
            maxWidth: "320px", /* THE FIX: Shrinks the overall horizontal area */
            margin: "0 auto 16px auto" /* Centers the block inside your form card */
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
            }}
            disabled={isLoadingOptions}
            style={{
              width: "100%", /* Spans cleanly across your custom 320px max-width boundary */
              boxSizing: "border-box"
            }}
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
          {isGraduated ? (
            <div className="graduation-card">
              <img src="/asaplogo.png" alt="" />
              <div>
                <h2>{selectedKitten.toUpperCase()}</h2>
                <p>has fulfilled all of the kitten credits needed to</p>
                <h3>GRADUATE!</h3>
              </div>
              <img src="/asaplogo.png" alt="" />
            </div>
          ) : (
            <>
              {historyLogs.length === 0 ? (
                <p className="empty-state">
                  no recorded sessions found
                </p>
              ) : (
                historyLogs.map((session, index) => (
                  <article key={index} className="history-card">
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
                            <span key={i}>{b}</span>
                          ))}
                        </div>
                      )}
                    </div>

                    {session.notes && (
                      <p className="history-notes">{session.notes}</p>
                    )}
                  </article>
                ))
              )}
            </>
          )}
        </div>
      )}
    </>
  );
}
