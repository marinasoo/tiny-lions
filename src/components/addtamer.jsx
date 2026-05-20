import React, { useState } from "react";

export default function AddTamer({ GOOGLE_SCRIPT_URL, setActiveView }) {
  const [newTamerName, setNewTamerName] = useState("");

  async function handleNewTamerSubmit(event) {
    event.preventDefault();
    if (!newTamerName.trim()) {
      alert("Please enter a tamer name!");
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
      alert(`👋 ${newTamerName} has been added as an authorized Tamer!`);
      setActiveView("logSession");
    } catch (error) {
      console.error(error);
      alert("❌ Something went wrong registering the tamer.");
    }
  }

  return (
    <>
      <h2 className="workspace-heading">Add Tamer</h2>
      <form onSubmit={handleNewTamerSubmit} className="tamer-form">
        <label>
          Tamer Name
          <input type="text" value={newTamerName} onChange={(e) => setNewTamerName(e.target.value)} placeholder="e.g. Jane Doe" />
        </label>
        <button type="submit">Register Tamer</button>
      </form>
    </>
  );
}