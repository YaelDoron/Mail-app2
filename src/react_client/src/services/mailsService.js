import axios from "axios";
import { getToken } from "./authService";
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

// Helper function to generate Authorization header using JWT token
const authHeader = () => ({
  headers: {
    Authorization: `Bearer ${getToken()}`
  }
});

// Get a specific mail by its ID
export const getMailById = async (id) => {
  const response = await axios.get(`${API_BASE_URL}/mails/${id}`, authHeader());
  return response.data;
};

// Get all inbox mails for the logged-in user
export const getAllMails = async () => {
  const response = await axios.get(`${API_BASE_URL}/mails`, authHeader());
  return response.data;
};

// Toggle the "starred" status of a mail
export const toggleStarMail = async (id) => {
  const response = await axios.patch(`${API_BASE_URL}/mails/star/${id}`, {}, authHeader());
  return response.data;
};

// Get mails sent by the current user
export const getSentMails = async () => {
  const res = await axios.get(`${API_BASE_URL}/mails/sent`, authHeader());
  return res.data;
};

// Get inbox mails
export const getInboxMails = async () => {
  const res = await axios.get(`${API_BASE_URL}/mails`, authHeader());
  return res.data;
};

// Get all mails marked as starred
export const getStarredMails = async () => {
  const res = await axios.get(`${API_BASE_URL}/mails/star`, authHeader());
  return res.data;
};

// Get all draft mails (saved but not sent)
export const getDraftMails = async () => {
  const res = await axios.get(`${API_BASE_URL}/mails/draft`, authHeader());
  return res.data;
};

// Get all mails marked as spam
export const getSpamMails = async () => {
  const res = await axios.get(`${API_BASE_URL}/mails/spam`, authHeader());
  return res.data;
};

// Get all mails moved to trash
export const getGarbageMails = async () => {
  const res = await axios.get(`${API_BASE_URL}/mails/trash`, authHeader());
  return res.data;
};

// Get all mails for the user (sent + received + other)
export const getAllMailsUser = async () => {
  const res = await axios.get(`${API_BASE_URL}/mails/all`, authHeader());
  return res.data;
};

// Get all mails that belong to a specific label
export const getMailsByLabel = async (labelId) => {
  const token = getToken();
  const res = await axios.post(
    `${API_BASE_URL}/mails/by-label`,
    { labelId }, 
  {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};

// Search mails by a text query
export const getSearchMails = async (query) => {
  const res = await axios.get(`${API_BASE_URL}/mails/search/${encodeURIComponent(query)}`, authHeader());
  return res.data;
}

// Get label details by ID
export const getLabelById = async (labelId) => {
  const token = getToken();
  const res = await axios.get(`${API_BASE_URL}/labels/${labelId}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};
export const getDeletedMailById = async (id) => {
  const response = await axios.get(`${API_BASE_URL}/mails/trash/${id}`, authHeader());
  return response.data;
};
export const restoreMail = async (id) => {
  const res = await axios.patch(`${API_BASE_URL}/mails/restore/${id}`, {}, authHeader());
  return res.data;
};

