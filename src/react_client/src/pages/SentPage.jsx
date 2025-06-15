import React, { useEffect, useState } from "react";
import MailList from "../components/mail/MailList";
import { getSentMails } from "../services/mailsService";


const SentPage = ({ refreshTrigger }) => { // ✅ הוספת refreshTrigger
  const [mails, setMails] = useState([]);

  useEffect(() => {
    const fetchSentMails = async () => {
      try {
        const data = await getSentMails();
        setMails(data);
      } catch (err) {
        console.error("Failed to load sent mails:", err);
      }
    };
    fetchSentMails();
    }, [refreshTrigger]); // ✅ הוספה לתלות

  return (
    <div className="container p-3">
      <MailList mails={mails} viewType="sent" />
    </div>
  );
};

export default SentPage;