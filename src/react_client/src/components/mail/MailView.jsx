import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MailHeader from "./MailHeader";
import MailBody from "./MailBody";
import { getUserById } from "../../services/api";
import { toggleStarred, toggleSpam, deleteMail } from "../../services/api";
import { getUserIdFromToken } from "../../services/authService";


const MailView = ({ mail: initialMail }) => {
  const [mail, setMail] = useState(initialMail);
  const [sender, setSender] = useState(null);
  const [, setReceiver] = useState(null);

  const navigate = useNavigate();
  

  useEffect(() => {
  if (mail?.from) {
    getUserById(mail.from).then(setSender).catch(console.error);
  }
  const currentUserId = getUserIdFromToken();
  const isSent = mail.from === currentUserId;
  if (isSent && mail.to?.[0]) {
    getUserById(mail.to[0]).then(setReceiver).catch(console.error);
  }
  }, [mail]);

  const handleToggleStar = async (id) => {
    try {
      const updated = await toggleStarred(id);
      setMail(updated);
    } catch (err) {
      console.error("error in marking as starred", err);
    }
  };

  const handleMarkSpam = async (id) => {
    try {
      await toggleSpam(id);
    } catch (err) {
      console.error("Error marking mail as spam", err);
    }
  };

  const handleMarkDelete = async (id) => {
    try {
      await deleteMail(id);
      navigate(-1);
    } catch (err) {
      console.error("Error marking mail as trash", err);
    }
  };


  return (
    <div className="flex-grow-1 p-4" style={{ minHeight: "100vh", backgroundColor: "#f8f9fa" }}>
      <div className="bg-white border rounded shadow-sm p-4"
           style={{ maxWidth: "1000px", margin: "0 auto", minHeight: "calc(100vh - 40px)" }}>
        <MailHeader
          mail={mail}
          onToggleStar={handleToggleStar}
          onMarkSpam={handleMarkSpam}
          onDelete={handleMarkDelete}
          sender={sender}
        />
        <hr />
        <MailBody content={mail.content} />
      </div>
    </div>
  );
};

export default MailView;
