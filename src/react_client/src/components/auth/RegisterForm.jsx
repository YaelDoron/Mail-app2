import React, { useState } from "react";
import "./RegisterForm.css";
import { RegisterUser } from "../../services/api";
import RegisterInput from "./RegisterInput";
import ImageUploader from "./ImageUploader";
import { useNavigate } from "react-router-dom";

// Registration form component
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

  // Handles file selection and sets image preview
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    setFormData((prev) => ({ ...prev, image: file }));
    setPreview(file ? URL.createObjectURL(file) : null);
  };

  // Clears the selected image
  const clearImage = () => {
    setFormData((prev) => ({ ...prev, image: null }));
    setPreview(null);
  };

  // Validates a specific field based on type
  const validateField = (field, value) => {
    let error = "";

    if ((field === "firstName" || field === "lastName" || field === "gender" || field === "birthDate") && !value?.trim()) {
      error = `${field} is required.`;
    }

    // Validate age (minimum 13 years old)
    if (field === "birthDate") {
        const date = new Date(value);
        const minValidDate = new Date("1905-01-01");
        const maxValidDate = new Date();
        maxValidDate.setFullYear(maxValidDate.getFullYear() - 13); 

        if (date > maxValidDate) {
        error = "Must be at least 13 years old";
        }
        else if(date < minValidDate){
        error = "Birth year must be between 1905 and today";
        }
    }
    // Validate email format
    if (field === "email" && !/^[a-zA-Z0-9._%+-]+@mailsnap\.com$/.test(value)) {
      error = "Email must end with @mailsnap.com";
    }
    // Validate password length
    if (field === "password" && value.length < 8) {
      error = "Password must be at least 8 characters long.";
    }
    // Confirm password match
    if (field === "confirmPassword" && value !== formData.password) {
      error = "Passwords do not match.";
    }

    setErrors((prev) => ({ ...prev, [field]: error }));
  };

  const handleBlur = (field) => {
    validateField(field, formData[field]);
  };

  // Called when a field value changes
  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    validateField(field, value);

    // Also validate confirmPassword again if password changes
    if (field === "password") {
        validateField("confirmPassword", formData.confirmPassword);
    }
  };

// Handles form submission
const handleSubmit = async (e) => {
  e.preventDefault();

  const requiredFields = [
    "firstName",
    "lastName",
    "birthDate",
    "gender",
    "email",
    "password",
    "confirmPassword",
  ];

  const newErrors = {};

  // Run validation for all fields
  requiredFields.forEach((field) => {
    const value = formData[field]?.trim();
    if (!value) {
      newErrors[field] = `${field} is required.`;
    }
  });

  if (formData.email && !/^[a-zA-Z0-9._%+-]+@mailsnap\.com$/.test(formData.email)) {
    newErrors.email = "Email must end with @mailsnap.com";
  }

  if (formData.password && formData.password.length < 8) {
    newErrors.password = "Password must be at least 8 characters long.";
  }

  if (formData.confirmPassword && formData.confirmPassword !== formData.password) {
    newErrors.confirmPassword = "Passwords do not match.";
  }

  setErrors(newErrors);

  if (Object.keys(newErrors).length > 0) {
    const firstField = Object.keys(newErrors)[0];
    const defaultMsg = "Missing required fields";

    const alertMessage = {
      firstName: "First name is required",
      lastName: "Last name is required",
      birthDate: "Birth date is required",
      gender: "Please select a gender",
      email:
        typeof newErrors.email === "string" && newErrors.email.includes("exists")
          ? "This email is already registered"
          : "Please enter a valid email address",
      password: newErrors.password,
      confirmPassword: "Passwords do not match",
    }[firstField] || defaultMsg;
    alert(alertMessage);
    return;
  }
  try {
    await RegisterUser(formData);
    navigate("/login");
  } catch (error) {
    // Handle errors from server
    const response = error?.response;
    const message = typeof error === "string" ? error : error?.message || "Unknown error";
    const fieldErrors = {};

    if (
      response?.status === 409 ||
      message === "Email address already exists" ||
      (typeof message === "string" && message.toLowerCase().includes("email"))
    ) {
      fieldErrors.email = "Email already exists";
      alert("This email is already registered");
    } else if (message.includes("age requirement") || message.includes("Must be at least 13")) {
      fieldErrors.birthDate = "Must be at least 13 years old";
      alert("You don’t meet the age requirement to create an account");
    } else if (message === "Gender is required") {
      fieldErrors.gender = "Please select a gender";
      alert("Please select a gender");
    } else {
      alert(message);
    }
    setErrors((prev) => ({ ...prev, ...fieldErrors }));
  }
};

  // JSX structure of the form
  return (
    <form className="register-form" onSubmit={handleSubmit}>
      <h1>Sign Up</h1>

      {/* First and Last Name */}
      <div className="name-fields">
        <div className="flex-1">
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

        <div className="flex-1">
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

     {/* Birthdate and Gender */}
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


      {/* Email Field */}
      <div>
        <label className="field-label">Email<span className="required-star">*</span></label>
        <RegisterInput
          type="text"
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

      {/* Password and Confirm Password */}
      <div className="password-fields">
        <div className="flex-1">
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

        <div className="flex-1">
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

       {/* Image Upload Section */}
      <ImageUploader
        handleImageUpload={handleImageUpload}
        preview={preview}
        clearImage={clearImage}
      />
      {/* Submit Button */}
      <button type="submit" className="submit-button">Create Account</button>
    </form>
  );
};

export default RegisterForm;