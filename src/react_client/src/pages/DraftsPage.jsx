import React, { useEffect, useState } from "react";
import MailList from "../components/mail/MailList";
import { getDraftMails } from "../services/mailsService";

const DraftsPage = () => {
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
  }, []);

  return (
    <div className="container p-3">
      <h3>Drafts</h3>
      <MailList mails={mails} viewType="Drafts" />
    </div>
  );
};

export default DraftsPage;
