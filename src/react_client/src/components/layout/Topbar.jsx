import React, { useEffect, useState, useRef } from "react";
import { FaCamera, FaSearch } from "react-icons/fa";
import { getUserInfo, updateUserImage } from "../../services/api";
import { useNavigate } from "react-router-dom";
import { removeToken } from "../../services/authService";
import { FiLogOut } from "react-icons/fi";
import "./Topbar.css";
import { useTheme } from "./ThemeSwitcher";

// Holds user info, popup visibility, image input reference, and search query
const Topbar = () => {
  const [user, setUser] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const fileInputRef = useRef(null);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  // Fetch user details when component mounts
  useEffect(() => {
  const fetchUser = async () => {
    try {
      const data = await getUserInfo();
      setUser(data);
    } catch (err) {
      console.error("error in getting the user's info", err);
    }
  };
  fetchUser();
}, []);

  // Called when user selects a new profile picture
  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const updatedUser = await updateUserImage(file);
      setUser(updatedUser);
    } catch (err) {
      console.error("error in updating image: ", err);
    }
  };

  return (
    <div className="topbar d-flex justify-content-between align-items-center px-4 py-2 position-relative w-100">
      {/* MailSnap logo – split into two colors */}
      <div className="app-logo fw-bold fs-5 text-dark d-flex align-items-center gap-2">
        <span>
          <span className="logo-gray">Mail</span>
          <span className="logo-pink">Snap</span>

        </span>
      </div>

      {/* Search input with icon on the left and clear (×) button on the right */}
      <div className="flex-grow-1 d-flex justify-content-center px-3">
        <div className="search-container">
          <FaSearch className="search-icon" />
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
            <span className="clear-search"
              onClick={() => setSearchQuery("")}>
              ×
            </span>
          )}
        </div>
      </div>

      {/* Dark/light theme toggle switch */}
     <label className="theme-switch">
      <input
      type="checkbox"
      checked={theme === "dark"}
      onChange={toggleTheme}
      />
      <span className="slider"></span>
    </label>

      {/* If user is logged in, show their name and profile image */}
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

      {/* Profile popup includes email, image with camera icon, greeting, and logout button */}
      {showPopup && user && (
        <div className="profile-popup-box position-absolute profile-popup border rounded shadow p-3">

          <div className="text-center position-relative">
            <p className="popup-email small mb-2">{user.email}</p>
            <div className="position-relative d-inline-block mb-2">
              <img
                src={`http://localhost:3000/${typeof user.image === "string" ? user.image.replace(/\\/g, "/") : "uploads/default-pic.svg"}?t=${Date.now()}`}
                alt="profile"
                className="rounded-circle popup-profile-img"/>
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
            className="position-absolute popup-close"
            onClick={() => setShowPopup(false)}
          >
            ✕
          </div>
        {/* Signs user out and navigates to login page */}
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
