import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import MailList from "../components/mail/MailList";
import { getMailsByLabel } from "../services/mailsService";
import { getLabelById } from "../services/mailsService";

// Page to display mails that belong to a specific label
const LabelPage = ({ refreshTrigger, triggerRefresh }) => {
  // Get labelId from the route parameters (URL)
  const { labelId } = useParams();
  const [mails, setMails] = useState([]);
  const [, setLabelName] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch both the mails and the label's name
    const fetchMailsAndLabel  = async () => {
      try {
        // Get mails that have the current label
        const data = await getMailsByLabel(parseInt(labelId));
        const sorted = data.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        setMails(sorted);
        const labelData = await getLabelById(parseInt(labelId));
        setLabelName(labelData.name);
      } catch (err) {
        console.error("Error retrieving emails by label:", err);
        setMails([]);
        setLabelName("");
      } finally {
        setLoading(false);
      }
    };
    fetchMailsAndLabel();
  }, [labelId, refreshTrigger]);

  if (loading) return null;

  return (
    <div className="container p-3">
      {/* Display list of mails for the selected label */}
      <MailList mails={mails} viewType="label" selectedLabelId={parseInt(labelId)}  onRefresh={triggerRefresh} />

    </div>
  );
};

export default LabelPage;
