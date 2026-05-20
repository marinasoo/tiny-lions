import React, { useState } from "react";

export default function AddKitten({ GOOGLE_SCRIPT_URL, setActiveView }) {
  const [newKittenName, setNewKittenName] = useState("");
  const [intakeDate, setIntakeDate] = useState("");
  const [isGrouped, setIsGrouped] = useState(false);
  const [groupMembers, setGroupMembers] = useState("");

  async function handleNewKittenSubmit(event) {
    event.preventDefault();
    if (!newKittenName || !intakeDate) {
      alert("Please fill out the Kitten Name and Intake Date!");
      return;
    }

    const kittenData = {
      type: "newKitten",
      kittenName: newKittenName,
      intakeDate,
      isGrouped,
      groupMembers: isGrouped ? groupMembers : ""
    };

    try {
      await fetch(GOOGLE_SCRIPT_URL, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(kittenData),
      });
      alert(`🐾 ${newKittenName} has been successfully added to the Master List!`);
      setActiveView("logSession"); 
    } catch (error) {
      console.error(error);
      alert("❌ Something went wrong registering the kitten.");
    }
  }

  return (
    <>
      <h2 className="workspace-heading">Add Kitten</h2>
      <form onSubmit={handleNewKittenSubmit} className="kitten-form">
        <label>
          Kitten Name
          <input type="text" value={newKittenName} onChange={(e) => setNewKittenName(e.target.value)} placeholder="e.g. Biscuit" />
        </label>

        <label>
          Date of Intake
          <input type="date" value={intakeDate} onChange={(e) => setIntakeDate(e.target.value)} />
        </label>

        <div className="sibling-panel">
          <input type="checkbox" id="grouped" checked={isGrouped} onChange={(e) => setIsGrouped(e.target.checked)} />
          <label htmlFor="grouped">Is this kitten grouped with siblings?</label>
        </div>

        {isGrouped && (
          <label style={{ gridColumn: "1 / -1" }}>
            Group Member Names
            <input type="text" value={groupMembers} onChange={(e) => setGroupMembers(e.target.value)} placeholder="e.g. Gravy, Waffles" />
          </label>
        )}
        <button type="submit">Register Kitten</button>
      </form>
    </>
  );
}