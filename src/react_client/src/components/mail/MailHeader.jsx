import React, { useState } from "react";
import { Dropdown } from "react-bootstrap";
import {
  FaEllipsisV, FaTrash, FaExclamationCircle, FaTag,
  FaStar, FaRegStar
} from "react-icons/fa";
import { toggleStarMail } from "../../services/mailsService";


const MailHeader = ({ mail, onToggleStar, onDelete, onMarkSpam, onLabel }) => {
  const [starred, setStarred] = useState(mail.isStarred || false);

  const handleStarToggle = () => {
    setStarred(!starred);
    onToggleStar && onToggleStar(mail.id, !starred);
  };

  return (
    <>
      {/* נושא + תווית */}
      <div className="mb-3">
        <div className="d-flex align-items-center flex-wrap">
          <h4 className="fw-bold mb-0 me-2">{mail.subject}</h4>
          {mail.label && (
            <span className="badge bg-secondary">{mail.label}</span>
          )}
        </div>
      </div>



      {/* מידע על השולח */}
      <div className="d-flex justify-content-between align-items-start">
        {/* תמונת פרופיל ושם */}
        <div className="d-flex">
          <div className="rounded-circle bg-secondary-subtle text-dark d-flex align-items-center justify-content-center me-3"
            style={{
              width: "50px",
              height: "50px",
              fontSize: "1.2rem",
              fontWeight: "bold"
            }}>
            {mail.senderName?.charAt(0)}
          </div>

          <div>
            <div className="fw-bold">{mail.senderName} &lt;{mail.sender}&gt;</div>
            <div className="text-muted small">to me</div>
          </div>
        </div>

        {/* שעה + כוכב + תפריט */}
        <div className="d-flex align-items-center">
          <span className="text-muted small me-3">{new Date(mail.date).toLocaleString()}</span>

          <span
            onClick={handleStarToggle}
            className="me-3"
            style={{ cursor: "pointer", color: starred ? "gold" : "gray" }}
          >
            {starred ? <FaStar /> : <FaRegStar />}
          </span>

          <Dropdown>
            <Dropdown.Toggle variant="light" size="sm" style={{ border: "none" }}>
              <FaEllipsisV />
            </Dropdown.Toggle>

            <Dropdown.Menu>
              <Dropdown.Item onClick={() => onDelete?.(mail.id)}>
                <FaTrash className="me-2" /> מחיקת ההודעה
              </Dropdown.Item>
              <Dropdown.Item onClick={() => onMarkSpam?.(mail.id)}>
                <FaExclamationCircle className="me-2" /> דיווח על ספאם
              </Dropdown.Item>
              <Dropdown.Item onClick={() => onLabel?.(mail.id)}>
                <FaTag className="me-2" /> שיוך לתווית
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>
      </div>
    </>
  );
};

export default MailHeader;
