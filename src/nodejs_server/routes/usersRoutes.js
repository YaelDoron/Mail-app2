const express = require('express');
const router = express.Router();
const controller = require('../controllers/usersController');
const authMiddleware = require('../middleware/authMiddleware');
const upload = require("../middleware/multer");

router.post('/', upload.single("image"), controller.createUser);
router.get('/:id', controller.getUserById);
router.get('/by-email/:email', controller.getUserByEmail);
router.put('/image', authMiddleware, upload.single("image"), controller.updateUserImage);

module.exports = router;
