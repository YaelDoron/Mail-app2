import React, { useEffect, useState } from "react";
import { fetchLabels, addLabel  } from "../../services/labelsService";
import CreateLabelModal from "./CreateLabelModal";
import "./LabelSelectorModal.css";

function LabelSelectorModal({ onClose, onAssign, onCreateNew  }) {
  const [labels, setLabels] = useState([]);
  const [selectedLabelId, setSelectedLabelId] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);


  useEffect(() => {
    const loadLabels = async () => {
      try {
        const data = await fetchLabels();
        setLabels(data);
      } catch (err) {
        console.error("Failed to fetch labels", err);
      }
    };
    loadLabels();
  }, []);

  const handleAssign = () => {
    if (selectedLabelId) {
      onAssign(selectedLabelId);
      onClose();
    }
  };
  return (
    <div className="modal-overlay">
      <div className="label-popup">
        <div className="popup-header">
          <h5 className="popup-title"> Label as:</h5>
          <button className="close-button" onClick={onClose}>
            <i className="bi bi-x-lg"></i>
          </button>
        </div>

        <div className="label-list">
          {labels.map((label) => (
            <div key={label.id} className="label-item d-flex align-items-center gap-2">
              <input
                type="radio"
                name="label"
                id={`label-${label.id}`}
                checked={selectedLabelId === label.id}
                onChange={() =>
                  setSelectedLabelId(
                    selectedLabelId === label.id ? null : label.id
                  )
                }
              />
              <label htmlFor={`label-${label.id}`}>{label.name}</label>
            </div>

          ))}
        </div>

        <hr />
        <div className="d-flex justify-content-between align-items-center mt-2">
          <button className="btn btn-outline-secondary" onClick={() => setShowCreateModal(true)}>
            Create new
          </button>
          <button className="btn btn-primary" onClick={handleAssign} disabled={!selectedLabelId}>
            Assign
          </button>
        </div>
      </div>
      {showCreateModal && (
      <CreateLabelModal
        onClose={() => setShowCreateModal(false)}
        onCreate={async (name) => {
          const newLabel = await addLabel({ name });
          const refreshed = await fetchLabels();
          setLabels(refreshed);
          setSelectedLabelId(newLabel.id);
          setShowCreateModal(false);
          window.dispatchEvent(new CustomEvent("label-created"));
        }}
        existingLabels={labels}
      />
    )}
    </div>
  );
}

export default LabelSelectorModal;