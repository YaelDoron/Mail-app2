import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import MailList from "../components/mail/MailList";
import { getMailsByLabel } from "../services/mailsService";
import { getLabelById } from "../services/mailsService";

const LabelPage = ({ refreshTrigger, triggerRefresh }) => {
// We will get the label name from the URL
  const { labelId } = useParams();
  const [mails, setMails] = useState([]);
  const [labelName, setLabelName] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMailsAndLabel  = async () => {
      try {
        const data = await getMailsByLabel(parseInt(labelId));
        const sorted = data.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)); // ✅ NEW – מיון כמו בטראש
        setMails(sorted); // ✅ MODIFIED – במקום setMails(data)
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
      <MailList mails={mails} viewType="label" selectedLabelId={parseInt(labelId)}  onRefresh={triggerRefresh} />

    </div>
  );
};

export default LabelPage;
