import React, { useEffect, useState } from "react";
import MailList from "../components/mail/MailList";
import { getSpamMails } from "../services/mailsService";

// Page to display all mails marked as spam
const SpamPage = ({ refreshTrigger, triggerRefresh }) => {
  const [mails, setMails] = useState([]);

  useEffect(() => {
    // Fetch spam mails from the server
    const fetchSpam = async () => {
      try {
        const data = await getSpamMails();
        // Sort mails by newest first
        setMails(data.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)));
      } catch (err) {
        console.error("Failed to load Spam:", err);
      }
    };
    fetchSpam();
  }, [refreshTrigger]);

  return (
    <div className="container p-3">
      {/* Display list of spam mails */}
      <MailList mails={mails} viewType="spam" onRefresh={triggerRefresh}/>
    </div>
  );
};

export default SpamPage;
