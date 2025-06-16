import React, { useEffect, useState } from "react";
import MailList from "../components/mail/MailList";
import { getAllMailsUser } from "../services/mailsService";

const AllMailsPage = ({ refreshTrigger, triggerRefresh }) => { // ✅
  const [mails, setMails] = useState([]);

  useEffect(() => {
    const fetchAllMails = async () => {
      try {
        const data = await getAllMailsUser();
        setMails(data.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)));
      } catch (err) {
        console.error("Failed to load All mail:", err);
      }
    };
    fetchAllMails();
  }, [refreshTrigger]); // ✅

  return (
    <div className="container p-3">
      <MailList mails={mails} viewType="All Mail" onRefresh={triggerRefresh}/>
    </div>
  );
};

export default AllMailsPage;
