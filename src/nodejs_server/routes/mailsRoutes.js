const express = require('express')
const router = express.Router()
const controller = require('../controllers/mailsController')

router.route('/')
    .get(controller.getUserMails)
    .post(controller.createMail)

router.route('/:id')
    .get(controller.getMailById)
    .patch(controller.editMail)
    .delete(controller.deleteMail)

router.route('/search/:query')
    .get(controller.searchMails)

module.exports = router;
