import React from "react";

const Editor = ({ subject, setSubject, content, setContent }) => {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginTop: "1rem" }}>
      <input
  type="text"
  value={subject}
  onChange={(e) => setSubject(e.target.value)}
  placeholder="Subject"
  style={{
    fontSize: "1rem",
    paddingBottom: "4px",
    border: "none",
    borderBottom: "1px solid lightgray",
    outline: "none",
    minWidth: "150px",
    flexGrow: 1,
    background: "transparent",
    alignItems: "center"
  }}
/>


      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={10}
        style={{
          fontSize: "1rem",
          padding: "8px",
          border: "none",
          borderBottom: "1px solid #ccc",
          resize: "none",
          outline: "none",
          minHeight: "150px",
        }}
      />
    </div>
  );
};

export default Editor;
