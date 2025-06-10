import React from "react";
import Sidebar from "../components/layout/Sidebar"; // או הנתיב המתאים אצלך

const TestSidebar = () => {
  return (
    <div className="d-flex">
      <Sidebar />
      <div className="p-4 flex-grow-1">
        <h2>Test Sidebar View</h2>
        <p>Here you can test how the sidebar looks and how the modal opens.</p>
      </div>
    </div>
  );
};

export default TestSidebar;
