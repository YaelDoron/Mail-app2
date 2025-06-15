import React, { useState } from "react";

const CreateLabelModal = ({ onClose, onCreate, existingLabels = [] }) => {
  const [labelName, setLabelName] = useState("");

  const handleCreate = () => {
    const trimmed = labelName.trim();
    if (!trimmed) return;
    if (existingLabels.some((l) => l.name === trimmed)) {
      alert("A label with that name already exists.");
      return;
    }
    onCreate(trimmed); // קורא לפונקציה שתקבל את השם
    setLabelName("");
  };

  return (
    <div className="modal d-block" tabIndex="-1" style={{
      background: "rgba(0, 0, 0, 0.5)",
      position: "fixed",
      top: 0, left: 0, right: 0, bottom: 0,
      zIndex: 1050
    }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content p-4">
          <h5 className="mb-3">New label</h5>

          <label className="form-label">Please enter a new label name:</label>
          <input
            className="form-control mb-4"
            placeholder="Label name"
            value={labelName}
            onChange={(e) => setLabelName(e.target.value)}
          />

          <div className="d-flex justify-content-end">
            <button className="btn btn-link me-2" onClick={onClose}>
              Cancel
            </button>
            <button
              className="btn btn-primary"
              disabled={!labelName.trim()}
              onClick={handleCreate}
            >
              Create
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateLabelModal;
