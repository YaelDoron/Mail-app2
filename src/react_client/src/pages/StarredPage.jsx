import React, { useEffect, useState } from "react";
import MailList from "../components/mail/MailList";
import { getStarredMails } from "../services/mailsService";


const StarredPage = () => {
  const [mails, setMails] = useState([]);

  useEffect(() => {
    const fetchstarredMails = async () => {
      try {
        const data = await getStarredMails();
        setMails(data);
      } catch (err) {
        console.error("Failed to load starred mails:", err);
      }
    };
    fetchstarredMails();
  }, []);

  return (
    <div className="container p-3">
      <h3>Starred</h3>
      <MailList mails={mails} viewType="Starred" />
    </div>
  );
};

export default StarredPage;