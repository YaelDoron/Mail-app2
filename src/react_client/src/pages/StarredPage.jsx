import React, { useEffect, useState } from "react";
import Sidebar from "../components/layout/Sidebar";
import Topbar from "../components/layout/Topbar";
import MailList from "../components/mail/MailList";
import { getAllMails } from "../services/mailsService";

const StarredPage = () => {
  const [starredMails, setStarredMails] = useState([]);

  useEffect(() => {
    const fetchStarred = async () => {
      try {
        const all = await getAllMails();
        const starred = all.filter(mail => mail.isStarred);
        setStarredMails(starred);
      } catch (err) {
        console.error("שגיאה בשליפת מיילים עם כוכב", err);
      }
    };

    fetchStarred();
  }, []);

  return (
    <div className="d-flex">
      <Sidebar />
      <div className="flex-grow-1">
        <Topbar />
        <div className="container mt-4">
          {starredMails.length > 0 ? (
            <MailList mails={starredMails} />
          ) : (
            <p className="text-muted">No starred mails yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default StarredPage;
