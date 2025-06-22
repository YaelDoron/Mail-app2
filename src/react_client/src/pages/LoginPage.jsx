import React from "react";
import LoginForm from "../components/auth/LoginForm";
import "./LoginPage.css";

// Page component that renders the login form centered on the screen
function LoginPage() {
  return (
    <div className="login-page-container">
      <LoginForm />
    </div>
  );
}

export default LoginPage;
