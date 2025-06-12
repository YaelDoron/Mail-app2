import React, { useEffect, useState } from "react";
import MailList from "../components/mail/MailList";
import { getAllMails } from "../services/mailsService";

const AllMailsPage = () => {
  const [mails, setMails] = useState([]);

  useEffect(() => {
    const fetchAllMails = async () => {
      try {
        const data = await getAllMails();
        setMails(data);
      } catch (err) {
        console.error("Failed to load All mail:", err);
      }
    };
    fetchAllMails();
  }, []);

  return (
    <div className="container p-3">
      <h3>All Mail</h3>
      <MailList mails={mails} viewType="All Mail" />
    </div>
  );
};

export default AllMailsPage;
