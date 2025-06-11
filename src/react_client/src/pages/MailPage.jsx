import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getMailById } from "../services/mailsService";
import MailView from "../components/mail/MailView";
import Topbar from "../components/layout/Topbar";
import Sidebar from "../components/layout/Sidebar";




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
      console.warn("בעיה בשליפת מייל:", err);
      // מייל דמה
      setMail({
        id: id,
        subject: "מייל לדוגמה",
        senderName: "מפתחת",
        sender: "dev@example.com",
        profilePicture: "https://i.pravatar.cc/150?img=45",
        date: new Date().toISOString(),
        content: "ככה ייראה מייל בודד בעתיד.",
        isStarred: false,
        labels: ["בדיקה"]
      });
    }
  };

  fetchMail();
}, [id]);

  if (!mail) return <p>Loading...</p>;

  return (
    <div style={{ height: "100vh" }}>
      <Topbar /> 
      <div className="d-flex">
        <Sidebar />
        <MailView mail={mail} />
      </div>
    </div>
  );
};

export default MailPage;