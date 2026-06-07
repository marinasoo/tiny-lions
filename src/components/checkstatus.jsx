import React, { useState } from "react";
import confetti from "canvas-confetti";

export default function CheckStatus({ kittenOptions, isLoadingOptions, GOOGLE_SCRIPT_URL }) {
  const [selectedKitten, setSelectedKitten] = useState("");
  const [historyLogs, setHistoryLogs] = useState([]);
  const [isGraduated, setIsGraduated] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

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
        // Fire a festive burst of confetti!
        confetti({
          particleCount: 150,
          spread: 80,
          origin: { y: 0.6 }
        });
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
      <form onSubmit={handleLookup} style={{ display: "grid", justifyItems: "center", gap: "20px" }}>
        <label style={{ width: "100%", maxWidth: "450px" }}>
          Start typing to search
          <input
            list="all-kittens-list"
            value={selectedKitten}
            placeholder={isLoadingOptions ? "Fetching kittens..." : "e.g. Chicken"}
            onChange={(e) => {
                setSelectedKitten(e.target.value);
                setHasSearched(false);
                setIsGraduated(false);
            }}
            disabled={isLoadingOptions}
            style={{ 
              width: "100%",
              padding: "10px",
              borderRadius: "6px",
              border: "1px solid #ccc",
              marginTop: "6px",
              fontSize: "1rem"
            }}
          />
          <datalist id="all-kittens-list">
            {kittenOptions.map(name => (
              <option key={name} value={name} />
            ))}
          </datalist>
        </label>
        <button type="submit" disabled={!selectedKitten || isSearching} style={{ maxWidth: "220px" }}>
          {isSearching ? "Searching logs..." : "View progress!"}
        </button>
      </form>

      {/* --- HISTORY TIMELINE DISPLAY PANEL BLOCK --- */}
      {hasSearched && !isSearching && (
        <div style={{ marginTop: "40px", width: "100%", display: "grid", gap: "24px" , textAlign: "center ! important"}}>
        
          {isGraduated ? (
            <div style={{ padding: "40px 20px", display: "grid", justifyItems: "center", textAlign: "center" }}>
              <h2 style={{ fontSize: "3.5rem", margin: "0 0 12px 0", color: "var(--accent-warm)", textTransform: "uppercase" }}>
                Graduated!
              </h2>
              <p style={{ fontSize: "1.25rem", color: "var(--text-primary)", fontStyle: "italic", margin: 0, maxWidth: "500px" }}>
              {selectedKitten} has met all of the Tiny Lions School graduation requirements!
             </p>
            </div>
          ) : (
            /* 💡 FIX 2: Wrapped the sibling elements inside a fragment container */
            <>
              <h3 style={{ textTransform: "uppercase", fontSize: "1.1rem", color: "var(--accent-warm)", letterSpacing: "1px", textAlign: "center ! important" }}>
                Recent Socialization Milestones for {selectedKitten}
              </h3>
              
              {historyLogs.length === 0 ? (
                <p style={{ textAlign: "center", color: "var(--text-muted)", fontStyle: "italic", padding: "20px" }}>
                  no recorded sessions found
                </p>
              ) : (
                historyLogs.map((session, index) => (
                  <div 
                    key={index} 
                    style={{
                      background: "rgba(255, 255, 255, 0.4)",
                      borderLeft: "5px solid var(--accent-warm)",
                      borderRadius: "8px",
                      padding: "20px",
                      textAlign: "left",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.02)"
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px", borderBottom: "1px dashed rgba(129,33,153,0.1)", paddingBottom: "6px" }}>
                      <span style={{ fontWeight: 800, color: "var(--text-primary)" }}>📅 {session.date}</span>
                      <span style={{ fontWeight: 600, color: "var(--accent-warm)", fontSize: "0.95rem" }}>Tamer: {session.tamer}</span>
                    </div>

                    <div style={{ marginBottom: "12px" }}>
                      <p style={{ fontWeight: 700, margin: "0 0 6px 0", fontSize: "0.9rem", color: "var(--text-primary)" }}>observed behaviors:</p>
                      {session.behaviors.length === 0 ? (
                        <span style={{ fontSize: "0.85rem", background: "rgba(0,0,0,0.04)", padding: "4px 8px", borderRadius: "4px", color: "var(--text-muted)" }}>none marked</span>
                      ) : (
                        <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                          {session.behaviors.map((b, i) => (
                            <span key={i} style={{ fontSize: "0.85rem", background: "rgba(154, 22, 195, 0.1)", padding: "4px 10px", borderRadius: "12px", color: "rgb(129, 33, 153)", fontWeight: 600 }}>
                              {b}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {session.notes && (
                      <div>
                        <p style={{ fontWeight: 700, margin: "0 0 4px 0", fontSize: "0.9rem", color: "var(--text-primary)" }}>session notes:</p>
                        <p style={{ margin: 0, fontSize: "0.95rem", color: "#444", fontStyle: "italic", background: "rgba(255,255,255,0.5)", padding: "10px", borderRadius: "6px" }}>
                          "{session.notes}"
                        </p>
                      </div>
                    )}
                  </div>
                ))
              )}
            </>
          )}
        </div>
      )}
    </>
  );
}