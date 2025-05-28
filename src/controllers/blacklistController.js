const BlacklistService = require('../services/BlacklistService');

// POST /api/blacklist
exports.addToBlacklist = async (req, res) => {
  let { url } = req.body;
  
  if (!url) {
    return res.status(400).json({ error: 'Missing url in request body' });
  }

  // דקודינג של ה-URL רק פעם אחת
  try {
    url = decodeURIComponent(url);
  } catch (e) {
    console.warn("Failed to decode URL:", url, e.message);
    // אם הדקודינג נכשל, השתמש ב-URL כפי שהוא
  }

  try {
    await BlacklistService.add(url);
    res.status(201).send(); // 201 Created
  } catch (err) {
    console.error("Error adding to blacklist:", err);
    res.status(500).json({ error: 'Failed to add URL to blacklist' });
  }
};

// DELETE /api/blacklist/:id
exports.removeFromBlacklist = async (req, res) => {
  let url = req.params.id;
  
  // דקודינג של ה-URL רק פעם אחת
  try {
    url = decodeURIComponent(url);
  } catch (e) {
    console.warn("Failed to decode URL:", url, e.message);
    // אם הדקודינג נכשל, השתמש ב-URL כפי שהוא
  }

  try {
    await BlacklistService.remove(url);
    res.status(204).send(); // 204 No Content
  } catch (err) {
    console.error("Error removing from blacklist:", err);
    res.status(500).json({ error: 'Failed to remove URL from blacklist' });
  }
};