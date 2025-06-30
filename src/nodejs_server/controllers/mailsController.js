const mailService = require('../services/MailService');
const BlacklistService = require('../services/BlacklistService');
const UserService = require('../services/UserService');

    // Get all mails for the logged-in user
    async function getUserMails(req, res) {
        const userId = req.user.userId;
        const mails = await mailService.getUserMails(userId);
        res.status(200).json(mails);
    }

    // Get a specific mail by ID, only if it belongs to the user (either sender or receiver)
    async function getMailById(req, res) {
        const id = req.params.id;
        const userId = req.user.userId;
        const mail = await mailService.getMailById(id);
        if(!mail || mail.isDeleted){
            return res.status(404).json({error: 'Mail not found'});
        }

        // Authorization check: only sender or recipient can access the mail
        if (mail.from.toString() !== userId && !mail.to.map(id => id.toString()).includes(userId)) {
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

         for (const recipientId of to) {
            if (!UserService.exists(recipientId)) {
            return res.status(400).json({ error: "One or more recipients do not exist" });
            }
        }
        
    try {
        // Check if content or subject contains blacklisted items
        const isBlocked = await BlacklistService.check(subject, content);
        console.log(">> Checking spam status, isBlocked:", isBlocked);
        const newMail = await mailService.createMail(from, to, subject, content, isBlocked, isDraft);
        res.status(201)
    .location(`/api/mails/${newMail.id}`)
    .end();

        } catch (err) {
        console.error('Blacklist check failed:', err);
        res.status(500).json({ error: 'Internal server error during blacklist check' });
    }
    };

    // Delete a mail, only if the logged-in user is the mail's owner
    async function deleteMail(req, res) {
        const userId = req.user.userId;
        const id = req.params.id;
        const moved = await mailService.moveToTrash(id, userId);
    if (!moved) {
        return res.status(404).json({ error: 'Unable to move to trash' });
    }
    res.status(204).end();
    }


    // Return all deleted mails for the user
    async function getTrashMails(req, res) {
        const userId = req.user.userId;
        const mails = await mailService.getTrashMails(userId);
        res.status(200).json(mails);
    }

    // Edit a draft, only if the logged-in user is the sender
    async function updateDraft(req, res) {
        const userId = req.user.userId;
        const id = req.params.id;
        const updates = req.body;
        const updated = await mailService.updateDraft(id, userId, updates);
        if (!updated) {
            return res.status(403).json({ error: 'Unable to update draft' });
        }
        res.status(204).end();
    }

    // Assign labels to a mail
    async function assignLabelsToMail(req, res) {
        const userId = req.user.userId;
        const id = req.params.id;
        const { labels } = req.body;

        const updated = await mailService.assignLabels(id, userId, labels);
        if (!updated) {
            return res.status(403).json({ error: 'Unable to assign labels' });
        }
        res.status(200).json(updated);
    }

    // Remove a label from a mail
    async function removeLabelFromMail(req, res) {
        const userId = req.user.userId;
        const id = req.params.id;
        const { labelId } = req.body;

        if (!labelId) {
            return res.status(400).json({ error: 'Missing labelId in body' });
        }
        const updated = await mailService.removeLabelFromMail(id, userId, labelId);
        if (!updated) {
            return res.status(403).json({ error: 'Unable to remove label' });
        }
        res.status(200).json(updated);
    }

    // Toggle spam status
    async function toggleSpamStatus(req, res) {
    const userId = req.user.userId;
    const id = req.params.id;

    const mail = await mailService.getMailById(id);
    if (!mail || mail.owner.toString() !== userId || mail.isDeleted) {
        return res.status(403).json({ error: 'Unable to update spam status' });
    }

    const updated = await mailService.toggleSpam(id, userId);

    const urls = [
        ...BlacklistService.extractUrls(mail.subject),
        ...BlacklistService.extractUrls(mail.content)
    ];

    if (updated.isSpam) {
        // Add URLs to blacklist
        for (const url of urls) {
            try {
                await BlacklistService.add(url);
                console.log(">> Added to blacklist:", url);
            } catch (err) {
                console.error(`Error adding URL to blacklist: ${url}`, err.message);
            }
        }
    } else {
        // Remove URLs from blacklist
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

    // Send a draft mail
    async function sendDraftMail(req, res) {
        const userId = req.user.userId;
        const id = req.params.id;

        const sent = await mailService.sendDraft(id, userId);
        if (!sent) {
            return res.status(403).json({ error: 'Unable to send draft' });
        }

        res.status(200).json(sent);
    }

    // Search user's mails using a query term
    async function searchMails(req, res) {
        const userId = req.user.userId;
        const term = req.params.query;

        if (!term) {
            return res.status(400).json({ error: 'Missing search term in URL' });
        }

        const results = await mailService.searchMails(userId, term);
        res.status(200).json(results);
    }

    // Get all mails marked as spam
    async function getSpamMails(req, res) {
    const userId = req.user.userId;
    const mails = await mailService.getSpamMails(userId);
    res.status(200).json(mails); 
    }

    // Toggle starred status of a mail
    async function toggleStarredStatus(req, res) {
        const userId = req.user.userId;
        const id = req.params.id;
        const updated = await mailService.toggleStarred(id, userId);

        if (!updated) {
            return res.status(403).json({ error: 'Unable to update starred status' });
        }

        res.status(200).json(updated);
    }

    // Get all mails (sent + received)
    async function getAllUserMails(req, res) {
        const userId = req.user.userId;
        const mails = await mailService.getAllMails(userId);
        res.status(200).json(mails);
    }

    // Get only sent mails by user
    async function getSentMails(req, res) {
        const userId = req.user.userId;
        const mails = await mailService.getSentMails(userId);
        res.status(200).json(mails);
    }

    // Get all draft mails
    async function getDraftMails(req, res) {
    const userId = req.user.userId;
    const drafts = await mailService.getDraftMails(userId);
    res.status(200).json(drafts);
    }

    // Get all starred mails
    async function getStarredMails(req, res) {
        const userId = req.user.userId;
        const starred = await mailService.getStarredMails(userId);
        res.status(200).json(starred);
    }


    // Get all mails with a given label ID
    async function getMailsByLabelById(req, res) {
    const userId = req.user.userId;
    const { labelId } = req.body;

    if (!labelId) {
        return res.status(400).json({ error: "Missing labelId" });
    }

    const mails = await mailService.getMailsByLabel(userId, labelId);
    res.status(200).json(mails);
    }

    // Mark mail as read
    async function markMailAsRead(req, res) {
        const userId = req.user.userId;
        const id = req.params.id;

        const updated = await mailService.markAsRead(id, userId);
        if (!updated) {
            return res.status(403).json({ error: 'Unable to mark mail as read' });
        }

        res.status(204).end();
    }

    // Retrieve a deleted mail from trash
    async function getDeletedMailById(req, res) {
    const id = req.params.id;
    const userId = req.user.userId;

    const mail = await mailService.getDeletedMailById(id, userId);

        if (!mail) {
            return res.status(404).json({ error: 'Mail not found in trash or access denied' });
        }

        res.status(200).json(mail);
    }

    // Restore mail from trash
    async function restoreMail(req, res) {
        const userId = req.user.userId;
        const id = req.params.id;
        const restored = await mailService.restoreFromTrash(id, userId);
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
    getMailsByLabelById,
    getTrashMails,
    markMailAsRead,
    getDeletedMailById,
    restoreMail,
    removeLabelFromMail
};
