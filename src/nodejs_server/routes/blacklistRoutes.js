const express = require('express');
const router = express.Router();
const blacklistController = require('../controllers/blacklistController');

// Route to add a new URL to the blacklist
router.post('/', blacklistController.addToBlacklist);

// Route to remove a URL from the blacklist by ID
router.delete('/:id', blacklistController.removeFromBlacklist);

module.exports = router;
