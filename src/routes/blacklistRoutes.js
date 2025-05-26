const express = require('express');
const router = express.Router();
const blacklistController = require('../controllers/blacklistController');

router.post('/', blacklistController.addToBlacklist);
router.delete('/:id', blacklistController.removeFromBlacklist);

module.exports = router;
