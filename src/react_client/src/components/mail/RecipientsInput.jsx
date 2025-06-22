import React, { useState, useRef } from "react";

const RecipientsInput = ({ recipients, setRecipients }) => {
  const [inputValue, setInputValue] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [error, setError] = useState(false);
  const inputRef = useRef(null);

  const handleChange = (e) => {
  const value = e.target.value;
  setInputValue(value);
  
  if (error) {
    setError(false);
  }
};


  const handleKeyDown = (e) => {
    if ((e.key === "Enter" || e.key === ",") && inputValue.trim() !== "") {
      e.preventDefault();

      const newEmail = inputValue.trim();
      const isValidEmail = /^[a-zA-Z0-9._%+-]+@mailsnap\.com$/.test(newEmail);

      if (!isValidEmail) {
        setError(true);
        alert("Invalid email address. Only @mailsnap.com is allowed."); // ✅ NEW – הודעת שגיאה
        setInputValue("");                       // ✅ NEW – ניקוי שדה הקלט
        return;
      }

      if (!recipients.includes(newEmail)) {
        setRecipients([...recipients, newEmail]);
        setError(false);
      }

      setInputValue("");
    }
  };

  const handleRemoveRecipient = (indexToRemove) => {
    const updated = recipients.filter((_, i) => i !== indexToRemove);
    setRecipients(updated);
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        flexWrap: "wrap",
        gap: "6px",
        paddingBottom: "4px",
        borderBottom: error ? "1px dashed red" : "1px solid lightgray",
        cursor: "text",
      }}
      onClick={() => inputRef.current && inputRef.current.focus()}
    >
      {(isFocused || inputValue.length > 0 || recipients.length > 0) ? (
        <span style={{ color: "#555", marginRight: "6px" }}>To:</span>
      ) : (
        <span style={{ color: "#888", marginRight: "6px" }}>Recipients</span>
      )}

      {recipients.map((email, index) => (
        <span
          key={index}
          style={{
            backgroundColor: "#e0e0e0",
            padding: "4px 8px",
            borderRadius: "12px",
            display: "flex",
            alignItems: "center",
            fontSize: "0.9rem",
          }}
        >
          {email}
          <button
            onClick={() => handleRemoveRecipient(index)}
            style={{
              marginLeft: "6px",
              background: "transparent",
              border: "none",
              cursor: "pointer",
              fontWeight: "bold",
              color: "#555",
            }}
          >
            ×
          </button>
        </span>
      ))}

      <input
        ref={inputRef}
        type="text"
        value={inputValue}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onFocus={() => setIsFocused(true)}
        onBlur={() => {
  setIsFocused(false);

  const trimmed = inputValue.trim();
  const isValidEmail = /^[a-zA-Z0-9._%+-]+@mailsnap\.com$/.test(trimmed);

  if (trimmed && isValidEmail && !recipients.includes(trimmed)) {
    setRecipients([...recipients, trimmed]);
    setInputValue("");
    setError(false);
  } else if (trimmed && !isValidEmail) {
    setError(true);
    alert("Invalid email address. Only @mailsnap.com is allowed."); // ✅ NEW
  }
}}

        style={{
          border: "none",
          outline: "none",
          minWidth: "100px",
          fontSize: "1rem",
          background: "transparent",
          flexGrow: 1,
        }}
      />
    </div>
  );
};

export default RecipientsInput;
