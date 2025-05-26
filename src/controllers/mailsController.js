const Mail = require('../models/Mail')
const BlacklistService = require('../services/BlacklistService');

function getUserMails(req, res) {
    const userId = req.header('User-ID')
    if (!userId){
        return res.status(400).json({error: 'Missing User-ID header'});
    }
    const mails = Mail.getUserMails(userId);
    if(!mails){
        return res.status(404).json({error: 'Mail not found'})
    }
    res.status(200).json(mails);
}

function getMailById(req, res){
    const id = parseInt(req.params.id);
    const userId = req.header('User-ID')
    if (!userId){
         return res.status(400).json({error: 'Missing User-ID header'});
    }
    const mail = Mail.getMailById(id)
    if(!mail){
        return res.status(404).json({error: 'Mail not found'});
    }

    // לוודא שהמייל שייך למשתמש
    if (mail.from !== userId && mail.to !== userId) {
        return res.status(403).json({ error: 'Access denied' });
    }
    res.status(200).json(mail);
}

async function createMail(req, res){
    const from = req.header('User-ID');
    const { to, subject, content } = req.body;

    if (!from || !to || !subject || !content) {
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

function deleteMail(req, res){
    const userId = req.header('User-ID');
    const id = parseInt(req.params.id);
    if (!userId){
        return res.status(400).json({error: 'Missing User-ID header'});
    }
    const mail = Mail.getMailById(id);
    if (!mail) {
        return res.status(404).json({ error: 'Mail not found' });
    }
    // בדיקת הרשאה – רק אם המייל שייך למשתמש
    if (mail.owner !== userId) {
        return res.status(403).json({ error: 'Access denied' });
    }
    const deleted = Mail.deleteMail(id, userId);
    res.status(204).end(); 
};

    function editMail(req, res){
        const userId = req.header('User-ID');
        const id = parseInt(req.params.id);
        const newData = req.body;
        if (!userId){
            return res.status(400).json({error: 'Missing User-ID header'});
        }
        const mail = Mail.getMailById(id);

        if (!mail) {
            return res.status(404).json({ error: 'Mail not found' });
        }
        // הרשאה: רק השולח יכול לערוך
        if (mail.owner !== userId) {
            return res.status(403).json({ error: 'Only the sender can edit the mail' });
         }

        const updated = Mail.editMail(id, userId, newData);
        res.status(204).end();
    }

    function searchMails(req, res){
        const userId = req.header('User-ID');
        const term = req.params.query;

        if (!userId) {
            return res.status(401).json({ error: 'Missing User-ID header' });
        }

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
