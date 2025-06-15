import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function getToLine(mail, currentUserId, recipients = []) {
  if (!mail || !Array.isArray(mail.to)) return "";

  if (mail.from === currentUserId) {
    if (mail.to.length === 1 && mail.to[0] === currentUserId) {
      return "to me";
    } else {
      return "to " + mail.to.map(id => {
        if (id === currentUserId) return "me";
        const user = recipients.find(u => u.id === id);
        return user
          ? `${user.firstName} ${user.lastName} <${user.email}>`
          : `user ${id}`;
      }).join(", ");
    }
  } else {
    return "to me";
  }
}


const MailHeader = ({ mail,sender,recipients = [], onToggleStar, onDelete, onMarkSpam, onLabel }) => {
  const [starred, setStarred] = useState(mail.isStarred || false);
  const [markedSpam, setMarkedSpam] = useState(mail.isSpam || false);
  const navigate = useNavigate();
  const formattedDate = new Date(mail.timestamp).toLocaleString();
  const baseUrl = process.env.REACT_APP_API_BASE_URL?.replace("/api", "") || "";
  const imageUrl = sender?.image
    ? sender.image.startsWith("http")
      ? sender.image
      : `${baseUrl}/${sender.image}`
    : null;
  const currentUserId = mail.owner;
  const toLine = getToLine(mail, currentUserId, Array.isArray(recipients) ? recipients : []);



  const handleStarToggle = () => {
    setStarred(!starred);
    onToggleStar && onToggleStar(mail.id, !starred);
  };

  const handleMarkSpamClick = () => {
    if (onMarkSpam) {
      onMarkSpam(mail.id);
    }
    setMarkedSpam(true);
    setTimeout(() => navigate(-1), 300); // מאפשר לראות את האפקט
  };


  return (
       <div className="mb-3">

      {/* Report spam, delete and label as buttons*/}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div className="d-flex align-items-center gap-3">
          <span
            onClick={() => navigate(-1)}
            style={{ cursor: "pointer" }}
            title="Back"
          >
            <i className="bi bi-arrow-left"></i>
          </span>

          <span
            onClick={handleMarkSpamClick}
            style={{
              cursor: "pointer",
              color: markedSpam || mail.isSpam ? "red" : "inherit"
            }}
            title={mail.isSpam ? "Not spam" : "Report spam"}
          >
            <i className="bi bi-exclamation-octagon me-2"></i>
          </span>

          <span onClick={() => onDelete?.(mail.id)} style={{ cursor: "pointer" }} title="Delete">
            <i className="bi bi-trash"></i>
          </span>

          <span onClick={() => onLabel?.(mail.id)} style={{ cursor: "pointer" }} title="Label as">
            <i className="bi bi-tag"></i>
          </span>
        </div>
      </div>

      {/* topic and label*/}
      <div className="d-flex align-items-center flex-wrap mb-3">
        <h4 className="fw-bold mb-0 me-2">{mail.subject}</h4>
        {mail.label && (
          <span className="badge bg-secondary">{mail.label}</span>
        )}
      </div>

      {/*details of the sender, date and star*/}
      <div className="d-flex justify-content-between align-items-start">
        <div className="d-flex">
          {sender?.image ? (
           <img
            src={imageUrl}
            alt="Sender"
            className="rounded-circle me-3"
            style={{ width: "50px", height: "50px", objectFit: "cover" }}
          />


          ) : (
            <div className="rounded-circle bg-secondary-subtle text-dark d-flex align-items-center justify-content-center me-3"
              style={{
                width: "50px",
                height: "50px",
                fontSize: "1.2rem",
                fontWeight: "bold"
              }}>
              {sender?.firstName?.charAt(0)}
            </div>
          )}


          <div>
            <div className="fw-bold">{sender ? `${sender.firstName} ${sender.lastName}` : mail.senderName}{" "}
              &lt;{sender?.email}&gt;</div>
            <div className="text-muted small">{toLine}</div>
          </div>
        </div>

        <div className="d-flex align-items-center gap-3">
          <span className="text-muted small">{formattedDate}</span>

          <span
            onClick={handleStarToggle}
            style={{ cursor: "pointer", color: starred ? "gold" : "gray" }}
            title="Star"
          >
            <i className={`bi ${starred ? "bi-star-fill text-warning" : "bi-star text-secondary"}`}></i>
          </span>
        </div>
      </div>
    </div>
  );
};
export default MailHeader;
