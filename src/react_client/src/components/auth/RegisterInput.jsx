import React from "react";

// A reusable input component for the registration form
const RegisterInput = ({ type, placeholder, value, onChange, onBlur, className }) => {
  return (
    <input
      type={type}
      placeholder={placeholder} // Text shown inside the input before user types
      value={value} // Current value of the input field
      onChange={(e) => onChange(e.target.value)} // Update value when user types
      onBlur={onBlur} // Called when user leaves the input field
      className={className} // CSS class name, for example "has-error", in order to change the style if there is an error
      autoComplete="off" // Prevent browser from autofilling past values
    />
  );
};
export default RegisterInput;
