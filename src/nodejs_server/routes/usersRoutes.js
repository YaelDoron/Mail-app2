const express = require('express');
const router = express.Router();
const controller = require('../controllers/usersController');
const authMiddleware = require('../middleware/authMiddleware');
const upload = require("../middleware/multer");

// POST /api/users
router.post('/', upload.single("image"), controller.createUser);

// GET /api/users/:id
router.get('/:id', controller.getUserById);

// GET /api/users/by-email/:email
router.get('/by-email/:email', controller.getUserByEmail);

// PUT /api/users/image
router.put('/image', authMiddleware, upload.single("image"), controller.updateUserImage);

module.exports = router;
