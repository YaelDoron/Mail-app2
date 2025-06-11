import React, { useEffect, useState } from "react";
import { getSentMails } from "../services/mailsService";
import MailList from "../components/mail/MailList";
import MailLayout from "../layouts/MailLayout";

const SentPage = () => {
  const [sentMails, setSentMails] = useState([]);

  useEffect(() => {
    const fetchSent = async () => {
      try {
        const mails = await getSentMails();
        setSentMails(mails);
      } catch (err) {
        console.error("שגיאה בשליפת מיילים שנשלחו", err);
      }
    };

    fetchSent();
  }, []);

  return (
    <MailLayout>
      {sentMails.length > 0 ? (
        <MailList mails={sentMails} />
      ) : (
        <p className="text-muted">No sent mails found.</p>
      )}
    </MailLayout>
  );
};

export default SentPage;
