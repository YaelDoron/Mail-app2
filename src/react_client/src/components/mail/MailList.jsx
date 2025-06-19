import React, { useState } from "react";
import { useNavigate  } from "react-router-dom";
import { markMailAsRead, toggleSpam, deleteMail, assignLabelsToMail, unassignLabelFromMail } from "../../services/api";
import { restoreMail } from "../../services/mailsService";
import MailItem from "./MailItem";
import "./MailList.css";
import LabelSelectorModal from "./LabelSelectorModal";

function MailList({ mails, viewType, onRefresh, onEditDraft, selectedLabelId }) {
  const [selectedIds, setSelectedIds] = useState([]);
  const [showLabelModal, setShowLabelModal] = useState(false);
  const navigate = useNavigate();
  
  // Handles checkbox selection for each mail
  const handleSelectChange = (id, selected) => {
    setSelectedIds((prev) =>
      selected ? [...prev, id] : prev.filter((x) => x !== id)
    );
  };

  // Marks selected mails as read
  const handleMarkAsRead = async () => {
    for (const id of selectedIds) {
      await markMailAsRead(id);
    }
    setSelectedIds([]);
    onRefresh?.();
  };

  // Toggles spam status (used for marking or unmarking spam)
  const handleMarkSpam = async () => {
    for (const id of selectedIds) {
      await toggleSpam(id);
    }
    setSelectedIds([]);
    onRefresh?.();
  };

  // Moves selected mails to trash
  const handleDelete = async () => {
    for (const id of selectedIds) {
      await deleteMail(id);
    }
    setSelectedIds([]);
    onRefresh?.();
  };

  // Assigns a label to selected mails
  const handleAssignLabel = async (labelId) => {
    for (const id of selectedIds) {
      await assignLabelsToMail(id, [labelId]);
    }
    setSelectedIds([]);
    setShowLabelModal(false);
  };
 
  // Remove mail from label
  const handleRemoveLabel = async () => {
  try {
    for (const id of selectedIds) {
      await unassignLabelFromMail(id, selectedLabelId);
    }
    setSelectedIds([]);
    onRefresh?.();
  } catch (err) {
    console.error("Error removing label", err);
  }
};

  // Restores mails from trash and navigates back
  const handleRestore = async () => {
    try {
      for (const id of selectedIds) {
        await restoreMail(id);
      }
      setSelectedIds([]);
      navigate(-1); // Go back after restore
    } catch (err) {
      console.error("Error restoring mail", err);
    }
  };


  return (
  <div>
    {selectedIds.length > 0 && (
      <div className="mail-toolbar">
        {viewType === "label" && (
          <button className="icon-button" onClick={handleRemoveLabel} title="Remove from label">
            <i className="bi bi-x-lg"></i>
          </button>
        )}
        {viewType === "trash" ? (
          <button className="icon-button" onClick={handleRestore} title="Restore">
            <i className="bi bi-arrow-counterclockwise"></i>
          </button>
        ) : (
          <button className="icon-button" onClick={handleDelete} title="Delete">
            <i className="bi bi-trash3"></i>
          </button>
        )}

        {/* Mark as read available when not in drafts and sent*/}
        {viewType !== "drats" && viewType !== "sent" &&(
          <button className="icon-button" onClick={handleMarkAsRead} title="Mark as read">
            <i className="bi bi-envelope-open"></i>
          </button>
        )}
        
        {/* Show spam button only if not in trash, draft or sent  */}
        {viewType !== "trash" && viewType !== "sent" && viewType !== "draft" &&(
          <button
            className="icon-button"
            onClick={handleMarkSpam}
            title={viewType === "spam" ? "Not spam" : "Report spam"}
          >
            <i className="bi bi-exclamation-octagon"></i>
          </button>
        )}

        {/* Show label only if not in spam, draft or trash */}
        {viewType !== "spam" && viewType !== "trash" && viewType !== "draft" && (
          <button
            className="icon-button"
            onClick={() => setShowLabelModal(true)}
            title="Label"
          >
            <i className="bi bi-folder-symlink"></i>
          </button>
        )}

      </div>
    )}

    {/* Label modal for assigning labels */}
    {showLabelModal && (
      <LabelSelectorModal
        onClose={() => setShowLabelModal(false)}
        onAssign={handleAssignLabel}
        selectedMailCount={selectedIds.length}
      />
    )}

    {/* Render list of mails */}
    {mails.map((mail) => (
      <MailItem
        key={mail.id}
        mail={mail}
        viewType={viewType}
        isSelected={selectedIds.includes(mail.id)}
        onSelectChange={handleSelectChange}
        onRefresh={onRefresh}
        onEditDraft={onEditDraft}
      />
    ))}
  </div>
);
}

export default MailList;
