import React from "react";
import RegisterForm from "../components/auth/RegisterForm";
import "./RegisterPage.css";

const RegisterPage = () => {
  return (
    <div className="register-page">
      <div className="register-box">
        <h2 className="register-title">Create your account</h2>
        <RegisterForm />
        <p className="login-link">
          Already have an account? <a href="/login">Log in</a>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
