
import { jwtDecode } from "jwt-decode";


const TOKEN_KEY = "jwtToken";

export const saveToken = (token) => {
  localStorage.setItem(TOKEN_KEY, token);
};

export const getToken = () => {
  return localStorage.getItem(TOKEN_KEY);
};

export const removeToken = () => {
  localStorage.removeItem(TOKEN_KEY);
};

export const isLoggedIn = () => {
  return !!getToken();
};

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

