import React from "react";
import RegisterForm from "../components/auth/RegisterForm";
import "./RegisterPage.css";

// Page component for user registration
const RegisterPage = () => {
  return (
    <div className="register-page">

       {/* Form box */}
      <div className="register-box">
        {/* The form fields and submit button */}
        <RegisterForm />

        {/* Link to the login page if the user already has an account */}
        <p className="login-link">
          Already have an account? <a href="/login">Log in</a>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;