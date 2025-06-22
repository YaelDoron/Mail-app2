import axios from "axios";
import { getToken } from "./authService";

const API_BASE_URL = "http://localhost:3000/api";


//Fetches all labels from the server, makes a GET request to the /api/labels endpoint
export const fetchLabels = async () => {
  const response = await axios.get(`${API_BASE_URL}/labels`
    , {
    headers: {
      Authorization: `Bearer ${getToken()}`
    }
  });
  return response.data;
};
//Adds a new label to the server, makes a POST request to the /api/labels endpoint with a label object
export const addLabel = async (label) => {
  const response = await axios.post(`${API_BASE_URL}/labels`, label,
    {
      headers: {
        Authorization: `Bearer ${getToken()}`,
        "Content-Type": "application/json"
      }
    }
  );
  return response.data;
};
