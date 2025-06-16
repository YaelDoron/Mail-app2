import React, { useEffect, useState } from "react";
import MailList from "../components/mail/MailList";
import { getDraftMails } from "../services/mailsService";

const DraftsPage = ({ refreshTrigger, triggerRefresh }) => { // ✅
  const [mails, setMails] = useState([]);

  useEffect(() => {
    const fetchDrafts = async () => {
      try {
        const data = await getDraftMails();
        setMails(data.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)));
      } catch (err) {
        console.error("Failed to load Drafts:", err);
      }
    };
    fetchDrafts();
  }, [refreshTrigger]); // ✅

  return (
    <div className="container p-3">
      <MailList mails={mails} viewType="draft" onRefresh={triggerRefresh}/>
    </div>
  );
};

export default DraftsPage;
