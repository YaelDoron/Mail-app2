const BlacklistService = require('../services/BlacklistService');

// Adds a URL to the blacklist
exports.addToBlacklist = async (req, res) => {
  let { url } = req.body;
  // Validate request body
  if (!url) {
    return res.status(400).json({ error: 'Missing url in request body' });
  }

  // Try to decode the URL only once
  try {
    url = decodeURIComponent(url);
  } catch (e) {
    console.warn("Failed to decode URL:", url, e.message);
    // If decoding fails, continue with the original URL
  }

  try {
    await BlacklistService.add(url);  // Add to blacklist via TCP service
    res.status(201).send();  // 201 Created
  } catch (err) {
    console.error("Error adding to blacklist:", err);
    res.status(500).json({ error: 'Failed to add URL to blacklist' });
  }
};

// Removes a URL from the blacklist
exports.removeFromBlacklist = async (req, res) => {
  let url = req.params.id;
  
  // Try to decode the URL only once
  try {
    url = decodeURIComponent(url);
  } catch (e) {
    console.warn("Failed to decode URL:", url, e.message);
    // If decoding fails, continue with the original URL
  }

  try {
    await BlacklistService.remove(url);  // Remove from blacklist via TCP service
    res.status(204).send();  // 204 No Content
  } catch (err) {
    console.error("Error removing from blacklist:", err);
    res.status(500).json({ error: 'Failed to remove URL from blacklist' });
  }
};