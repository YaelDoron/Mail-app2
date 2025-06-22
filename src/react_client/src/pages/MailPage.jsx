import { useParams,useLocation  } from "react-router-dom";
import { useEffect, useState } from "react";
import { getMailById, getDeletedMailById } from "../services/mailsService";
import MailView from "../components/mail/MailView";

// Page for displaying a single mail
const MailPage = () => {
  const { id } = useParams();
  const [mail, setMail] = useState(null);
  const location = useLocation();
  const viewType = location.state?.viewType;


useEffect(() => {
  // Fetch the mail from server
  const fetchMail = async () => {
    try {
      const data =
      viewType === "trash"
        ? await getDeletedMailById(id) // Fetch from trash
        : await getMailById(id); // Fetch from inbox/sent

      if (data) {
        setMail(data);
      } else {
        throw new Error("Mail not found");
      }
    } catch (err) {
      console.warn("error in Mail retrieval", err);
    }
  };
  // Call fetch function on mount or when id/viewType changes
  fetchMail();
}, [id,viewType]);

  if (!mail) return null;

  return (
      // Render the mail in the view component
      <MailView mail={mail} viewType={viewType}/>
  );
};

export default MailPage;