let idCounter = 0
const mails = []

// Get a single mail by its unique ID
const getMailById = (id) => {
    return mails.find(mail => mail.id === id)
}

// Delete a mail by ID, only if it belongs to the user
const deleteMail = (id, userId) => {
    const index = mails.findIndex(mail => mail.id === id && mail.owner === userId);
    if (index === -1) return null;
    return mails.splice(index, 1)[0]; // Remove from array and return the deleted mail
};

// Search mails by subject or content (excluding spam and drafts)
const searchMails = (userId, term) => {
    return mails
        .filter(mail =>
            mail.owner === userId &&
            !mail.isDeleted &&
            !mail.isDraft &&
            !mail.isSpam &&
            (mail.subject.includes(term) || mail.content.includes(term))
        )
        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)); 
};

// Create a mail or a draft
const createMail = (from, to, subject, content, isSpam = false, isDraft = false) => {
    const timestamp = new Date();
    const senderMail = {
        id: ++idCounter,
        from,
        to,
        subject,
        content,
        timestamp,
        owner: from,
        labels: [],
        isSpam: false,
        isDraft,
        isStarred: false,
        isDeleted: false,
        deletedAt: null,
        isRead: false
    };
    mails.push(senderMail);

    // only if not draft send to recipients
    if (!isDraft) {
    for (const recipientId of to) {
        if (recipientId !== from) { // הימנע מיצירת כפילויות
            mails.push({
                id: ++idCounter,
                from,
                to,
                subject,
                content,
                timestamp,
                owner: recipientId,
                labels: [],
                isSpam: isSpam,
                isDraft: false,
                isStarred: false,
                isDeleted: false,
                deletedAt: null,
                isRead: false
            });
        }
    }
}


    return senderMail;
};


// Return up to 50 latest mails owned by the user, sorted by time (most recent first,excluding drafts & spam) 
const getUserMails = (userId) => {
    const relevant = mails.filter(mail =>
        mail.owner === userId &&
        mail.to.includes(userId) &&
        !mail.isDraft &&
        !mail.isSpam &&
        !mail.isDeleted
    );
    relevant.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    return relevant.slice(0, 50);
};

// Assign labels to a specific mail
const assignLabels = (id, userId, labels) => {
    const mail = getMailById(id);
    if (mail && mail.owner === userId && !mail.isDeleted) {
        for (const label of labels) {
            if (!mail.labels.includes(label)) {
                mail.labels.push(label);
            }
        }
        return mail;
    }    
    return null;
};

// Remove label from a mail
const removeLabelFromMail = (id, userId, labelId) => {
    const mail = getMailById(id);
    if (mail && mail.owner === userId && !mail.isDeleted) {
        mail.labels = mail.labels.filter(label => label !== labelId);
        return mail;
    }
    return null;
};


// Toggle spam status
const toggleSpam = (id, userId) => {
    const mail = getMailById(id);
    if (mail && mail.owner === userId && !mail.isDeleted) {
        mail.isSpam = !mail.isSpam;
        return mail;
    }
    return null;
};

const updateDraft = (id, userId, updates) => {
    const mail = getMailById(id);
    if (!mail || mail.owner !== userId || !mail.isDraft || mail.from !== userId || mail.isDeleted) return null;

    if (updates.subject !== undefined) {
        mail.subject = updates.subject;
    }
    if (updates.content !== undefined) {
        mail.content = updates.content;
    }
    if (updates.to !== undefined) {
        mail.to = updates.to;
    }
    mail.timestamp = new Date();
    return mail;
};

// Send a draft (convert to normal mail and send to recipients)
const sendDraft = (id, userId) => {
    const draft = getMailById(id);
    if (!draft || draft.owner !== userId || !draft.isDraft || draft.isDeleted) return null;

    draft.isDraft = false;
    draft.timestamp = new Date();

    for (const recipientId of draft.to) {
        if (recipientId === draft.owner) continue;
        mails.push({
            id: ++idCounter,
            from: draft.from,
            to: draft.to,
            subject: draft.subject,
            content: draft.content,
            timestamp: draft.timestamp,
            owner: recipientId,
            labels: [],
            isSpam: false,
            isDraft: false,
            isStarred: false,
            isDeleted: false,
            deletedAt: null
        });
    }

    return draft;
};

