import axios from "axios";

//Fetches all labels from the server, makes a GET request to the /api/labels endpoint
export const fetchLabels = async () => {
  const response = await axios.get("/api/labels");
  return response.data;
};
//Adds a new label to the server, makes a POST request to the /api/labels endpoint with a label object
export const addLabel = async (label) => {
  const response = await axios.post("/api/labels", label);
  return response.data;
};
