import React, { useEffect, useState } from "react";
import MailList from "../components/mail/MailList";
import { getSentMails } from "../services/mailsService";

// Page to display mails that the user has sent
const SentPage = ({ refreshTrigger, triggerRefresh }) => { 
  const [mails, setMails] = useState([]);

  useEffect(() => {
    // Fetch sent mails from the server
    const fetchSentMails = async () => {
      try {
        const data = await getSentMails();
        // Sort mails by newest first
        setMails(data.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)));
      } catch (err) {
        console.error("Failed to load sent mails:", err);
      }
    };
    fetchSentMails();
    }, [refreshTrigger]); 

  return (
    <div className="container p-3">
      {/* Display the list of sent mails */}
      <MailList mails={mails} viewType="sent" onRefresh={triggerRefresh}/>
    </div>
  );
};

export default SentPage;