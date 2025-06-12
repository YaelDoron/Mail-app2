import { Routes, Route, Navigate } from "react-router-dom";
import React from "react";
import MailPage from "./pages/MailPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage"
import MailLayout from "./components/pages/MailLayout";
import InboxPage from "./components/pages/InboxPage";
import AllMailsPage from "./components/pages/AllMailsPage";
import StarredPage from "./components/pages/StarredPage";
import SentPage from "./components/pages/SentPage";
import DraftsPage from "./components/pages/DraftsPage";
import SpamPage from "./components/pages/SpamPage";
import TrashPage from "./components/pages/TrashPage";

function App() {
  return (
      <Routes>
        <Route path="/mailpage" element={<MailPage />} />
        <Route path="/mailpage/:id" element={<MailLayout><MailPage /></MailLayout>} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/inbox" element={<MailLayout><InboxPage /></MailLayout>} />
        <Route path="/AllMails" element={<MailLayout><AllMailsPage /></MailLayout>} />
        <Route path="/starred" element={<MailLayout><StarredPage /></MailLayout>} />
        <Route path="/sent" element={<MailLayout><SentPage /></MailLayout>} />
        <Route path="/drafts" element={<MailLayout><DraftsPage /></MailLayout>} />
        <Route path="/spam" element={<MailLayout><SpamPage /></MailLayout>} />
        <Route path="/Trash" element={<MailLayout><TrashPage /></MailLayout>} />
        <Route path="/labels/:labelName" element={<MailLayout><LabelPage /></MailLayout>} />
      </Routes>
  );
}

export default App;
