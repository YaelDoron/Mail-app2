import React, { useEffect, useState } from "react";
import MailList from "../components/mail/MailList";
import { getStarredMails } from "../services/mailsService";

// Page to display all mails that the user has marked as starred
const StarredPage = ({ refreshTrigger, triggerRefresh }) => {
  const [mails, setMails] = useState([]);

  useEffect(() => {
    // Fetch starred mails from the server
    const fetchstarredMails = async () => {
      try {
        const data = await getStarredMails();
        // Sort mails by timestamp, newest first
        setMails(data.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)));
      } catch (err) {
        console.error("Failed to load starred mails:", err);
      }
    };
    fetchstarredMails();
  }, [refreshTrigger]);

  return (
    <div className="container p-3">
       {/* Display list of starred mails */}
      <MailList mails={mails} viewType="starred" onRefresh={triggerRefresh}/>
    </div>
  );
};

export default StarredPage;