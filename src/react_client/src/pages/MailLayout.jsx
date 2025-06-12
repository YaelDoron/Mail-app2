import React, { useState } from "react";
import Sidebar from "../components/layout/Sidebar";
import Topbar from "../components/layout/Topbar";
import ComposeMail from "../components/mail/ComposeMail"; // ודא שהנתיב נכון
import "./MailLayout.css";

const MailLayout = ({ children }) => {
  const [showCompose, setShowCompose] = useState(false);

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
        <div className="mail-main">{children}</div>
      </div>

      {/* חלונית כתיבת מייל */}
      {showCompose && <ComposeMail onClose={handleCloseCompose} />}
    </div>
  );
};

export default MailLayout;
