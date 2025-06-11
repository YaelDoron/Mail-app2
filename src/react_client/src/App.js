
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MailPage from "./pages/MailPage";
import { Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage"

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/mailpage" element={<MailPage />} />
        <Route path="/mailpage/:id" element={<MailPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Routes>
    </Router>
  );
}

export default App;

