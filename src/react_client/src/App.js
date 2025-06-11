import { Routes, Route, Navigate } from "react-router-dom";
import React from "react";
import MailPage from "./pages/MailPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage"

function App() {
  return (
      <Routes>
        <Route path="/mailpage" element={<MailPage />} />
        <Route path="/mailpage/:id" element={<MailPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
  );
}

export default App;

