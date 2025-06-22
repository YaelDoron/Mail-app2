import React, { useEffect, useState } from "react";
import MailList from "../components/mail/MailList";
import { getDraftMails } from "../services/mailsService";
import ComposeMail from "../components/mail/ComposeMail";

// Page that displays all draft mails for the logged-in user
// Allows editing a draft using ComposeMail component
const DraftsPage = ({ refreshTrigger, triggerRefresh }) => {
  const [mails, setMails] = useState([]);
  const [editDraft, setEditDraft] = useState(null);

  useEffect(() => {
    const fetchDrafts = async () => {
      try {
        const data = await getDraftMails();
        // Sort drafts from newest to oldest
        setMails(data.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)));
      } catch (err) {
        console.error("Failed to load Drafts:", err);
      }
    };
    fetchDrafts();
  }, [refreshTrigger]);

  return (
    <div className="container p-3">

      {/* List of all drafts, with edit support */}
      <MailList
        mails={mails}
        viewType="draft"
        onRefresh={triggerRefresh}
        onEditDraft={setEditDraft}
      />

      {/* If a draft is being edited, show the ComposeMail component */}
      {editDraft && (
        <ComposeMail
          draft={editDraft}
          onClose={() => setEditDraft(null)}
          onMailSent={triggerRefresh}
        />
      )}
      
    </div>
  );
};

export default DraftsPage;
