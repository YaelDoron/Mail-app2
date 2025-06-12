import React, { useEffect, useState } from "react";
import MailList from "../components/mail/MailList";
import { getSpamMails } from "../services/mailsService";

const SpamPage = () => {
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
  }, []);

  return (
    <div className="container p-3">
      <h3>Spam</h3>
      <MailList mails={mails} viewType="Spam" />
    </div>
  );
};

export default SpamPage;
