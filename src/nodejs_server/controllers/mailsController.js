const Mail = require('../models/Mail')
const BlacklistService = require('../services/BlacklistService');

    // Get all mails for the logged-in user
    function getUserMails(req, res) {
        const userId = req.userId;
        const mails = Mail.getUserMails(userId);
        res.status(200).json(mails);
    }

    // Get a specific mail by ID, only if it belongs to the user (either sender or receiver)
    function getMailById(req, res){
        const id = parseInt(req.params.id);
        const userId = req.userId;
        const mail = Mail.getMailById(id)
        if(!mail){
            return res.status(404).json({error: 'Mail not found'});
        }

        // Authorization check: only sender or recipient can access the mail
        if (mail.from !== userId && mail.to !== userId) {
            return res.status(403).json({ error: 'Access denied' });
        }
        res.status(200).json(mail);
    }

    // Create a new mail (or draft) after blacklist check
    async function createMail(req, res){
        const from = req.userId;
        const { to, subject, content, isDraft = false } = req.body;
        // Validate input
        if (!from || !Array.isArray(to) || to.length === 0 || !subject || !content) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
        const isBlocked = await BlacklistService.check(subject, content);
        const newMail = Mail.createMail(from, to, subject, content, isBlocked, isDraft);
        res.status(201)
    .location(`/api/mails/${newMail.id}`)
    .end();

        } catch (err) {
        console.error('Blacklist check failed:', err);
        res.status(500).json({ error: 'Internal server error during blacklist check' });
    }
    };

    // Delete a mail, only if the logged-in user is the mail's owner
    function deleteMail(req, res){
        const userId = req.userId;
        const id = parseInt(req.params.id);
        const mail = Mail.getMailById(id);
        if (!mail) {
            return res.status(404).json({ error: 'Mail not found' });
        }
        // Authorization check: only the owner can delete the mail
        if (mail.owner !== userId) {
            return res.status(403).json({ error: 'Access denied' });
        }
        const deleted = Mail.deleteMail(id, userId);
        res.status(204).end(); 
    };

    // Edit a draft, only if the logged-in user is the sender
    function updateDraft(req, res){
        const userId = req.userId;
        const id = parseInt(req.params.id);
        const updates = req.body;
        const mail = Mail.getMailById(id);

        if (!mail) {
            return res.status(404).json({ error: 'Mail not found' });
        }
        // Authorization check: only the sender can edit the mail
        if (mail.owner !== userId || mail.from !== userId) {
            return res.status(403).json({ error: 'Only the sender can edit the draft' });
         }

         if (!mail.isDraft) {
            return res.status(400).json({ error: 'Mail is not a draft' });
        }

        const updated = Mail.updateDraft(id, userId, updates);
        res.status(204).end();
    }

        // Assign labels to a mail
    function assignLabelsToMail(req, res) {
        const userId = req.userId;
        const id = parseInt(req.params.id);
        const { labels } = req.body;

        const updated = Mail.assignLabels(id, userId, labels);
        if (!updated) {
            return res.status(403).json({ error: 'Unable to assign labels' });
        }

        res.status(200).json(updated);
    }

        // Toggle spam status
    function toggleSpamStatus(req, res) {
        const userId = req.userId;
        const id = parseInt(req.params.id);

        const updated = Mail.toggleSpam(id, userId);
        if (!updated) {
            return res.status(403).json({ error: 'Unable to update spam status' });
        }

        res.status(200).json(updated);
    }

        // Send a draft
    function sendDraftMail(req, res) {
        const userId = req.userId;
        const id = parseInt(req.params.id);

        const sent = Mail.sendDraft(id, userId);
        if (!sent) {
            return res.status(403).json({ error: 'Unable to send draft' });
        }

        res.status(200).json(sent);
    }

    // Search user's mails using a query term
    function searchMails(req, res){
        const userId = req.userId;
        const term = req.params.query;

        if (!term) {
            return res.status(400).json({ error: 'Missing search term in URL' });
        }

        const results = Mail.searchMails(userId, term);
        res.status(200).json(results);
    }

    function getSpamMails(req, res) {
    const userId = req.userId;
    const mails = Mail.getSpamMails(userId);
    res.status(200).json(mails); 
    }


    module.exports = {
    getUserMails,
    getMailById,
    createMail,
    deleteMail,
    updateDraft,
    assignLabelsToMail,
    toggleSpamStatus,
    sendDraftMail,
    searchMails,
    getSpamMails
};
