import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getMailById } from "../services/mailsService";
import MailView from "../components/mail/MailView";





const MailPage = () => {
  const { id } = useParams();
  const [mail, setMail] = useState(null);


useEffect(() => {
  const fetchMail = async () => {
    try {
      const data = await getMailById(id);
      if (data) {
        setMail(data);
      } else {
        throw new Error("Mail not found");
      }
    } catch (err) {
      console.warn("error in Mail retrieval", err);
    }
  };

  fetchMail();
}, [id]);

  if (!mail) return <p>Loading...</p>;

  return (
      <MailView mail={mail} />
  );
};

export default MailPage;