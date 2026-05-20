import React, { useState } from "react";

export default function AddKitten({ GOOGLE_SCRIPT_URL, setActiveView }) {
  const [newKittenName, setNewKittenName] = useState("");
  const [intakeDate, setIntakeDate] = useState("");
  const [isGrouped, setIsGrouped] = useState(false);
  const [groupMembers, setGroupMembers] = useState("");

  async function handleNewKittenSubmit(event) {
    event.preventDefault();
    if (!newKittenName || !intakeDate) {
      alert("please fill out the Kitten Name and Intake Date!");
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
      alert(`${newKittenName} has been added to the Kitten Master List!`);
      setActiveView("logSession"); 
    } catch (error) {
      console.error(error);
      alert("Something went wrong registering the kitten.");
    }
  }

  return (
    <>
      <form onSubmit={handleNewKittenSubmit} className="kitten-form">
        <label>
          kitten name
          <input type="text" value={newKittenName} onChange={(e) => setNewKittenName(e.target.value)} placeholder="e.g. Luna" />
        </label>

        <label>
          first day of school
          <input type="date" value={intakeDate} onChange={(e) => setIntakeDate(e.target.value)} />
        </label>

        <div className="sibling-panel">
          <input type="checkbox" id="grouped" checked={isGrouped} onChange={(e) => setIsGrouped(e.target.checked)} />
          <label htmlFor="grouped">is this kitten grouped with siblings?</label>
        </div>

        {isGrouped && (
          <label style={{ gridColumn: "1 / -1" }}>
            sibling names
            <input type="text" value={groupMembers} onChange={(e) => setGroupMembers(e.target.value)} placeholder="e.g. Fluffy, Whiskers" />
          </label>
        )}
        <button type="submit">register kitten</button>
      </form>
    </>
  );
}