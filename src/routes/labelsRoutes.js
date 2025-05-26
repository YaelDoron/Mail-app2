const express = require('express')
const router = express.Router()
const controller = require('../controllers/labelsController')

// Routes for /api/labels
router.route('/')
  .get(controller.getUserLabels)
  .post(controller.createLabel)

// Routes for /api/labels/:id
router.route('/:id')
  .get(controller.getLabelById)
  .patch(controller.updateLabel)
  .delete(controller.deleteLabel)

module.exports = router
