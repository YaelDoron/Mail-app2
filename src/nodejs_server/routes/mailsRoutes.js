const express = require('express')
const router = express.Router()
const controller = require('../controllers/mailsController')

// Base routes for mails
router.route('/')
    .get(controller.getUserMails)
    .post(controller.createMail)

// Search mails by query string
router.route('/search/:query')
    .get(controller.searchMails)

// Get all spam mails
router.route('/spam')
    .get(controller.getSpamMails);

// Toggle starred status for a specific mail
router.route('/star/:id')
    .patch(controller.toggleStarredStatus);

// Send a draft mail
router.route('/send/:id')
    .post(controller.sendDraftMail);

// Assign labels to a specific mail
router.route('/labels/:id')
    .patch(controller.assignLabelsToMail);

// Get all mails (inbox + sent)
router.route('/all')
    .get(controller.getAllUserMails);

// Get all sent mails
router.route('/sent')
    .get(controller.getSentMails);

// Get all mails in the trash
router.route('/trash')
    .get(controller.getTrashMails);

// Get a specific deleted mail by ID
router.get('/trash/:id', controller.getDeletedMailById);

// Get all starred mails
router.route('/star')
    .get(controller.getStarredMails);    

// Get all drafts
router.route('/draft')
    .get(controller.getDraftMails);  
           

// Mark a specific mail as read
router.route('/read/:id')
    .patch(controller.markMailAsRead);

// Toggle spam status for a specific mail
router.route('/spam/:id')
    .patch(controller.toggleSpamStatus);

// Get, update (if draft), or delete a specific mail
router.route('/:id')
    .get(controller.getMailById)
    .patch(controller.updateDraft)
    .delete(controller.deleteMail)    

// Get mails by label ID
router.post('/by-label', controller.getMailsByLabelById);

// Restore a mail from trash
router.patch('/restore/:id', controller.restoreMail);

// Remove a label from a mail
router.patch('/unassign-label/:id', controller.removeLabelFromMail);

module.exports = router;
