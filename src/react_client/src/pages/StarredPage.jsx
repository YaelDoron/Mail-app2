import React, { useEffect, useState } from "react";
import MailList from "../components/mail/MailList";
import { getStarredMails } from "../services/mailsService";


const StarredPage = ({ refreshTrigger, triggerRefresh }) => { // ✅
  const [mails, setMails] = useState([]);

  useEffect(() => {
    const fetchstarredMails = async () => {
      try {
        const data = await getStarredMails();
        setMails(data.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)));
      } catch (err) {
        console.error("Failed to load starred mails:", err);
      }
    };
    fetchstarredMails();
  }, [refreshTrigger]); // ✅

  return (
    <div className="container p-3">
      <MailList mails={mails} viewType="starred" onRefresh={triggerRefresh}/>
    </div>
  );
};

export default StarredPage;