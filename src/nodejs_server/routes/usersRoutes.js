// Defines user-related routes: registration and profile retrieval
const express = require('express');
const router = express.Router();
const { createUser, getUserById, getUserByEmail } = require('../controllers/usersController');
const upload = require("../middleware/multer");

// Register a new user
router.post('/', upload.single("image"), createUser);

// Get a user profile by ID
router.get('/:id', getUserById);

// שליפת מזהה לפי כתובת מייל
router.get('/by-email/:email', getUserByEmail);

module.exports = router;
