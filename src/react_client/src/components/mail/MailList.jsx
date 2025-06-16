import React, { useState } from "react";
import { markMailAsRead, toggleSpam, deleteMail, assignLabelsToMail } from "../../services/api";
import MailItem from "./MailItem";
import "./MailList.css";
import LabelSelectorModal from "./LabelSelectorModal";

function MailList({ mails, viewType, onRefresh }) { // ✅ הוספת onRefresh
  const [selectedIds, setSelectedIds] = useState([]);
  const [showLabelModal, setShowLabelModal] = useState(false);

  const handleSelectChange = (id, selected) => {
    setSelectedIds((prev) =>
      selected ? [...prev, id] : prev.filter((x) => x !== id)
    );
  };

  const handleMarkAsRead = async () => {
    for (const id of selectedIds) {
      await markMailAsRead(id);
    }
    setSelectedIds([]);
    onRefresh?.(); // ✅ טריגר רענון
  };

  const handleMarkSpam = async () => {
    for (const id of selectedIds) {
      await toggleSpam(id);
    }
    setSelectedIds([]);
    onRefresh?.(); // ✅ טריגר רענון
  };

  const handleDelete = async () => {
    for (const id of selectedIds) {
      await deleteMail(id);
    }
    setSelectedIds([]);
    onRefresh?.(); // ✅ טריגר רענון
  };

  const handleAssignLabel = async (labelId) => {
    for (const id of selectedIds) {
      await assignLabelsToMail(id, [labelId]);
    }
    setSelectedIds([]);
    setShowLabelModal(false);
  };

  return (
  <div>
    {selectedIds.length > 0 && (
      <div className="mail-toolbar">
        <button className="icon-button" onClick={handleDelete} title="Delete">
          <i className="bi bi-trash3"></i>
        </button>
        <button className="icon-button" onClick={handleMarkAsRead} title="Mark as read">
          <i className="bi bi-envelope-open"></i>
        </button>
        <button className="icon-button" onClick={handleMarkSpam} title="Report spam">
          <i className="bi bi-exclamation-octagon"></i>
        </button>
        <button
          className="icon-button"
          onClick={() => setShowLabelModal(true)}
          title="Label"
        >
          <i className="bi bi-folder-symlink"></i>
        </button>
      </div>
    )}

    {showLabelModal && (
      <LabelSelectorModal
        onClose={() => setShowLabelModal(false)}
        onAssign={handleAssignLabel}
        selectedMailCount={selectedIds.length}
      />
    )}

    {mails.map((mail) => (
      <MailItem
        key={mail.id}
        mail={mail}
        viewType={viewType}
        isSelected={selectedIds.includes(mail.id)}
        onSelectChange={handleSelectChange}
        onRefresh={onRefresh}
      />
    ))}
  </div>
);
}

export default MailList;
