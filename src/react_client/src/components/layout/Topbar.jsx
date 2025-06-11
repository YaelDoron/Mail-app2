import React, { useEffect, useState, useRef } from "react";
import { FaCamera } from "react-icons/fa";
import { getUserInfo, updateUserImage } from "../../services/api";



const Topbar = () => {
const [user, setUser] = useState(null);
const [showPopup, setShowPopup] = useState(false);
const fileInputRef = useRef(null);

useEffect(() => {
  const fetchUser = async () => {
    try {
      const data = await getUserInfo();
      setUser(data);
    } catch (err) {
      console.error("שגיאה בשליפת פרטי המשתמש", err);
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
  <div className="d-flex justify-content-between align-items-center px-4 py-2 border-bottom bg-light position-relative">
    {user && (
      <div className="d-flex align-items-center position-relative">
        <span className="me-2">{user.name}</span>
          <img
            src={`http://localhost:3000/${user.image || "default-pic.png"}`}
            alt="profile"
            onClick={() => setShowPopup(!showPopup)}
            className="rounded-circle"
            style={{ width: "36px", height: "36px", objectFit: "cover" }}
          />

      </div>
    )}

    {showPopup && user && (
      <div
        className="position-absolute bg-white border rounded shadow p-3"
        style={{ top: "110%", right: 0, width: "240px", zIndex: 1000 }}
      >
        <div className="text-center position-relative">
          <p className="text-muted small mb-2">{user.email}</p>

          {/* תמונה + אייקון מצלמה */}
          <div className="position-relative d-inline-block mb-2">
             <img
                src={`http://localhost:3000/${user.image || "default-pic.png"}`}
                alt="profile"
                className="rounded-circle"
                style={{ width: "48px", height: "48px", objectFit: "cover" }}
              />

            <FaCamera
              onClick={() => fileInputRef.current.click()}
              style={{
                position: "absolute",
                bottom: 0,
                right: 0,
                background: "white",
                borderRadius: "50%",
                padding: "4px",
                cursor: "pointer",
                fontSize: "20px"
              }}
            />
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="d-none"
              onChange={handleImageChange}
            />
          </div>

          <h6 className="mb-1">Hi, {user.name.split(" ")[0]}!</h6>
        </div>

        {/* כפתור סגירה */}
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
      </div>
    )}
  </div>
);
};

export default Topbar;
