import { useParams,useLocation  } from "react-router-dom";
import { useEffect, useState } from "react";
import { getMailById, getDeletedMailById } from "../services/mailsService";
import MailView from "../components/mail/MailView";


const MailPage = () => {
  const { id } = useParams();
  const [mail, setMail] = useState(null);
  const location = useLocation();
  const viewType = location.state?.viewType;


useEffect(() => {
  console.log("📨 MailPage - id:", id, "viewType:", viewType);
  const fetchMail = async () => {
    try {
      const data =
      viewType === "trash"
        ? await getDeletedMailById(id)
        : await getMailById(id);

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
}, [id,viewType]);

  if (!mail) return <p>Loading...</p>;

  return (
      <MailView mail={mail} viewType={viewType}/>
  );
};

export default MailPage;