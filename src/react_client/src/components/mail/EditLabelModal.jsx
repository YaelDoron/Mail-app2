import React, { useState, forwardRef } from "react";
import { updateLabel } from "../../services/labelsService";
import "./EditLabelModal.css";

// Forward ref to allow outside click detection from parent
const EditLabelModal = forwardRef(({ label, existingLabels, onClose, onSave }, ref) => {
  const [name, setName] = useState(label.name);
  const [error, setError] = useState("");

  // Save handler: checks for duplicate name before sending request
  const handleSave = async () => {
    const trimmed = name.trim();

    // Check if the new name already exists in other labels
    const isDuplicate = existingLabels.some(
      (l) => l.id !== label.id && l.name.trim().toLowerCase() === trimmed.toLowerCase()
    );

    if (isDuplicate) {
      setError("A label with this name already exists.");
      return;
    }

    try {
      const updated = await updateLabel(label.id, { name: trimmed }); // Send updated name to server
      await onSave(updated);
    } catch (err) {
      console.error("Failed to update label", err);
    }
  };

  return (
    <div className="modal" ref={ref}>
      <div className="modal-dialog">
        <div className="modal-content">

          {/* Modal header */}
          <div className="modal-header">
            <h5 className="modal-title">Edit label</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>

          {/* Input field for label name */}
          <div className="modal-body">
            <input
              type="text"
              className={`form-control ${error ? "is-invalid" : ""}`}
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setError(""); 
              }}
              autoFocus
            />
            {/* Display error message if duplicate name */}
            {error && <div className="invalid-feedback">{error}</div>}
          </div>

          {/* Buttons */}
          <div className="modal-footer">
            <button className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button
              className="btn btn-primary"
              onClick={handleSave}
              disabled={!name.trim() || name.trim() === label.name.trim()}
            >
              Save
            </button>
          </div>

        </div>
      </div>
    </div>
  );
});

export default EditLabelModal;
