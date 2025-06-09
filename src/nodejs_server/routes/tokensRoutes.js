const express = require('express');
const router = express.Router();
const { loginUser } = require('../controllers/tokensController');

// Handle login requests  POST /api/tokens
router.post('/', loginUser);

module.exports = router; // Export the router