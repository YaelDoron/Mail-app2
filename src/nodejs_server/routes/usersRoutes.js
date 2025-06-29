const express = require('express');
const router = express.Router();
const userController = require('../controllers/usersController');
const authMiddleware = require('../middleware/authMiddleware');
const upload = require('../middleware/multer');

// Route: /api/users
router.route('/')
  .post(upload.single('profilePicture'), userController.createUser);

// Route: /api/users/:id
router.route('/:id')
  .get(userController.getUserById);

// Route: /api/users/by-email/:email
router.route('/by-email/:email')
  .get(userController.getUserByEmail);

// Route: /api/users/image
router.route('/image')
  .put(authMiddleware, upload.single('image'), userController.updateUserImage);

module.exports = router;
