import React, { useEffect, useState } from "react";
import MailList from "../components/mail/MailList";
import { getInboxMails } from "../services/mailsService";

// Page to display inbox mails for the logged-in user
const InboxPage = ({ refreshTrigger, triggerRefresh }) => {
  const [mails, setMails] = useState([]);

  useEffect(() => {
    // Fetch inbox mails from the server
    const fetchInbox = async () => {
      try {
        const data = await getInboxMails();
        const sorted = data.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

        // Avoid unnecessary render if no change
        if (JSON.stringify(sorted) !== JSON.stringify(mails)) {
          setMails(sorted);
        }

      } catch (err) {
        console.error("Failed to load inbox mails:", err);
      }
    };
    fetchInbox();
    // Set interval to refresh inbox every 5 seconds
    const interval = setInterval(fetchInbox, 5000);
    // Clean up the interval
    return () => clearInterval(interval);
  }, [refreshTrigger, mails]);

  return (
    <div className="container p-3">
      {/* Render the mail list with inbox view */}
      <MailList mails={mails} viewType="inbox" onRefresh={triggerRefresh} /> 
    </div>
  );
};

export default InboxPage;


