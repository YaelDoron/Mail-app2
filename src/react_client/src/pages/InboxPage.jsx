import React, { useEffect, useState } from "react";
import MailList from "../components/mail/MailList";
import { getInboxMails } from "../services/mailsService";

const InboxPage = ({ refreshTrigger, triggerRefresh }) => { // ✅ גם את זה נוסיף
  const [mails, setMails] = useState([]);

  useEffect(() => {
    const fetchInbox = async () => {
      try {
        const data = await getInboxMails();
        const sorted = data.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

        // ✅ NEW – avoid unnecessary render if no change
        if (JSON.stringify(sorted) !== JSON.stringify(mails)) {
          setMails(sorted);
        }

      } catch (err) {
        console.error("Failed to load inbox mails:", err);
      }
    };
    fetchInbox();
    const interval = setInterval(fetchInbox, 5000); // ✅ NEW – auto-refresh every 5 sec
    return () => clearInterval(interval); // ✅ NEW – cleanup
  }, [refreshTrigger, mails]); // ✅ useEffect תלוי ברענון

  return (
    <div className="container p-3">
      <MailList mails={mails} viewType="inbox" onRefresh={triggerRefresh} /> 
    </div>
  );
};

export default InboxPage;


