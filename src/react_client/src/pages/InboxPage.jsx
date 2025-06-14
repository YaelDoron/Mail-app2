import React, { useEffect, useState } from "react";
import MailList from "../components/mail/MailList";
import { getInboxMails } from "../services/mailsService";

const InboxPage = ({ refreshTrigger }) => { // ✅ קיבלנו את ה-prop
  const [mails, setMails] = useState([]);

  useEffect(() => {
    const fetchInbox = async () => {
      try {
        const data = await getInboxMails();
        setMails(data);
      } catch (err) {
        console.error("Failed to load inbox mails:", err);
      }
    };
    fetchInbox();
  }, [refreshTrigger]); // ✅ useEffect תלוי ברענון

  return (
    <div className="container p-3">
      <MailList mails={mails} viewType="inbox" />
    </div>
  );
};

export default InboxPage;


