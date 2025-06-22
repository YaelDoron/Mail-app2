import React, { useState } from "react";
import Sidebar from "../components/layout/Sidebar";
import Topbar from "../components/layout/Topbar";
import ComposeMail from "../components/mail/ComposeMail";
import "./MailLayout.css";
import { useTheme } from "../components/layout/ThemeSwitcher";

// Layout wrapper for the entire mail app (topbar, sidebar, main view)
const MailLayout = ({ children }) => {
  const [showCompose, setShowCompose] = useState(false);
  const { theme } = useTheme();

  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleOpenCompose = () => setShowCompose(true);
  const handleCloseCompose = () => setShowCompose(false);

  return (
    <div className={`mail-layout ${theme}`}>
        <Topbar />

      <div className="mail-body">
        {/* Sidebar section */}
        <div className="mail-sidebar">
          <Sidebar onComposeClick={handleOpenCompose} />
        </div>

        {/* Main content area */}
        <div className="mail-main">
          {React.isValidElement(children)
            ? React.cloneElement(children, {
                refreshTrigger,
                triggerRefresh: () => setRefreshTrigger((prev) => prev + 1),
              })
            : children}
        </div>
      </div>

      {/* Compose mail popup if opened */}
      {showCompose && (
        <ComposeMail
          onClose={handleCloseCompose}
          onMailSent={() => setRefreshTrigger((prev) => prev + 1)}
        />
      )}

    </div>
  );
};

export default MailLayout;
