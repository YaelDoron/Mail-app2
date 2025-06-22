import React, { useState } from "react";
import { loginUser } from "../../services/api";
import { removeToken, saveToken } from "../../services/authService";
import { useNavigate } from "react-router-dom";
import "./LoginForm.css";
import { useTheme } from "../layout/ThemeSwitcher"; 

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [step, setStep] = useState("email");
  const navigate = useNavigate();
  const { setTheme } = useTheme();

   // Validates email format and moves to password step
  const handleNext = async () => {
      if (!/^[a-zA-Z0-9._%+-]+@mailsnap\.com$/.test(email)) {
        setError("Please enter a valid email address.");
        return;
      }
       try {
      const exists = await checkEmailExists(email);
      if (!exists) {
        setError("Couldn't find your MailSpam Account");
        return;
      }
  
      setError("");
      setStep("password");
    } catch (err) {
      setError("Unable to verify email. Please try again.");
    }
    };

  // Handles login form submission
  const handleSubmit = async (e) => {
      e.preventDefault();
      setError("");
  
      try {
        const data = await loginUser({ email, password });
        removeToken();
        saveToken(data.token);
        localStorage.setItem("theme", "light");
        setTheme("light"); 
        navigate("/inbox");
      } catch (err) {
         if (err.status === 401) {
        setError("Incorrect password.");
      } else {
        setError("Login failed. Please try again.");
      }
    }
  };

  return (
    <div className="gmail-login-box">
      {/* Left panel with logo and greeting */}
      <div className="gmail-login-left">
        <div className="app-logo fw-bold fs-5 text-dark d-flex align-items-center gap-2">
          <i className="fw-bold fs-5 text-dark"></i>
          <span>
            <span className="logo-gray">Mail</span>
            <span className="logo-pink">Snap</span>
          </span>
        </div>
        <h2 className="gmail-login-title">
          {step === "email" ? "Sign in" : "Welcome"}
        </h2>

        {/* Show email after it has been entered */}
        {step === "password" && (
          <div className="gmail-email-display">
            <i className="bi bi-person-circle gmail-user-icon"></i>
            <span>{email}</span>
          </div>
        )}
      </div>

      {/* Right panel with form */}
      <form
        className="gmail-login-right"
        onSubmit={step === "password" ? handleSubmit : (e) => e.preventDefault()}
      >
        {/* Email input */}
        {step === "email" && (
          <>
            <input
              className="gmail-login-input"
              type="text"
              autoComplete="off"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <div className="gmail-button-container">
              <div className="gmail-button-row">
                <button
                  className="gmail-create-account"
                  type="button"
                  onClick={() => navigate("/register")}
                >
                  Create account
                </button>
                <button
                  className="gmail-next-button"
                  type="button"
                  onClick={handleNext}
                >
                  Next
                </button>
              </div>
            </div>
          </>
        )}

        {/* Password input */}
        {step === "password" && (
          <>
            <p className="gmail-subtext">To continue, first verify it’s you</p>

            <input
              className="gmail-login-input"
              type={showPassword ? "text" : "password"}
              autoComplete="off"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <label className="gmail-show-password">
              <input
                type="checkbox"
                checked={showPassword}
                onChange={() => setShowPassword(!showPassword)}
              />
              Show password
            </label>

            <div className="gmail-button-container">
              <div className="gmail-button-row">
                <button className="gmail-next-button" type="submit">
                  Next
                </button>
              </div>
            </div>
          </>
        )}

        {error && <p className="gmail-login-error">{error}</p>}
      </form>
    </div>
  );
}

export default LoginForm;
