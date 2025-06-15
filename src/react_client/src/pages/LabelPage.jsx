import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import MailList from "../components/mail/MailList";
import { getMailsByLabel } from "../services/mailsService";

const LabelPage = ({ refreshTrigger }) => {
// We will get the label name from the URL
  const { labelName } = useParams(); 
  const [mails, setMails] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMails = async () => {
      try {
        const data = await getMailsByLabel(labelName);
        setMails(data);
      } catch (err) {
        console.error("Error retrieving emails by label:", err);
        setMails([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMails();
  }, [labelName, refreshTrigger]);

  if (loading) return <p>Reload mails...</p>;

  return (
    <div>
      <MailList mails={mails} viewType={labelName} />
    </div>
  );
};

export default LabelPage;
