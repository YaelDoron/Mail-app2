import React, { useEffect, useState } from "react";
import MailList from "../components/mail/MailList";
import { getGarbageMails } from "../services/mailsService";

// Page to display all mails moved to the trash
const TrashPage = ({ refreshTrigger, triggerRefresh }) => {
  const [mails, setMails] = useState([]);

  useEffect(() => {
    // Fetch mails from the trash 
    const fetchTrash = async () => {
      try {
        const data = await getGarbageMails();
        // Sort mails by newest first
        setMails(data.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)));
      } catch (err) {
        console.error("Failed to load Trash mails:", err);
      }
    };
    fetchTrash();
  }, [refreshTrigger]);

  return (
    <div className="container p-3">
       {/* Render trash mails list */}
      <MailList mails={mails} viewType="trash" onRefresh={triggerRefresh}/>
    </div>
  );
};

export default TrashPage;