import React, { useState } from "react";
import MailHeader from "./MailHeader";
import MailBody from "./MailBody";
import { toggleStarMail } from "../../services/mailsService";

const MailView = ({ mail: initialMail }) => {
  const [mail, setMail] = useState(initialMail);

  const handleToggleStar = async (id) => {
    try {
      const updated = await toggleStarMail(id);
      setMail(updated); // ← מעדכן את כל המייל לפי מה שהשרת החזיר
    } catch (err) {
      console.error("שגיאה בסימון כוכב", err);
    }
  };

  return (
    <div className="flex-grow-1 p-4" style={{ minHeight: "100vh", backgroundColor: "#f8f9fa" }}>
      <div className="bg-white border rounded shadow-sm p-4"
           style={{ maxWidth: "1000px", margin: "0 auto", minHeight: "calc(100vh - 40px)" }}>
        <MailHeader mail={mail} onToggleStar={handleToggleStar} />
        <hr />
        <MailBody content={mail.content} />
      </div>
    </div>
  );
};

export default MailView;
