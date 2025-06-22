import axios from "axios";
import { getToken, getUserIdFromToken } from "./authService"; 

const API_BASE_URL = "http://localhost:3000/api";

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
    throw error.response?.data?.error || error.message;
  }
};

// Log in and receive a token
export const loginUser = async (credentials) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/tokens`, credentials, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data; // => { token: "..." }
  } catch (error) {
    throw {
    error: error.response?.data?.error || error.message,
    status: error.response?.status
  };
  }
};

// Update user's profile picture
export const updateUserImage = async (file) => {
  try {
    const formData = new FormData();
    formData.append("image", file);

    const response = await axios.put(`${API_BASE_URL}/users/image`, formData, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    });

    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Get current logged-in user info by ID
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
        Authorization: `Bearer ${getToken()}`, 
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Mark a mail as read
export const markMailAsRead = async (mailId) => {
  try {
    await axios.patch(
      `${API_BASE_URL}/mails/read/${mailId}`,
      {},
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

// Toggle the starred status of a mail
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

// Get user details by ID
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

// Move mail to trash
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

// Toggle spam status of a mail
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

// Assign one or more labels to a mail
export const assignLabelsToMail = async (mailId, labelIds) => {
  try {
    const response = await axios.patch(
      `${API_BASE_URL}/mails/labels/${mailId}`,
      { labels: labelIds },
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

// Get all labels for the logged-in user
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

// Get user ID based on email address
export const getUserIdByEmail = async (email, token) => {
  const res = await axios.get(`${API_BASE_URL}/users/by-email/${email}`, {
    headers: { Authorization: `Bearer ${getToken()}` 
    },
  });
  return res.data.id;
};

// Update a draft mail
export const updateDraft = async (id, updates) => {
  await axios.patch(`${API_BASE_URL}/mails/${id}`, updates, {
    headers: {
      Authorization: `Bearer ${getToken()}`
    }
  });
};

// Send a draft mail
export const sendDraft = async (id) => {
  await axios.post(`${API_BASE_URL}/mails/send/${id}`, {}, {
    headers: {
      Authorization: `Bearer ${getToken()}`
    }
  });
};

// Remove a specific label from a mail
export const unassignLabelFromMail = async (mailId, labelId) => {
  try {
    const response = await axios.patch(
      `${API_BASE_URL}/mails/unassign-label/${mailId}`,
      { labelId }, 
      {
        headers: {
          Authorization: `Bearer ${getToken()}`
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error("Failed to unassign label from mail", error);
  }
};

export const checkEmailExists = async (email) => {
  try {
    await axios.get(`${API_BASE_URL}/users/by-email/${email}`);
    return true; // נמצא
  } catch (error) {
    if (error.response?.status === 404) return false; // לא נמצא
    throw error;
  }
};