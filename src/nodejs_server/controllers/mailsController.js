const Mail = require('../models/Mail')
const BlacklistService = require('../services/BlacklistService');

    // Get all mails for the logged-in user
    function getUserMails(req, res) {
        const userId = req.user.userId;
        const mails = Mail.getUserMails(userId);
        res.status(200).json(mails);
    }

    // Get a specific mail by ID, only if it belongs to the user (either sender or receiver)
    function getMailById(req, res){
        const id = parseInt(req.params.id);
        const userId = req.user.userId;
        const mail = Mail.getMailById(id)
        if(!mail || mail.isDeleted){
            return res.status(404).json({error: 'Mail not found'});
        }

        // Authorization check: only sender or recipient can access the mail
        if (mail.from !== userId && !mail.to.includes(userId)) {
            return res.status(403).json({ error: 'Access denied' });
        }
        res.status(200).json(mail);
    }

    // Create a new mail (or draft) after blacklist check
    async function createMail(req, res){
        const from = req.user.userId;
        const { to, subject, content, isDraft = false } = req.body;
        // Validate input
        if (!from || !Array.isArray(to) || to.length === 0 || !subject || !content) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
        const isBlocked = await BlacklistService.check(subject, content);
        console.log(">> Checking spam status, isBlocked:", isBlocked);
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
        const userId = req.user.userId;
        const id = parseInt(req.params.id);
        const mail = Mail.getMailById(id);
        if (!mail) {
            return res.status(404).json({ error: 'Mail not found' });
        }
        // Authorization check: only the owner can delete the mail
        if (mail.owner !== userId) {
            return res.status(403).json({ error: 'Access denied' });
        }
        const moved = Mail.moveToTrash(id, userId);
        if (!moved) {
            return res.status(403).json({ error: 'Unable to move to trash' });
        }
        res.status(204).end(); 
    };

    function getTrashMails(req, res) {
        const userId = req.user.userId;
        const mails = Mail.getTrashMails(userId);
        res.status(200).json(mails);
    }

    // Edit a draft, only if the logged-in user is the sender
    function updateDraft(req, res){
        const userId = req.user.userId;
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
        const userId = req.user.userId;
        const id = parseInt(req.params.id);
        const { labels } = req.body;

        const updated = Mail.assignLabels(id, userId, labels);
        if (!updated) {
            return res.status(403).json({ error: 'Unable to assign labels' });
        }

        res.status(200).json(updated);
    }

    // Toggle spam status
    async function toggleSpamStatus(req, res) {
    const userId = req.user.userId;
    const id = parseInt(req.params.id);

    const mail = Mail.getMailById(id);
    if (!mail || mail.owner !== userId || mail.isDeleted) {
        return res.status(403).json({ error: 'Unable to update spam status' });
    }

    const updated = Mail.toggleSpam(id, userId); // 🔄 עדכון קודם

    const urls = [
        ...BlacklistService.extractUrls(mail.subject),
        ...BlacklistService.extractUrls(mail.content)
    ];

    if (updated.isSpam) {
        // ✚ אם עכשיו זה ספאם – הוסף ל-blacklist
        for (const url of urls) {
            try {
                await BlacklistService.add(url);
                console.log(">> Added to blacklist:", url);
            } catch (err) {
                console.error(`Error adding URL to blacklist: ${url}`, err.message);
            }
        }
    } else {
        // ✖️ אם הוסר מספאם – הסר מהרשימה
        for (const url of urls) {
            try {
                await BlacklistService.remove(url);
                console.log(">> Removed from blacklist:", url);
            } catch (err) {
                console.error(`Error removing URL from blacklist: ${url}`, err.message);
            }
        }
    }

    res.status(200).json(updated);
}



        // Send a draft
    function sendDraftMail(req, res) {
        const userId = req.user.userId;
        const id = parseInt(req.params.id);

        const sent = Mail.sendDraft(id, userId);
        if (!sent) {
            return res.status(403).json({ error: 'Unable to send draft' });
        }

        res.status(200).json(sent);
    }

    // Search user's mails using a query term
    function searchMails(req, res){
        const userId = req.user.userId;
        const term = req.params.query;

        if (!term) {
            return res.status(400).json({ error: 'Missing search term in URL' });
        }

        const results = Mail.searchMails(userId, term);
        res.status(200).json(results);
    }

    function getSpamMails(req, res) {
    const userId = req.user.userId;
    const mails = Mail.getSpamMails(userId);
    res.status(200).json(mails); 
    }

    function toggleStarredStatus(req, res) {
        const userId = req.user.userId;
        const id = parseInt(req.params.id);

        const updated = Mail.toggleStarred(id, userId);
        if (!updated) {
            return res.status(403).json({ error: 'Unable to update starred status' });
        }

        res.status(200).json(updated);
    }

    function getAllUserMails(req, res) {
        const userId = req.user.userId;
        const mails = Mail.getAllMails(userId);
        res.status(200).json(mails);
    }

    function getSentMails(req, res) {
        const userId = req.user.userId;
        const mails = Mail.getSentMails(userId);
        res.status(200).json(mails);
    }

    function getDraftMails(req, res) {
    const userId = req.user.userId;
    const drafts = Mail.getDraftMails(userId);
    res.status(200).json(drafts);
    }

    function getStarredMails(req, res) {
        const userId = req.user.userId;
        const starred = Mail.getStarredMails(userId);
        res.status(200).json(starred);
    }

    function getMailsByLabel(req, res) {
        const userId = req.user.userId;
        const labelName = req.params.labelName;

        if (!labelName) {
            return res.status(400).json({ error: 'Missing label name' });
        }

        const mails = Mail.getMailsByLabel(userId, labelName);
        res.status(200).json(mails);
    }

    function getMailsByLabelById(req, res) {
    const userId = req.user.userId;
    const { labelId } = req.body;

    if (!labelId) {
        return res.status(400).json({ error: "Missing labelId" });
    }

    const mails = Mail.getMailsByLabel(userId, labelId); // משתמשים במזהה
    res.status(200).json(mails);
    }

    function markMailAsRead(req, res) {
        const userId = req.user.userId;
        const id = parseInt(req.params.id);

        const updated = Mail.markAsRead(id, userId);
        if (!updated) {
            return res.status(403).json({ error: 'Unable to mark mail as read' });
        }

        res.status(204).end();
    }
    function getDeletedMailById(req, res) {
        const id = parseInt(req.params.id);
        const userId = req.user.userId;
        const mail = Mail.getMailById(id);
        if (!mail || !mail.isDeleted) {
            return res.status(404).json({ error: 'Mail not found in trash' });
        }
        if (mail.from !== userId && !mail.to.includes(userId)) {
            return res.status(403).json({ error: 'Access denied' });
        }
        res.status(200).json(mail);
    }
    function restoreMail(req, res) {
        const userId = req.user.userId;
        const id = parseInt(req.params.id);
        const restored = Mail.restoreFromTrash(id, userId);
        if (!restored) return res.status(403).json({ error: "Cannot restore mail" });
        res.status(200).json(restored);
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
    getSpamMails,
    toggleStarredStatus,
    getAllUserMails,
    getSentMails,
    getDraftMails,
    getStarredMails,
    getMailsByLabel,
    getMailsByLabelById,
    getTrashMails,
    markMailAsRead,
    getDeletedMailById,
    restoreMail
};
