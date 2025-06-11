import React, { useState } from "react";
import { loginUser } from "../../services/api";
import { saveToken } from "../../services/authService";
import { useNavigate } from "react-router-dom";
import "./LoginForm.css";

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [step, setStep] = useState("email");
  const navigate = useNavigate();

  const handleNext = () => {
    if (!email.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }
    setError("");
    setStep("password");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const data = await loginUser({ email, password });
      saveToken(data.token);
      navigate("/inbox");
    } catch (err) {
      setError(err.error || "Login failed. Please try again.");
    }
  };

  return (
    <div className="gmail-login-container">
      <form
        className="gmail-login-form"
        onSubmit={step === "password" ? handleSubmit : (e) => e.preventDefault()}
      >
        <img
          src="https://ssl.gstatic.com/ui/v1/icons/mail/rfr/logo_gmail_lockup_default_1x_r5.png"
          alt="Google Logo"
          className="gmail-logo"
        />
        <h2 className="gmail-login-title">Sign in</h2>

        {step === "email" && (
          <>
            <input
              className="gmail-login-input"
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button
              className="gmail-next-button"
              type="button"
              onClick={handleNext}
            >
              Next
            </button>
          </>
        )}

        {step === "password" && (
          <>
            <input
              className="gmail-login-input"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button className="gmail-next-button" type="submit">
              Login
            </button>
          </>
        )}

        {error && <p className="gmail-login-error">{error}</p>}
      </form>
    </div>
  );
}

export default LoginForm;