import React from "react";
import MailHeader from "./MailHeader";
import MailBody from "./MailBody";

const MailView = ({ mail }) => {
  return (
    <div className="flex-grow-1 p-4"
         style={{
           minHeight: "100vh",
           backgroundColor: "#f8f9fa"
         }}>
      <div className="bg-white border rounded shadow-sm p-4"
           style={{
             maxWidth: "1000px",
             margin: "0 auto",
             minHeight: "calc(100vh - 40px)"
           }}>
        <MailHeader mail={mail} />
        <hr />
        <MailBody content={mail.content} />
      </div>
    </div>
  );
};

export default MailView;
