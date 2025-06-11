// Defines user-related routes: registration and profile retrieval
const express = require('express');
const router = express.Router();
const { createUser, getUserById } = require('../controllers/usersController');
const upload = require("../middleware/upload");

// Register a new user
router.post('/', upload.single("image"), createUser);

// Get a user profile by ID
router.get('/:id', getUserById);

module.exports = router;
