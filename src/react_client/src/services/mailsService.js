import axios from "axios";
const API = process.env.REACT_APP_API_BASE_URL + "/api/mails";


export const getMailById = async (id) => {
  const response = await axios.get(`/api/mails/${id}`);
  return response.data;
};

export const getAllMails = async () => {
  const token = localStorage.getItem("token");
  const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/mails`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return response.data;
};

export const toggleStarMail = async (id) => {
  const response = await axios.patch(`/api/mails/star/${id}`);
  return response.data;
};

export const getSentMails = async () => {
  const token = localStorage.getItem("token");
  const res = await axios.get(`${API}/sent`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};

export const getInboxMails = async () => {
  const token = localStorage.getItem("token");
  const res = await axios.get(`${API}/`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};

export const getStarredMails = async () => {
  const token = localStorage.getItem("token");
  const res = await axios.get(`${API}/star`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};

export const getDraftMails = async () => {
  const token = localStorage.getItem("token");
  const res = await axios.get(`${API}/draft`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
}

export const getSpamMails = async () => {
  const token = localStorage.getItem("token");
  const res = await axios.get(`${API}/spam`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};

export const getGarbageMails = async () => {
  const token = localStorage.getItem("token");
  const res = await axios.get(`${API}/trash`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};

export const getAllMailsUser = async () => {
  const token = localStorage.getItem("token");
  const res = await axios.get(`${API}/all`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};

export const getMailsByLabel = async (labelName) => {
  const token = localStorage.getItem("token");
  const res = await axios.get(`${API}/labels/${labelName}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};
