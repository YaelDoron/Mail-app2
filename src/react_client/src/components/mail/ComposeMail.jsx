import React, { useState, useEffect } from "react";
import RecipientsInput from "./RecipientsInput";
import Editor from "./Editor";
import { createMail, getUserIdByEmail, getUserById, sendDraft, updateDraft, deleteMail } from "../../services/api"; 
import { getToken, getUserIdFromToken } from "../../services/authService";

const ComposeMail = ({ onClose, onMailSent, draft = null }) => { 
  const token = getToken();
  const userId = getUserIdFromToken();
  const [recipients, setRecipients] = useState([]);
  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");
  const [isMinimized, setIsMinimized] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  
  useEffect(() => {
    if (draft) {
      const loadRecipients = async () => {
        const emails = await Promise.all(
          draft.to.map(async (id) => {
            const user = await getUserById(id); 
            return user.email;
          })
        );
        setRecipients(emails);
        setSubject(draft.subject || "");
        setContent(draft.content || "");
      };
      loadRecipients();
    }
  }, [draft]);

  const isValidMailsnapEmail = (email) => /^[a-zA-Z0-9._%+-]+@mailsnap\.com$/.test(email); 

  const resetForm = () => {
    setRecipients([]);
    setSubject("");
    setContent("");
  };

const handleSend = async () => {
  if (!userId || !token) return;
  if (recipients.length === 0) {
    alert("Please fill recipients before sending.");
    return;
  }
  const invalidRecipients = recipients.filter(email => !isValidMailsnapEmail(email)); 
  if (invalidRecipients.length > 0) {
    alert(`Invalid recipient address: ${invalidRecipients.join(", ")}`); 
    return;
  }
  try {
        let toUserIds;
    try {
      toUserIds = await Promise.all(
        recipients.map(email => getUserIdByEmail(email, token))
      );
    } catch (err) {
      alert("One or more recipients do not exist.");
      return;
    }


    const finalSubject = subject.trim() || "(no subject)";
    const finalContent = content.trim() || " ";

    
    if (draft) {
        await updateDraft(draft.id, {
          to: toUserIds,
          subject: finalSubject,
          content: finalContent,
        });
        await sendDraft(draft.id, token);
      } else {
        await createMail(
          {
            from: userId,
            to: toUserIds,
            subject: finalSubject,
            content: finalContent,
            isDraft: false,
          },
          token
        );
      }
    resetForm();
    onClose();
    onMailSent?.(); 
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
        let toUserIds;
    try {
      toUserIds = await Promise.all(
        recipients.map(email => getUserIdByEmail(email, token))
      );
    } catch (err) {
      alert("One or more recipients do not exist. Draft was not saved.");
      return;
    }

      const finalSubject = subject.trim() || "(no subject)";
      const finaltContent= content.trim() || " ";

      if (draft) {
          await updateDraft(draft.id, {
            to: toUserIds,
            subject: finalSubject,
            content,
          });
        } else {
          await createMail(
            {
              from: userId,
              to: toUserIds,
              subject: finalSubject,
              content: finaltContent,
              isDraft: true,
            },
            token
          );
        }
      } catch (err) {
        console.error("Failed to save draft:", err);
      }
  }
  resetForm();
  onClose();
  onMailSent?.();
};


  const handleDelete = async () => {
  try {
    if (draft?.id) {
      await deleteMail(draft.id); 
    }
  } catch (err) {
    console.error("Failed to delete draft:", err);
  }

  resetForm();
  onClose();
  onMailSent?.(); 
};

  return (
    <div
      className="compose-modal shadow bg-white border"
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
            onClick={() => {
              if (isMinimized) {
              setIsMinimized(false); 
              } else {
              setIsExpanded(false);  
              setIsMinimized(true);  
              }
            }}
            style={{ fontSize: "1.25rem" }}
          >
           <b>{isMinimized ? "-" : "_"}</b>
          </button>

          <button
            className="btn btn-sm p-1"
            title={isExpanded ? "Restore" : "Expand"}
            onClick={() => {
              if (isMinimized) {
              setIsMinimized(false);  
              setIsExpanded(true);     
              } else {
              setIsExpanded(prev => !prev); 
              }
            }}
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