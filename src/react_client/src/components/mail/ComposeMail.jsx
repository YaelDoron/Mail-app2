import React, { useState } from "react";
import RecipientsInput from "./RecipientsInput";
import Editor from "./Editor";
import { createMail, getUserIdByEmail } from "../../services/api"; 
import { getToken, getUserIdFromToken } from "../../services/authService";

const ComposeMail = ({ onClose }) => {
  const token = getToken();
  const userId = getUserIdFromToken();
  const [recipients, setRecipients] = useState([]);
  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");
  const [isMinimized, setIsMinimized] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const resetForm = () => {
    setRecipients([]);
    setSubject("");
    setContent("");
  };

const handleSend = async () => {
  console.log("TOKEN:", token);
  console.log("USER ID:", userId);
  if (!userId || !token) return;
  if (recipients.length === 0 || content.trim() === "") {
    alert("Please fill in both recipients and content before sending.");
    return;
  }
  try {
    const toUserIds = await Promise.all(
      recipients.map(email => getUserIdByEmail(email, token))
    );

    console.log("Sending mail with data:", {
  from: userId,
  to: toUserIds,
  subject,
  content,
  isDraft: false
});
    await createMail(
      {
        from: userId,
        to: toUserIds,
        subject,
        content,
        isDraft: false,
      },
      token
    );
    resetForm();
    onClose();
  } catch (err) {
    console.error("Failed to send mail:", err);
    alert("Failed to send mail. Please try again.");
  }
};


const handleClose = async () => {
  if (!userId || !token) return;

  const hasContent = recipients.length > 0 || subject.trim() || content.trim();
  if (hasContent) {
    try {
      const toUserIds = await Promise.all(
        recipients.map(email => getUserIdByEmail(email, token))
      );

      await createMail(
        {
          from: userId,
          to: toUserIds,
          subject,
          content,
          isDraft: true,
        },
        token
      );
    } catch (err) {
      console.error("Failed to save draft:", err);
    }
  }
  resetForm();
  onClose();
};


  const handleDelete = () => {
    resetForm();
    onClose();
  };

  return (
    <div
      className="shadow bg-white border"
      style={{
        position: "fixed",
        bottom: isExpanded ? "50%" : "0",
        right: isExpanded ? "50%" : "60px",
        transform: isExpanded ? "translate(50%, 50%)" : "none",
        width: isExpanded ? "800px" : "500px",
        maxHeight: isExpanded ? "90vh" : "auto",
        height: "auto",
        zIndex: 1050,
        borderTopLeftRadius: "1rem",
        borderTopRightRadius: "1rem",
        borderBottomLeftRadius: "0",
        borderBottomRightRadius: "0",
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <div
        className="d-flex justify-content-between align-items-center px-3 py-2 border-bottom"
        style={{ backgroundColor: "#f1f3f4" }}
      >
        <strong style={{ fontSize: "1rem" }}>New Message</strong>
        <div style={{ display: "flex", gap: "8px" }}>
          <button
            className="btn btn-sm p-1"
            title={isMinimized ? "Expand" : "Minimize"}
            onClick={() => setIsMinimized(!isMinimized)}
            style={{ fontSize: "1.25rem" }}
          >
            <b>{isMinimized ? "-" : "_"}</b>
          </button>
          <button
            className="btn btn-sm p-1"
            title={isExpanded ? "Restore" : "Expand"}
            onClick={() => setIsExpanded(!isExpanded)}
            style={{ fontSize: "1.25rem" }}
          >
            <b>{isExpanded ? "⇲" : "⤢"}</b>
          </button>
          <button
            className="btn btn-sm p-1"
            title="Close"
            onClick={handleClose}
            style={{ fontSize: "1.25rem" }}
          >
            <b>×</b>
          </button>
        </div>
      </div>
      {/* Body and Footer */}
      {!isMinimized && (
        <>
          <div className="px-3 pt-2" style={{ maxHeight: isExpanded ? "calc(100vh - 160px)" : "auto", overflowY: "auto" }}>
            <RecipientsInput recipients={recipients} setRecipients={setRecipients} />
            <Editor subject={subject} setSubject={setSubject} content={content} setContent={setContent} />
          </div>
          <div className="d-flex justify-content-between align-items-center px-3 py-2 border-top">
            <button
              className="btn btn-primary"
              style={{
                backgroundColor: "#1a73e8",
                color: "white",
                borderRadius: "2rem",
                padding: "6px 20px",
                fontWeight: "bold",
              }}
              onClick={handleSend}
            >
              Send
            </button>
            <button className="btn btn-sm p-1" title="Delete" onClick={handleDelete}>
              <i className="bi bi-trash" style={{ fontSize: "1rem" }}></i>
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default ComposeMail;
