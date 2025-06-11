import axios from "axios";

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
