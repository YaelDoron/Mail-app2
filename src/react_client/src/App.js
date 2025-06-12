import { Routes, Route, Navigate } from "react-router-dom";
import React from "react";
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
import MailItem from "./components/mail/MailItem"
import MailList from "./components/mail/MailList";


const TestMailItem = () => {
  const mockMail = {
    id: 1,
    from: "123456", // ID אמיתי של משתמש (לצורך קריאה ל-API)
    to: ["987654", "246810"], // אם נרצה לבדוק תצוגת דואר יוצא
    subject: "",
    content: "Hi! This is a mock email to test how the MailItem looks.",
    createdAt: new Date().toISOString(),
    isRead: false,
    isStarred: true,
    isDraft: false,
  };

  return (
    <div style={{ padding: "30px", maxWidth: "800px", margin: "0 auto" }}>
      {/* החליפי בין inbox/sent כדי לבדוק את ההבדלים */}
      <MailItem mail={mockMail} viewType="inbox" />
    </div>
  );
};

const TestMailList = () => {
  const mockMails = [
    {
      id: 1,
      from: "u1",
      to: ["u2"],
      subject: "Welcome to Gmail",
      content: "Here’s how to use your new inbox.",
      isRead: false,
      isStarred: true,
      createdAt: new Date().toISOString(), // היום
    },
    {
      id: 2,
      from: "u3",
      to: ["u1"],
      subject: "Meeting Reminder",
      content: "Don't forget our meeting tomorrow at 10am.",
      isRead: true,
      isStarred: false,
      createdAt: new Date().toISOString(),
    },
    {
      id: 3,
      from: "u4",
      to: ["u1"],
      subject: "",
      content: "This email has no subject but important info.",
      isRead: false,
      isStarred: false,
      createdAt: new Date().toISOString(),
    },
    {
      id: 4,
      from: "u2",
      to: ["u1"],
      subject: "Update",
      content: "We’ve updated our privacy policy.",
      isRead: true,
      isStarred: true,
      createdAt: new Date("2024-11-10T15:00:00Z"),
    },
    {
      id: 5,
      from: "u5",
      to: ["u1"],
      subject: "Password Reset",
      content: "Click here to reset your password.",
      isRead: false,
      isStarred: false,
      createdAt: new Date("2023-06-01T10:15:00Z"), // שנה קודמת
    },
    {
      id: 6,
      from: "u6",
      to: ["u1"],
      subject: "Final Reminder",
      content: "This is your final reminder before account deletion.",
      isRead: true,
      isStarred: true,
      createdAt: new Date("2024-02-01T08:00:00Z"),
    },
    {
      id: 7,
      from: "u7",
      to: ["u1"],
      subject: "April Update",
      content: "This is a sample email from earlier this year.",
      isRead: false,
      isStarred: false,
      createdAt: new Date("2025-04-10T11:00:00Z"), // השנה, אבל לא היום
    }
  ];

  return (
    <div style={{ padding: "30px", maxWidth: "900px", margin: "0 auto" }}>
      <MailList mails={mockMails} viewType="inbox" />
    </div>
  );
};


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
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/test" element={<TestMailItem />} />
        <Route path="/testlist" element={<TestMailList />} />
        <Route path="/search/:query" element={<MailLayout><SearchResultsPage /></MailLayout>} />

      </Routes>
  );
}

export default App;
