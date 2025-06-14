import React, { useState } from "react";
import Sidebar from "../components/layout/Sidebar";
import Topbar from "../components/layout/Topbar";
import ComposeMail from "../components/mail/ComposeMail"; // ודא שהנתיב נכון
import "./MailLayout.css";

const MailLayout = ({ children }) => {
  const [showCompose, setShowCompose] = useState(false);

  // ✅ חדש: טריגר רענון
  const [refreshTrigger, setRefreshTrigger] = useState(0); // ✅ הוספה

  const handleOpenCompose = () => setShowCompose(true);
  const handleCloseCompose = () => setShowCompose(false);

  return (
    <div className="mail-layout">
      <div className="mail-topbar">
        <Topbar />
      </div>
      <div className="mail-body">
        <div className="mail-sidebar">
          <Sidebar onComposeClick={handleOpenCompose} />
        </div>
        <div className="mail-main">
          {/* ✅ עדכון: מעביר refreshTrigger כ-prop לעמוד */}
          {React.isValidElement(children)
            ? React.cloneElement(children, { refreshTrigger }) // ✅ הוספה
            : children}
        </div>
      </div>

      {/* חלונית כתיבת מייל */}
      {showCompose && (
        <ComposeMail
          onClose={handleCloseCompose}
          onMailSent={() => setRefreshTrigger(prev => prev + 1)} // ✅ הוספה
        />
      )}
    </div>
  );
};

export default MailLayout;
