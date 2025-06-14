import React, { useEffect, useState } from "react";
import MailList from "../components/mail/MailList";
import { getGarbageMails } from "../services/mailsService";

const TrashPage = ({ refreshTrigger }) => { // ✅
  const [mails, setMails] = useState([]);

  useEffect(() => {
    const fetchTrash = async () => {
      try {
        const data = await getGarbageMails();
        setMails(data);
      } catch (err) {
        console.error("Failed to load Trash mails:", err);
      }
    };
    fetchTrash();
  }, [refreshTrigger]); // ✅

  return (
    <div className="container p-3">
      <MailList mails={mails} viewType="Trash" />
    </div>
  );
};

export default TrashPage;