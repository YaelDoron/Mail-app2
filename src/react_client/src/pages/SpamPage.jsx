import React, { useEffect, useState } from "react";
import MailList from "../components/mail/MailList";
import { getSpamMails } from "../services/mailsService";

const SpamPage = ({ refreshTrigger }) => { // ✅
  const [mails, setMails] = useState([]);

  useEffect(() => {
    const fetchSpam = async () => {
      try {
        const data = await getSpamMails();
        setMails(data);
      } catch (err) {
        console.error("Failed to load Spam:", err);
      }
    };
    fetchSpam();
  }, [refreshTrigger]); // ✅

  return (
    <div className="container p-3">
      <MailList mails={mails} viewType="spam" />
    </div>
  );
};

export default SpamPage;
