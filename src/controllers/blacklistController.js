const BlacklistService = require('../services/BlacklistService');

// POST /api/blacklist
exports.addToBlacklist = async (req, res) => {
  const { url } = req.body;
  if (!url) {
    return res.status(400).json({ error: 'Missing url in request body' });
  }

  try {
    await BlacklistService.add(url);
    res.status(201).send(); // 201 Created
  } catch (err) {
    res.status(500).json({ error: 'Failed to add URL to blacklist' });
  }
};

// DELETE /api/blacklist/:id
exports.removeFromBlacklist = async (req, res) => {
  const url = req.params.id;

  try {
    await BlacklistService.remove(url);
    res.status(204).send(); // 204 No Content
  } catch (err) {
    res.status(500).json({ error: 'Failed to remove URL from blacklist' });
  }
};
