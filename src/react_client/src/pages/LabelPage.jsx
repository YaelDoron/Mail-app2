import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import MailList from "../components/mail/MailList";
import { getMailsByLabel } from "../services/mailsService";
import { getLabelById } from "../services/mailsService";

const LabelPage = () => {
// We will get the label name from the URL
  const { labelId } = useParams();
  const [mails, setMails] = useState([]);
  const [labelName, setLabelName] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMailsAndLabel  = async () => {
      try {
        const data = await getMailsByLabel(parseInt(labelId));
        setMails(data);
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

    fetchMailsAndLabel ();
  }, [labelId]);

  if (loading) return <p>Reload mails...</p>;

  return (
    <div>
      <h4 className="px-4 my-3">Label: {labelName}</h4>
      <MailList mails={mails} viewType="label" />
    </div>
  );
};

export default LabelPage;
