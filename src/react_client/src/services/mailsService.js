import axios from "axios";

export const getMailById = async (id) => {
  const response = await axios.get(`/api/mails/${id}`);
  return response.data;
};
