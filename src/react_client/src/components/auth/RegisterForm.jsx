import React, { useState } from "react";
import "./RegisterForm.css";
import { RegisterUser } from "../../services/api";
import RegisterInput from "./RegisterInput";
import ImageUploader from "./ImageUploader";
import { useNavigate } from "react-router-dom"; // Used for page navigation after successful registration

const RegisterForm = () => {
    //creates a variable to hold the form answers 
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

    const [errors, setErrors] = useState({}); // Object to store validation errors
    const [preview, setPreview] = useState(null); // Stores image preview
    const navigate = useNavigate();

    // Called when user uploads an image
    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        setFormData((prev) => ({ ...prev, image: file }));
        setPreview(file ? URL.createObjectURL(file) : null);
    };
    const clearImage = () => {
        setFormData((prev) => ({ ...prev, image: null }));
        setPreview(null);
    };

    // Validate individual field
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

        setErrors((prev) => ({ ...prev, [field]: error })); // Update errors state
    };

    // Validate when user leaves the field
    const handleBlur = (field) => {
        validateField(field, formData[field]);
    };

    // Update field value and run validation
    const handleChange = (field, value) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
        validateField(field, value);
    };

    // Submit form
    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent page reload

        const fields = ["firstName", "lastName","birthDate","gender","email", "password", "confirmPassword"];
        

        fields.forEach((field) => {
        validateField(field, formData[field]);
        });

        if (Object.values(errors).some((err) => err)) return; // Stop if there are errors

        try {
        const response = await RegisterUser(formData);
        const token = response.token; 

        if (token) {
        localStorage.setItem("token", token); // שמירת JWT
        navigate("/login"); 
        } else {
        alert("Registration succeeded but no token was returned.");
        }
        } catch (error) {
            const message = error.error || error.message || "An unexpected error occurred.";
            alert("An error occurred while signing up: " + message);
        }
    };

    return (
        <form className="register-form" onSubmit={handleSubmit}>
        <h1>Sign Up</h1>

        {/* First Name Input */}
        <RegisterInput
            type="text"
            placeholder="First Name"
            value={formData.firstName}
            onChange={(value) => handleChange("firstName", value)}
            onBlur={() => handleBlur("firstName")}
            className={errors.firstName ? "has-error" : ""}
        />
        {errors.firstName && <p className="error-message">{errors.firstName}</p>}

        {/* Last Name Input */}
        <RegisterInput
            type="text"
            placeholder="Last Name"
            value={formData.lastName}
            onChange={(value) => handleChange("lastName", value)}
            onBlur={() => handleBlur("lastName")}
            className={errors.lastName ? "has-error" : ""}
        />
        {errors.lastName && <p className="error-message">{errors.lastName}</p>}

        {/* Birth Date Input */}
        <RegisterInput
            type="date"
            placeholder="Birth Date"
            value={formData.birthDate}
            onChange={(value) => handleChange("birthDate", value)}
            onBlur={() => handleBlur("birthDate")}
            className={errors.birthDate ? "has-error" : ""}
        />
        {errors.birthDate && <p className="error-message">{errors.birthDate}</p>}

        {/* Gender Input as dropdown */}
        <div className="gender-select">
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
        {errors.gender && <p className="error-message">{errors.gender}</p>}
        </div>

        {/* Email Input */}
        <RegisterInput
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={(value) => handleChange("email", value)}
            onBlur={() => handleBlur("email")}
            className={errors.email ? "has-error" : ""}
        />
        {errors.email && <p className="error-message">{errors.email}</p>}

        {/* Password Input */}
        <RegisterInput
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={(value) => handleChange("password", value)}
            onBlur={() => handleBlur("password")}
            className={errors.password ? "has-error" : ""}
        />
        {errors.password && <p className="error-message">{errors.password}</p>}

        {/* Confirm Password Input */}
        <RegisterInput
            type="password"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={(value) => handleChange("confirmPassword", value)}
            onBlur={() => handleBlur("confirmPassword")}
            className={errors.confirmPassword ? "has-error" : ""}
        />
        {errors.confirmPassword && (
            <p className="error-message">{errors.confirmPassword}</p>
        )}

        {/* Image Upload */}
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

export default RegisterForm; // Export the component to be used in other files
