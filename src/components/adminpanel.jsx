import { useState, useEffect } from "react";

export default function AdminPanel({ GOOGLE_SCRIPT_URL, activeKittenOptions, isLoadingOptions, onDataChange, onExit }) {
  const [activeTab, setActiveTab] = useState("metrics");
  const [metrics, setMetrics] = useState(null);
  const [isLoadingMetrics, setIsLoadingMetrics] = useState(true);
  const [metricsError, setMetricsError] = useState(null);

  // Add Kitten state
  const [newKittenName, setNewKittenName] = useState("");
  const [newKittenDescription, setNewKittenDescription] = useState("");
  const [newKittenIntakeDate, setNewKittenIntakeDate] = useState(today());
  const [newKittenGrouped, setNewKittenGrouped] = useState(false);
  const [newKittenGroupMembers, setNewKittenGroupMembers] = useState("");
  const [kittenSubmitting, setKittenSubmitting] = useState(false);
  const [kittenMessage, setKittenMessage] = useState(null);

  // Graduate Kitten state
  const [graduateKittenName, setGraduateKittenName] = useState("");
  const [graduateSubmitting, setGraduateSubmitting] = useState(false);
  const [graduateMessage, setGraduateMessage] = useState(null);

  // Add Tamer state
  const [newTamerName, setNewTamerName] = useState("");
  const [tamerSubmitting, setTamerSubmitting] = useState(false);
  const [tamerMessage, setTamerMessage] = useState(null);

  useEffect(() => {
    fetchMetrics();
  }, []);

  function today() {
    return new Date().toISOString().split("T")[0];
  }

  async function fetchMetrics() {
    setIsLoadingMetrics(true);
    setMetricsError(null);
    try {
      const response = await fetch(`${GOOGLE_SCRIPT_URL}?metrics=true`);
      const data = await response.json();
      if (data.status === "success") {
        setMetrics(data.metrics);
      } else {
        setMetricsError(data.message || "Could not load metrics.");
      }
    } catch (err) {
      setMetricsError("Could not reach the server.");
    } finally {
      setIsLoadingMetrics(false);
    }
  }

  async function handleAddKitten(e) {
      e.preventDefault();
      setKittenSubmitting(true);
      setKittenMessage(null);

      try {
        await fetch(GOOGLE_SCRIPT_URL, {
          method: "POST",
          mode: "no-cors",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type: "newKitten",
            kittenName: newKittenName,
            description: newKittenDescription,
            intakeDate: newKittenIntakeDate,
            isGrouped: newKittenGrouped,
            groupMembers: newKittenGroupMembers
          })
        });

        setKittenMessage({
          type: "success",
          text: `${newKittenName} has been added!`
        });

        setNewKittenName("");
        setNewKittenDescription("");
        setNewKittenIntakeDate(today());
        setNewKittenGrouped(false);
        setNewKittenGroupMembers("");
        onDataChange();

      } catch (err) {
        console.error(err);
        setKittenMessage({
          type: "error",
          text: "Could not reach the server."
        });
      } finally {
        setKittenSubmitting(false);
      }
    }

   async function handleGraduate(e) {
      e.preventDefault();
      setGraduateSubmitting(true);
      setGraduateMessage(null);

      try {
        await fetch(GOOGLE_SCRIPT_URL, {
          method: "POST",
          mode: "no-cors",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type: "graduate",
            kittenName: graduateKittenName
          })
        });

        setGraduateMessage({
          type: "success",
          text: `${graduateKittenName} has graduated! 🎓`
        });

        setGraduateKittenName("");
        onDataChange();
        fetchMetrics();

      } catch (err) {
        console.error(err);
        setGraduateMessage({
          type: "error",
          text: "Could not reach the server."
        });
      } finally {
        setGraduateSubmitting(false);
      }
    }

  async function handleAddTamer(e) {
    e.preventDefault();
    setTamerSubmitting(true);
    setTamerMessage(null);

    try {
      await fetch(GOOGLE_SCRIPT_URL, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "newTamer",
          tamerName: newTamerName
        })
      });

      setTamerMessage({
        type: "success",
        text: `${newTamerName} has been added as a tamer!`
      });

      setNewTamerName("");
      onDataChange();

    } catch (err) {
      console.error(err);
      setTamerMessage({
        type: "error",
        text: "Could not reach the server."
      });
    } finally {
      setTamerSubmitting(false);
    }
  }

  const adminTabs = ["metrics", "add kitten", "graduate", "add tamer"];

  return (
    <div className="admin-panel">
      <div className="admin-panel-header">
        <p className="field-title" style={{ margin: 0 }}>admin</p>
        <button className="admin-exit-btn" onClick={onExit}>← back</button>
      </div>

      <div className="admin-tabs">
        {adminTabs.map(tab => (
          <button
            key={tab}
            type="button"
            className={`admin-tab ${activeTab === tab ? "active" : ""}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* METRICS */}
      {activeTab === "metrics" && (
        <div className="admin-section">
          {isLoadingMetrics ? (
            <p className="empty-state">loading metrics...</p>
          ) : metricsError ? (
            <p className="empty-state">{metricsError}</p>
          ) : metrics ? (
            <div className="metrics-grid">
              <MetricCard label="total kittens ever" value={metrics.totalKittens} />
              <MetricCard label="currently active" value={metrics.activeKittens} />
              <MetricCard label="graduated" value={metrics.graduatedKittens} />
              <MetricCard label={`kittens in ${new Date().getFullYear()}`} value={metrics.kittensThisYear} />
              <MetricCard
                label="avg days to graduation"
                value={metrics.averageDaysToGraduation !== null ? `${metrics.averageDaysToGraduation}` : "—"}
              />
              <MetricCard label="total sessions logged" value={metrics.totalSessions} />

              {Object.keys(metrics.sessionsByTamer).length > 0 && (
                <div className="metric-card metric-card-wide">
                  <p className="metric-label">sessions by tamer</p>
                  <div className="tamer-breakdown">
                    {Object.entries(metrics.sessionsByTamer)
                      .sort((a, b) => b[1] - a[1])
                      .map(([tamer, count]) => (
                        <div key={tamer} className="tamer-row">
                          <span>{tamer}</span>
                          <span>{count}</span>
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </div>
          ) : null}
        </div>
      )}

      {/* ADD KITTEN */}
      {activeTab === "add kitten" && (
        <div className="admin-section">
          <form onSubmit={handleAddKitten} className="admin-form">
            <label>
              KITTEN NAME
              <input
                type="text"
                value={newKittenName}
                onChange={e => setNewKittenName(e.target.value)}
                placeholder="e.g. Mango"
                required
              />
            </label>

            <label>
              DESCRIPTION
              <input
                type="text"
                value={newKittenDescription}
                onChange={e => setNewKittenDescription(e.target.value)}
                placeholder="e.g. brown tabby"
              />
            </label>

            <label>
              DATE OF INTAKE
              <input
                type="date"
                value={newKittenIntakeDate}
                onChange={e => setNewKittenIntakeDate(e.target.value)}
                required
              />
            </label>

            <label className="checkbox-inline">
              <input
                type="checkbox"
                checked={newKittenGrouped}
                onChange={e => setNewKittenGrouped(e.target.checked)}
                style={{ width: "auto", position: "static", opacity: 1 }}
              />
              PART OF A GROUP?
            </label>

            {newKittenGrouped && (
              <label>
                GROUP MEMBERS
                <input
                  type="text"
                  value={newKittenGroupMembers}
                  onChange={e => setNewKittenGroupMembers(e.target.value)}
                  placeholder="e.g. Kiwi, Grape, Guava"
                />
              </label>
            )}

            {kittenMessage && (
              <p className={kittenMessage.type === "success" ? "admin-success" : "submit-error"}>
                {kittenMessage.text}
              </p>
            )}

            <button type="submit" disabled={kittenSubmitting}>
              {kittenSubmitting ? "adding..." : "add kitten"}
            </button>
          </form>
        </div>
      )}

      {/* GRADUATE */}
      {activeTab === "graduate" && (
        <div className="admin-section">
          <form onSubmit={handleGraduate} className="admin-form">
            <label>
              kitten to graduate
              <select
                value={graduateKittenName}
                onChange={e => setGraduateKittenName(e.target.value)}
                disabled={isLoadingOptions}
                required
              >
                <option value="">{isLoadingOptions ? "loading..." : "select a kitten"}</option>
                {activeKittenOptions.map(k => {
                  const name = typeof k === "string" ? k : k.name;
                  return <option key={name} value={name}>{name}</option>;
                })}
              </select>
            </label>

            {graduateMessage && (
              <p className={graduateMessage.type === "success" ? "admin-success" : "submit-error"}>
                {graduateMessage.text}
              </p>
            )}

            <button type="submit" disabled={!graduateKittenName || graduateSubmitting}>
              {graduateSubmitting ? "graduating..." : "graduate kitten"}
            </button>
          </form>
        </div>
      )}

      {/* ADD TAMER */}
      {activeTab === "add tamer" && (
        <div className="admin-section">
          <form onSubmit={handleAddTamer} className="admin-form">
            <label>
              tamer name
              <input
                type="text"
                value={newTamerName}
                onChange={e => setNewTamerName(e.target.value)}
                placeholder="e.g. Athena"
                required
              />
            </label>

            {tamerMessage && (
              <p className={tamerMessage.type === "success" ? "admin-success" : "submit-error"}>
                {tamerMessage.text}
              </p>
            )}

            <button type="submit" disabled={!newTamerName.trim() || tamerSubmitting}>
              {tamerSubmitting ? "adding..." : "add tamer"}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

function MetricCard({ label, value }) {
  return (
    <div className="metric-card">
      <p className="metric-value">{value ?? "—"}</p>
      <p className="metric-label">{label}</p>
    </div>
  );
}