import axios from "axios";
import { getToken } from "./authService";
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const authHeader = () => ({
  headers: {
    Authorization: `Bearer ${getToken()}`
  }
});

export const getMailById = async (id) => {
  const response = await axios.get(`${API_BASE_URL}/mails/${id}`, authHeader());
  return response.data;
};

export const getAllMails = async () => {
  const response = await axios.get(`${API_BASE_URL}mails`, authHeader());
  return response.data;
};

export const toggleStarMail = async (id) => {
  const response = await axios.patch(`${API_BASE_URL}mails/star/${id}`, {}, authHeader());
  return response.data;
};

export const getSentMails = async () => {
  const res = await axios.get(`${API_BASE_URL}mails/sent`, authHeader());
  return res.data;
};

export const getInboxMails = async () => {
  const res = await axios.get(`${API_BASE_URL}mails`, authHeader());
  return res.data;
};

export const getStarredMails = async () => {
  const res = await axios.get(`${API_BASE_URL}mails/star`, authHeader());
  return res.data;
};

export const getDraftMails = async () => {
  const res = await axios.get(`${API_BASE_URL}mails/draft`, authHeader());
  return res.data;
};

export const getSpamMails = async () => {
  const res = await axios.get(`${API_BASE_URL}mails/spam`, authHeader());
  return res.data;
};

export const getGarbageMails = async () => {
  const res = await axios.get(`${API_BASE_URL}mails/trash`, authHeader());
  return res.data;
};

export const getAllMailsUser = async () => {
  const res = await axios.get(`${API_BASE_URL}mails/all`, authHeader());
  return res.data;
};

export const getMailsByLabel = async (labelName) => {
  const res = await axios.get(`${API_BASE_URL}mails/labels/${labelName}`, authHeader());
  return res.data;
};
