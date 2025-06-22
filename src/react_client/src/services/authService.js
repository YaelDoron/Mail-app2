
import { jwtDecode } from "jwt-decode"; // Library to decode JWT tokens


const TOKEN_KEY = "jwtToken";

// Save the JWT token to localStorage
export const saveToken = (token) => {
  localStorage.setItem(TOKEN_KEY, token);
};

// Retrieve the token from localStorage
export const getToken = () => {
  return localStorage.getItem(TOKEN_KEY);
};

// Remove the token from localStorage
export const removeToken = () => {
  localStorage.removeItem(TOKEN_KEY);
};

// Check if a user is logged in 
export const isLoggedIn = () => {
  return !!getToken();
};

// Extract userId from the JWT token payload
export const getUserIdFromToken = () => {
  const token = getToken();
  if (!token) return null;
  try {
    const decoded = jwtDecode(token);
    return decoded.userId;
  } catch (err) {
    console.error("Invalid token", err);
    return null;
  }
};

