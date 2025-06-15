import React, { useEffect, useState } from "react";
import MailList from "../components/mail/MailList";
import { getDraftMails } from "../services/mailsService";

const DraftsPage = ({ refreshTrigger }) => { // ✅
  const [mails, setMails] = useState([]);

  useEffect(() => {
    const fetchDrafts = async () => {
      try {
        const data = await getDraftMails();
        setMails(data);
      } catch (err) {
        console.error("Failed to load Drafts:", err);
      }
    };
    fetchDrafts();
  }, [refreshTrigger]); // ✅

  return (
    <div className="container p-3">
      <MailList mails={mails} viewType="draft" />
    </div>
  );
};

export default DraftsPage;
