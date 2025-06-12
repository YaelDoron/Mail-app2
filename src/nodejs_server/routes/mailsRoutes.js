const express = require('express')
const router = express.Router()
const controller = require('../controllers/mailsController')

router.route('/')
    .get(controller.getUserMails)
    .post(controller.createMail)

router.route('/:id')
    .get(controller.getMailById)
    .patch(controller.updateDraft)
    .delete(controller.deleteMail)

router.route('/search/:query')
    .get(controller.searchMails)

// ספאם
router.route('/spam')
    .get(controller.getSpamMails);

// דואר מסומן בכוכב
router.route('/star/:id')
    .patch(controller.toggleStarredStatus);

// שליחת טיוטה
router.route('/send/:id')
    .post(controller.sendDraftMail);

// תיוג
router.route('/labels/:id')
    .patch(controller.assignLabelsToMail);

// כל הדואר
router.route('/all')
    .get(controller.getAllUserMails);

// דואר שנשלח
router.route('/sent')
    .get(controller.getSentMails);

// אשפה
router.route('/trash')
    .get(controller.getTrashMails);
module.exports = router;

// סימון מייל כנקרא
router.route('/read/:id')
    .patch(controller.markMailAsRead);

// סימון מייל כספאם
router.route('/spam/:id')
    .patch(controller.toggleSpamStatus);

