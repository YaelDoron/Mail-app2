import React, { useState } from "react";
import "./RegisterForm.css";
import { RegisterUser } from "../../services/api";
import RegisterInput from "./RegisterInput";
import ImageUploader from "./ImageUploader";
import { useNavigate } from "react-router-dom";

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    birthDate: "",
    gender: "",
    email: "",
    password: "",
    confirmPassword: "",
    image: null,
  });

  const [errors, setErrors] = useState({});
  const [preview, setPreview] = useState(null);
  const navigate = useNavigate();

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    setFormData((prev) => ({ ...prev, image: file }));
    setPreview(file ? URL.createObjectURL(file) : null);
  };

  const clearImage = () => {
    setFormData((prev) => ({ ...prev, image: null }));
    setPreview(null);
  };

  const validateField = (field, value) => {
    let error = "";

    if ((field === "firstName" || field === "lastName" || field === "gender" || field === "birthDate") && !value?.trim()) {
      error = `${field} is required.`;

    }
    if (field === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      error = "Please enter a valid email address.";
    }
    if (field === "password" && value.length < 8) {
      error = "Password must be at least 8 characters long.";
    }
    if (field === "confirmPassword" && value !== formData.password) {
      error = "Passwords do not match.";
    }

    setErrors((prev) => ({ ...prev, [field]: error }));
  };

  const handleBlur = (field) => {
    validateField(field, formData[field]);
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    validateField(field, value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const fields = ["firstName", "lastName", "birthDate", "gender", "email", "password", "confirmPassword"];
    fields.forEach((field) => {
      validateField(field, formData[field]);
    });

    if (Object.values(errors).some((err) => err)) return;

    try {
      const response = await RegisterUser(formData);
      const token = response.token;

      if (token) {
        navigate("/login");
      } else {
        alert("Registration succeeded but no token was returned.");
      }
    } catch (error) {
      const fieldErrors = {};
      const serverError = error?.response?.data;

      if (serverError?.error === "invalid_birth_date") {
        fieldErrors.birthDate = serverError.message;
      } else {
        alert(serverError?.message || "An unexpected error occurred.");
      }

      setErrors(fieldErrors);
    }
  };

  return (
    <form className="register-form" onSubmit={handleSubmit}>
      <h1>Sign Up</h1>

      <div className="name-fields">
        <div style={{ flex: 1 }}>
          <label className="field-label">First Name<span className="required-star">*</span></label>
          <RegisterInput
            type="text"
            placeholder="First Name"
            value={formData.firstName}
            onChange={(value) => handleChange("firstName", value)}
            onBlur={() => handleBlur("firstName")}
            className={errors.firstName ? "has-error" : ""}
          />
          <div className="error-wrapper">
            {errors.firstName && <p className="error-message">{errors.firstName}</p>}
          </div>
        </div>

        <div style={{ flex: 1 }}>
          <label className="field-label">Last Name<span className="required-star">*</span></label>
          <RegisterInput
            type="text"
            placeholder="Last Name"
            value={formData.lastName}
            onChange={(value) => handleChange("lastName", value)}
            onBlur={() => handleBlur("lastName")}
            className={errors.lastName ? "has-error" : ""}
          />
          <div className="error-wrapper">
            {errors.lastName && <p className="error-message">{errors.lastName}</p>}
          </div>
        </div>
      </div>

    <div className="birth-gender-fields">
      <div>
        <label className="field-label">Birth Date<span className="required-star">*</span></label>
        <RegisterInput
          type="date"
          placeholder="Birth Date"
          value={formData.birthDate}
          onChange={(value) => handleChange("birthDate", value)}
          onBlur={() => handleBlur("birthDate")}
          className={errors.birthDate ? "has-error" : ""}
        />
        <div className="error-wrapper">
          {errors.birthDate && <p className="error-message">{errors.birthDate}</p>}
        </div>
      </div>

      <div>
        <label className="field-label">Gender<span className="required-star">*</span></label>
        <select
          value={formData.gender}
          onChange={(e) => handleChange("gender", e.target.value)}
          onBlur={() => handleBlur("gender")}
          className={errors.gender ? "has-error" : ""}
        >
          <option value="">Select Gender</option>
          <option value="Female">Female</option>
          <option value="Male">Male</option>
          <option value="Prefer not to say">Prefer not to say</option>
          <option value="Other">Other</option>
        </select>
        <div className="error-wrapper">
          {errors.gender && <p className="error-message">{errors.gender}</p>}
        </div>
      </div>
    </div>



      <div>
        <label className="field-label">Email<span className="required-star">*</span></label>
        <RegisterInput
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={(value) => handleChange("email", value)}
          onBlur={() => handleBlur("email")}
          className={errors.email ? "has-error" : ""}
        />
        <div className="error-wrapper">
          {errors.email && <p className="error-message">{errors.email}</p>}
        </div>
      </div>


      <div className="password-fields">
        <div style={{ flex: 1 }}>
          <label className="field-label">Password<span className="required-star">*</span> <small>(min 8 characters)</small></label>
          <RegisterInput
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={(value) => handleChange("password", value)}
            onBlur={() => handleBlur("password")}
            className={errors.password ? "has-error" : ""}
          />
          <div className="error-wrapper">
            {errors.password && <p className="error-message">{errors.password}</p>}
          </div>
        </div>

        <div style={{ flex: 1 }}>
          <label className="field-label">Confirm Password<span className="required-star">*</span></label>
          <RegisterInput
            type="password"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={(value) => handleChange("confirmPassword", value)}
            onBlur={() => handleBlur("confirmPassword")}
            className={errors.confirmPassword ? "has-error" : ""}
          />
          <div className="error-wrapper">
            {errors.confirmPassword && <p className="error-message">{errors.confirmPassword}</p>}
          </div>
        </div>
      </div>

      <ImageUploader
        handleImageUpload={handleImageUpload}
        preview={preview}
        clearImage={clearImage}
      />

      <button type="submit" className="submit-button">Create Account</button>
    </form>
  );
};

export default RegisterForm;