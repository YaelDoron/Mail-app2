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

// Sends a new mail or saves it as a draft, depending on the isDraft flag
export const createMail = async (mailData, token) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/mails`, mailData, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, 
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const markMailAsRead = async (mailId) => {
  try {
    await axios.patch(
      `${API_BASE_URL}/mails/read/${mailId}`,
      {}, // אין צורך ב-body
      {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      }
    );
  } catch (error) {
    console.error("Failed to mark mail as read", error);
  }
};

export const toggleStarred = async (mailId) => {
  try {
    const res = await axios.patch(
      `${API_BASE_URL}/mails/star/${mailId}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      }
    );
    return res.data;
  } catch (error) {
    console.error("Failed to toggle starred status", error);
  }
};

export const getUserById = async (id) => {
  try {
    const res = await axios.get(`${API_BASE_URL}/users/${id}`, {
      headers: {
        Authorization: `Bearer ${getToken()}`
      }
    });
    return res.data;
  } catch (err) {
    console.error("Failed to fetch user by ID", err);
  }
};

export const deleteMail = async (mailId) => {
  try {
    await axios.delete(`${API_BASE_URL}/mails/${mailId}`, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    });
  } catch (error) {
    console.error("Failed to delete mail", error);
  }
};

export const toggleSpam = async (mailId) => {
  try {
    const response = await axios.patch(`${API_BASE_URL}/mails/spam/${mailId}`, {}, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Failed to toggle spam status", error);
  }
};

export const assignLabelsToMail = async (mailId, labelIds) => {
  try {
    const response = await axios.patch(
      `${API_BASE_URL}/mails/labels/${mailId}`,
      { labels: labelIds }, // מערך של תוויות
      {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Failed to assign labels", error);
  }
};

export const fetchLabels = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/labels`, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Failed to fetch labels", error);
    return [];
  }
};




