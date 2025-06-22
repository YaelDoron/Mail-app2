import { Routes, Route, Navigate } from "react-router-dom";
import React from "react";

// Pages
import MailPage from "./pages/MailPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage"
import MailLayout from "./pages/MailLayout";
import InboxPage from "./pages/InboxPage";
import AllMailsPage from "./pages/AllMailsPage";
import StarredPage from "./pages/StarredPage";
import SentPage from "./pages/SentPage";
import DraftsPage from "./pages/DraftsPage";
import SpamPage from "./pages/SpamPage";
import TrashPage from "./pages/TrashPage";
import SearchResultsPage from "./pages/SearchResultsPage";
import LabelPage from "./pages/LabelPage";

// Theme context
import { ThemeProvider } from "./components/layout/ThemeSwitcher"; 

function App() {
  return (
    <ThemeProvider>
      <Routes>
        <Route path="/mailpage" element={<MailPage />} />
        <Route path="/mailpage/:id" element={<MailLayout><MailPage /></MailLayout>} />
        <Route path="/mailpage/:id" element={<MailLayout><MailPage viewType="trash" /></MailLayout>} />
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
        <Route path="/labels/:labelId" element={<MailLayout><LabelPage /></MailLayout>} />
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/search/:query" element={<MailLayout><SearchResultsPage /></MailLayout>} />
      </Routes>
    </ThemeProvider>  
  );
}

export default App;
