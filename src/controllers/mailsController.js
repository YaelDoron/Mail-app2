const Mail = require('../models/Mail')
const BlacklistService = require('../services/BlacklistService');

    // Get all mails for the logged-in user
    function getUserMails(req, res) {
        const userId = req.userId;
        const mails = Mail.getUserMails(userId);
        if(!mails){
            return res.status(404).json({error: 'Mail not found'})
        }
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

    // Create a new mail, after checking for blacklisted content
    async function createMail(req, res){
        const from = req.userId;
        const { to, subject, content } = req.body;
        // Validate input
        if (!from || !Array.isArray(to) || to.length === 0 || !subject || !content) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
        const isBlocked = await BlacklistService.check(subject, content);

        if (isBlocked) {
        return res.status(400).json({ error: 'Mail contains blacklisted content' });
        }

        const newMail = Mail.createMail(from, to, subject, content);
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

    // Edit a mail, only if the logged-in user is the sender
    function editMail(req, res){
        const userId = req.userId;
        const id = parseInt(req.params.id);
        const newData = req.body;
        const mail = Mail.getMailById(id);

        if (!mail) {
            return res.status(404).json({ error: 'Mail not found' });
        }
        // Authorization check: only the sender can edit the mail
        if (mail.owner !== userId) {
            return res.status(403).json({ error: 'Only the sender can edit the mail' });
         }

        const updated = Mail.editMail(id, userId, newData);
        res.status(204).end();
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

    module.exports = {
        getUserMails,
        getMailById,
        createMail,
        deleteMail,
        editMail,
        searchMails
    }
