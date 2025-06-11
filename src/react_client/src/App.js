import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MailPage from "./pages/MailPage";



function App() {
  return (
    <Router>
      <Routes>
        <Route path="/mailpage" element={<MailPage />} />
        <Route path="/mail/:id" element={<MailPage />} />

      </Routes>
    </Router>
  );
}

export default App;
