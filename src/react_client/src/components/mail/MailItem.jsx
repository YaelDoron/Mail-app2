import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { markMailAsRead, toggleStarred, getUserById } from "../../services/api";
import "./MailItem.css";

function MailItem({ mail, viewType, isSelected, onSelectChange }) {
  const [isRead, setIsRead] = useState(mail.isRead || false);
  const [isStarred, setIsStarred] = useState(mail.isStarred || false);
  const [displayName, setDisplayName] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchName = async () => {
      try {
        if (viewType === "sent") {
          const names = await Promise.all(
            mail.to.map(async (id) => {
              const user = await getUserById(id);
              return `${user.firstName} ${user.lastName}`;
            })
          );
          setDisplayName(names.join(", "));
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

  const handleMailClick = async () => {
    if (!isRead && viewType !== "sent" && !mail.isDraft) {
      try {
        await markMailAsRead(mail.id);
        setIsRead(true);
      } catch (error) {
        console.error("Failed to mark as read", error);
      }
    }
    navigate(`/mail/${mail.id}`);
  };

  const handleStarClick = async (e) => {
    e.stopPropagation();
    try {
      setIsStarred((prev) => !prev);
      await toggleStarred(mail.id);
    } catch (error) {
      console.error("Failed to toggle star", error);
    }
  };

  const handleCheckboxClick = (e) => {
    e.stopPropagation();
    onSelectChange(mail.id, !isSelected);  // העדכון נעשה מבחוץ
  };

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
        <div
          className={`star-icon ${isStarred ? "starred" : ""}`}
          onClick={handleStarClick}
        >
          <i className={`bi ${isStarred ? "bi-star-fill" : "bi-star"}`}></i>
        </div>

        <div className="mail-display-name">
          {displayName}
        </div>
      </div>

      <div className="mail-box-center">
        <span className="subject">
          {mail.subject?.trim() ? mail.subject : "No Subject"}
        </span>
        <span className="preview">
          {" – " + (mail.content?.slice(0, 40) || "")}
        </span>
      </div>

      <div className="mail-box-right">
        <span className="mail-time">
          {formatDate(mail.createdAt)}
        </span>
      </div>
    </div>
  );
}

export default MailItem;
