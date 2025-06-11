import axios from "axios";
import { getToken, getUserIdFromToken } from "./authService"; 

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

// Function to register a user with file upload
export const RegisterUser = async (userData) => {
  try {
    const formData = new FormData();
    Object.entries(userData).forEach(([key, value]) => {
      formData.append(key, value); // Append all form data, including the file
    });

    const response = await axios.post(`${API_BASE_URL}/users`, formData, {
      headers: {
        "Content-Type": "multipart/form-data", // Specify multipart form data
      },
    });

    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const loginUser = async (credentials) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/tokens`, credentials, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data; // => { token: "..." }
  } catch (error) {
    throw error.response?.data || error.message;
  }
};


export const updateUserImage = async (file) => {
  try {
    const formData = new FormData();
    formData.append("profilePicture", file);

    const response = await axios.put(`${API_BASE_URL}/users/image`, formData, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const getUserInfo = async () => {
  try {
    const userId = getUserIdFromToken(); 
    const response = await axios.get(`${API_BASE_URL}/users/${userId}`, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

