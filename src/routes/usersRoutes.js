// Defines user-related routes: registration and profile retrieval
const express = require('express');
const router = express.Router();
const { createUser, getUserById } = require('../controllers/usersController');

// Register a new user
router.post('/', createUser);

// Get a user profile by ID
router.get('/:id', getUserById);

module.exports = router;
