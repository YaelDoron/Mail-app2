import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { markMailAsRead, toggleStarred, getUserById } from "../../services/api";
import "./MailItem.css";

function MailItem({ mail, viewType, isSelected, onSelectChange, onRefresh, onEditDraft}) {
  const isRead = mail.isRead || false;
  const [isStarred, setIsStarred] = useState(mail.isStarred || false);
  const [displayName, setDisplayName] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchName = async () => {
      try {
        if (viewType === "sent" || viewType === "draft") {
          const names = await Promise.all(
            mail.to.map(async (id) => {
              const user = await getUserById(id);
              return `${user.firstName} ${user.lastName}`;
            })
          );
          setDisplayName("to: " + names.join(", "));
        } else {
          const user = await getUserById(mail.from);
          setDisplayName(`${user.firstName} ${user.lastName}`);
        }
      } catch (error) {
        console.error("Failed to fetch user info:", error);
      }
    };
    fetchName();
  }, [mail, viewType]);

   // Handle click on mail row: if unread, mark as read and navigate to mail page
  const handleMailClick = async () => {
    if (!isRead && viewType !== "sent" && !mail.isDraft) {
      try {
        await markMailAsRead(mail.id);
      } catch (error) {
        console.error("Failed to mark as read", error);
      }
    }
    // If it's a draft, open for editing
    if (mail.isDraft) {
        onEditDraft?.(mail); 
        return;
      }
    // Navigate to mail page with viewType state
    navigate(`/mailpage/${mail.id}`, { state: { viewType } });

  };

  // Toggle the star status
  const handleStarClick = async (e) => {
    e.stopPropagation();
    try {
      setIsStarred((prev) => !prev);
      await toggleStarred(mail.id);
    } catch (error) {
      console.error("Failed to toggle star", error);
    }
    onRefresh?.();
  };

  // Handle checkbox selection for bulk actions
  const handleCheckboxClick = (e) => {
    e.stopPropagation();
    onSelectChange(mail.id, !isSelected);  
  };

  // Format date nicely 
  const formatDate = (timestamp) => {
    const mailDate = new Date(timestamp);
    const now = new Date();

    const isToday = mailDate.toDateString() === now.toDateString();
    const isThisYear = mailDate.getFullYear() === now.getFullYear();

    if (isToday) return mailDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    if (isThisYear) return mailDate.toLocaleDateString([], { month: 'short', day: 'numeric' });
    return mailDate.toLocaleDateString();
  };

  return (
    <div className={`mail-box ${isRead ? "read" : "unread"}`} onClick={handleMailClick}>
      <div className="mail-box-left">
        <div className="check-box">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={handleCheckboxClick}
            onClick={(e) => e.stopPropagation()}
          />
        </div>

        {/* Star only in non-spam and non-trash views */}
        {viewType !== "spam" && viewType !== "trash" && (
          <div
            className={`star-icon ${isStarred ? "starred" : ""}`}
            onClick={handleStarClick}
          >
            <i className={`bi ${isStarred ? "bi-star-fill" : "bi-star"}`}></i>
          </div>
        )}

        {/* Display sender or "to: ..." */}
        <div className="mail-display-name">
          {displayName}
        </div>
      </div>

      {/* Middle section: subject and preview */}
      <div className="mail-box-center">
        <span className="subject">
          {mail.subject?.trim() ? mail.subject : "No Subject"}
        </span>
        <span className="preview">
          {" – " + (mail.content?.slice(0, 40) || "")}
        </span>
      </div>

      {/* Right section: timestamp */}
      <div className="mail-box-right">
        <span className="mail-time">
          {formatDate(mail.timestamp)}
        </span>
      </div>
    </div>
  );
}

export default MailItem;
