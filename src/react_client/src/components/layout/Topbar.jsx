import React, { useEffect, useState, useRef } from "react";
import { FaCamera, FaSearch } from "react-icons/fa";
import { getUserInfo, updateUserImage } from "../../services/api";
import { useNavigate } from "react-router-dom";
import { removeToken } from "../../services/authService";
import { FiLogOut } from "react-icons/fi";
import "./Topbar.css";
import { useTheme } from "./ThemeSwitcher";

const Topbar = () => {
  const [user, setUser] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const fileInputRef = useRef(null);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
  const fetchUser = async () => {
    try {
      const data = await getUserInfo();
      setUser(data);
    } catch (err) {
      console.error("שגיאה בשליפת פרטי המשתמש", err);
      // אפשרות: removeToken(); navigate("/login");
    }
  };
  fetchUser();
}, []);

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const updatedUser = await updateUserImage(file);
      setUser(updatedUser);
    } catch (err) {
      console.error("שגיאה בעדכון תמונה:", err);
    }
  };

  return (
    <div className="topbar d-flex justify-content-between align-items-center px-4 py-2 position-relative w-100">
      <div><img
          src="https://ssl.gstatic.com/ui/v1/icons/mail/rfr/logo_gmail_lockup_default_1x_r5.png"
          alt="Google Logo"
          className="gmail-logo"
        /></div>
      {/* תיבת חיפוש */}
      <div className="flex-grow-1 d-flex justify-content-center px-3">
        <div style={{ position: "relative", maxWidth: "500px", width: "100%" }}>
          <FaSearch
            style={{
              position: "absolute",
              top: "50%",
              left: "14px",
              transform: "translateY(-50%)",
              color: "#888"
            }}
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && searchQuery.trim()) {
                navigate(`/search/${encodeURIComponent(searchQuery.trim())}`);
              }
            }}
            placeholder="Search mail"
            className="form-control rounded-pill ps-5 pe-4 border-0 search-input"
          />
          {searchQuery && (
            <span
              onClick={() => setSearchQuery("")}
              style={{
                position: "absolute",
                top: "50%",
                right: "14px",
                transform: "translateY(-50%)",
                color: "#888",
                cursor: "pointer",
                fontWeight: "bold",
                fontSize: "18px"
              }}
            >
              ×
            </span>
          )}
        </div>
      </div>
     <label className="theme-switch">
      <input
      type="checkbox"
      checked={theme === "dark"}
      onChange={toggleTheme}
      />
      <span className="slider"></span>
    </label>
      {user && (
        <div className="d-flex align-items-center position-relative">
          <span className="me-2">{user.name}</span>
          {user.image && (
            <img
              src={`http://localhost:3000/${user.image.replace(/\\/g, "/")}?t=${Date.now()}`}
              alt="profile"
              onClick={() => setShowPopup(!showPopup)}
              className="profile-button"
            />
          )}
        </div>
      )}

      {showPopup && user && (
        <div
          className="position-absolute profile-popup border rounded shadow p-3"
          style={{ top: "110%", right: 0, width: "240px", zIndex: 1000 }}
        >
          <div className="text-center position-relative">
            <p className="popup-email small mb-2">{user.email}</p>
            <div className="position-relative d-inline-block mb-2">
              <img
                src={`http://localhost:3000/${typeof user.image === "string" ? user.image.replace(/\\/g, "/") : "uploads/default-pic.svg"}?t=${Date.now()}`}
                alt="profile"
                className="rounded-circle"
                style={{ width: "48px", height: "48px", objectFit: "cover" }}
              />
              <FaCamera
                onClick={() => fileInputRef.current.click()}
                className="camera-icon"
              />
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="d-none"
                onChange={handleImageChange}
              />
            </div>
            <h6 className="mb-1">Hi, {user?.firstName || "User"}!</h6>
          </div>
          <div
            className="position-absolute"
            style={{
              top: "5px",
              right: "10px",
              cursor: "pointer",
              fontSize: "16px"
            }}
            onClick={() => setShowPopup(false)}
          >
            ✕
          </div>
      {/* כפתור התנתקות */}
          <div className="text-center">
        <button
          onClick={() => {
          removeToken();
          navigate("/login");
       }}
        className="logout-button d-flex align-items-center justify-content-center gap-2 w-100 border-0 px-3 py-2 rounded"
      >
        <FiLogOut />
       <span>Sign out</span>
    </button>
    </div>
        </div>
      )}
    </div>
  );
};

export default Topbar;
