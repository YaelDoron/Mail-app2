import axios from "axios";
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

//Fetches all labels from the server, makes a GET request to the /api/labels endpoint
export const fetchLabels = async () => {
  const response = await axios.get(`${API_BASE_URL}/labels`);
  return response.data;
};
//Adds a new label to the server, makes a POST request to the /api/labels endpoint with a label object
export const addLabel = async (label) => {
  const response = await axios.post(`${API_BASE_URL}/labels`, label);
  return response.data;
};
