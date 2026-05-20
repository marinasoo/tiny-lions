import React, { useState } from "react";

export default function AddTamer({ GOOGLE_SCRIPT_URL, setActiveView }) {
  const [newTamerName, setNewTamerName] = useState("");

  async function handleNewTamerSubmit(event) {
    event.preventDefault();
    if (!newTamerName.trim()) {
      alert("please enter a tamer name!");
      return;
    }

    const tamerData = {
      type: "newTamer",
      tamerName: newTamerName
    };

    try {
      await fetch(GOOGLE_SCRIPT_URL, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(tamerData),
      });
      alert(`${newTamerName} has been added as an tamer!`);
      setActiveView("logSession");
    } catch (error) {
      console.error(error);
      alert("omething went wrong registering the tamer.");
    }
  }

  return (
    <>
      <form onSubmit={handleNewTamerSubmit} className="tamer-form">
        <label>
          tamer name
          <input type="text" value={newTamerName} onChange={(e) => setNewTamerName(e.target.value)} placeholder="e.g. Athena" />
        </label>
        <button type="submit">register tamer</button>
      </form>
    </>
  );
}