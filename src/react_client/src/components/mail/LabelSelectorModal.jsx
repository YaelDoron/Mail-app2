import React, { useEffect, useState } from "react";
import { fetchLabels } from "../../services/api";
import "./LabelSelectorModal.css";

function LabelSelectorModal({ onClose, onAssign }) {
  const [labels, setLabels] = useState([]);
  const [, setSelectedLabel] = useState(null);

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

  const handleSelect = (labelId) => {
    setSelectedLabel(labelId);
    onAssign(labelId); // ישירות בעת בחירה – כמו בג'ימייל
    onClose(); // סגור את המודל מיידית
  };

  return (
    <div className="modal-overlay">
      <div className="label-popup">
        <h5 className="popup-title">Assign to category:</h5>
        <div className="label-list">
          {labels.map((label) => (
            <button
              key={label._id}
              className="label-item"
              onClick={() => handleSelect(label._id)}
            >
              {label.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default LabelSelectorModal;