const getSpamMails = (userId) => {
    return mails
        .filter(mail => mail.owner === userId && mail.isSpam && !mail.isDeleted)
        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
};

// Toggle starred status
const toggleStarred = (id, userId) => {
    const mail = getMailById(id);
    if (mail && mail.owner === userId && !mail.isDeleted) {
        mail.isStarred = !mail.isStarred;
        return mail;
    }
    return null;
};

// Get all mails regardless of status
const getAllMails = (userId) => {
    return mails
        .filter(mail =>
            mail.owner === userId &&
            !mail.isSpam && 
            !mail.isDeleted
        )
        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
};

// Get sent mails (only mails where user is sender and owner)
const getSentMails = (userId) => {
    return mails
        .filter(mail => mail.owner === userId && mail.from === userId &&
             !mail.isDraft && !mail.isDeleted)
        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
};

// Move a mail to trash 
const moveToTrash = (id, userId) => {
    const mail = getMailById(id);
    if (mail && mail.owner === userId && !mail.isDeleted) {
        mail.isDeleted = true;
        mail.deletedAt = new Date();
        return mail;
    }
    return null;
};

// Automatically purge trash after 30 days
const purgeOldTrash = () => {
    const now = Date.now();
    const THIRTY_DAYS = 30 * 24 * 60 * 60 * 1000;
    for (let i = mails.length - 1; i >= 0; i--) {
        const mail = mails[i];
        if (mail.isDeleted && mail.deletedAt) {
            const deletedTime = new Date(mail.deletedAt).getTime();
            if (now - deletedTime > THIRTY_DAYS) {
                mails.splice(i, 1);
            }
        }
    }
};

// Get all mails in trash
const getTrashMails = (userId) => {
    purgeOldTrash();
    return mails
        .filter(mail => mail.owner === userId && mail.isDeleted)
        .sort((a, b) => new Date(b.deletedAt) - new Date(a.deletedAt));
};

// Get all draft mails
const getDraftMails = (userId) => {
    return mails
        .filter(mail => mail.owner === userId && mail.isDraft && !mail.isDeleted)
        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
};

// Get all starred mails
const getStarredMails = (userId) => {
    return mails
        .filter(mail => mail.owner === userId && mail.isStarred && !mail.isDeleted)
        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
};

const getMailsByLabel = (userId, labelId) => {
    return mails
        .filter(mail =>
            mail.owner === userId &&
            !mail.isDeleted &&
            !mail.isDraft &&
            !mail.isSpam &&
            mail.labels.includes(labelId)
        )
        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
};

const markAsRead = (id, userId) => {
    const mail = getMailById(id);
    if (
        mail &&
        mail.owner === userId &&     // שייך למשתמש
        !mail.isDraft &&             // לא טיוטה
        !mail.isDeleted              // לא נמחק
    ) {
        mail.isRead = true;
        return mail;
    }
    return null;
};
const restoreFromTrash = (id, userId) => {
  const mail = getMailById(id);
  if (mail && mail.owner === userId && mail.isDeleted) {
    mail.isDeleted = false;
    mail.deletedAt = null;
    return mail;
  }
  return null;
};


module.exports = {
    createMail,
    getMailById,
    moveToTrash,
    getTrashMails,
    purgeOldTrash,
    searchMails,
    getUserMails,
    assignLabels,
    toggleSpam,
    toggleStarred,
    updateDraft,
    sendDraft,
    getSpamMails,
    getAllMails,
    getSentMails,
    getDraftMails,
    getStarredMails,
    getMailsByLabel,
    markAsRead,
    restoreFromTrash,
    removeLabelFromMail
};
