import React, { useState, useEffect } from "react";
import { useNavigate  } from "react-router-dom";
import MailHeader from "./MailHeader";
import MailBody from "./MailBody";
import { toggleStarred, toggleSpam, deleteMail, assignLabelsToMail,getUserById } from "../../services/api";
import { getUserIdFromToken } from "../../services/authService";
import {fetchLabels } from "../../services/labelsService";
import LabelSelectorModal from "../mail/LabelSelectorModal";
import { restoreMail } from "../../services/mailsService"; 


const MailView = ({ mail: initialMail, viewType }) => {
  const [mail, setMail] = useState(initialMail);
  const [sender, setSender] = useState(null);
  const [, setReceiver] = useState(null);
  const [showLabelModal, setShowLabelModal] = useState(false);
  const [, setLabels] = useState([]);
  const [recipients, setRecipients] = useState([]);
  const navigate = useNavigate();
  

  useEffect(() => {
    if (!mail) return;

    const currentUserId = getUserIdFromToken();
    const isSent = mail.from === currentUserId;
   

    if (mail.from) {
      getUserById(mail.from).then(setSender).catch(console.error);
    }
    if (isSent && mail.to?.[0]) {
      getUserById(mail.to[0]).then(setReceiver).catch(console.error);
    }
  }, [mail]);


  useEffect(() => {
    const loadLabels = async () => {
      try {
        const result = await fetchLabels();
        setLabels(result);
      } catch (err) {
        console.error("Failed to load labels", err);
      }
    };
    loadLabels();
  }, []);


  useEffect(() => {
    if (mail?.to?.length) {
      Promise.all(mail.to.map(id => getUserById(id)))
        .then(setRecipients)
        .catch(console.error);
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

  const handleLabelClick = () => {
    setShowLabelModal(true);
  };

  const handleRestore = async (id) => {
    try {
      await restoreMail(id);
      navigate(-1); // חזרה לעמוד הקודם אחרי השחזור
    } catch (err) {
      console.error("Error restoring mail", err);
    }
  };


  
  if (!mail) {
  return <p className="text-center mt-5">Loading...</p>;
}

  return (
    <div
      className="flex-grow-1 p-4"
      style={{
      minHeight: "100vh",
      backgroundColor: "#ffffff",  
     color: "#000000"             
     }}
    >
      <div className="bg-white border rounded shadow-sm p-4"
           style={{ maxWidth: "1000px", margin: "0 auto", minHeight: "calc(100vh - 40px)" }}>
        <MailHeader
          mail={mail}
          onLabel={handleLabelClick}
          onToggleStar={handleToggleStar}
          onMarkSpam={handleMarkSpam}
          onDelete={handleMarkDelete}
          sender={sender}
          recipients={recipients}
          onRestore={handleRestore}
          viewType={viewType}
        />
        <hr />
        <MailBody content={mail.content} />
        {showLabelModal && (
          <LabelSelectorModal
            onClose={() => setShowLabelModal(false)}
            onAssign={async (labelId) => {
              const updatedMail = await assignLabelsToMail(mail.id, [labelId]); 
              setMail(updatedMail);
              setShowLabelModal(false);
            }}
            onCreateNew={() => {
              setShowLabelModal(false);
              setTimeout(() => setShowLabelModal(true), 100); // מאפשר פתיחה מחדש ל-Create בתוך LabelSelectorModal
            }}
          />
        )}


      </div>
    </div>
  );
};

export default MailView;