import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import MailList from "../components/mail/MailList";
import { getMailsByLabel } from "../services/mailsService";

const LabelPage = () => {
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
  }, [labelName]);

  if (loading) return <p>Reload mails...</p>;

  return (
    <div>
      <h4 className="px-4 my-3">Label: {labelName}</h4>
      <MailList mails={mails} viewType={labelName} />
    </div>
  );
};

export default LabelPage;
