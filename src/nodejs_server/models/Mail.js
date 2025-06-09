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
    return mails.filter(mail =>
        mail.owner === userId &&
        !mail.isDraft &&
        !mail.isSpam &&
        (mail.subject.includes(term) || mail.content.includes(term))
    );
};

// Create a mail or a draft
const createMail = (from, to, subject, content, isSpam = false, isDraft = false) => {
    const timestamp = isDraft ? null : new Date();

    const senderMail = {
        id: ++idCounter,
        from,
        to,
        subject,
        content,
        timestamp,
        owner: from,
        labels: [],
        isSpam,
        isDraft
    };
    mails.push(senderMail);

    // only if not draft send to recipients
    if (!isDraft) {
        for (const recipientId of to) {
            mails.push({
                id: ++idCounter,
                from,
                to,
                subject,
                content,
                timestamp,
                owner: recipientId,
                labels: [],
                isSpam: false,
                isDraft: false
            });
        }
    }

    return senderMail;
};


// Return up to 50 latest mails owned by the user, sorted by time (most recent first,excluding drafts & spam) 
const getUserMails = (userId) => {
    const relevant = mails.filter(mail =>
        mail.owner === userId &&
        !mail.isDraft &&
        !mail.isSpam
    );
    relevant.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    return relevant.slice(0, 50);
};

// Assign labels to a specific mail
const assignLabels = (id, userId, labels) => {
    const mail = getMailById(id);
    if (mail && mail.owner === userId) {
        mail.labels = labels;
        return mail;
    }
    return null;
};

// Toggle spam status
const toggleSpam = (id, userId) => {
    const mail = getMailById(id);
    if (mail && mail.owner === userId) {
        mail.isSpam = !mail.isSpam;
        return mail;
    }
    return null;
};

const updateDraft = (id, userId, updates) => {
    const mail = getMailById(id);
    if (!mail || mail.owner !== userId || !mail.isDraft || mail.from !== userId) return null;

    if (updates.subject !== undefined) {
        mail.subject = updates.subject;
    }
    if (updates.content !== undefined) {
        mail.content = updates.content;
    }
    if (updates.to !== undefined) {
        mail.to = updates.to;
    }

    return mail;
};

// Send a draft (convert to normal mail and send to recipients)
const sendDraft = (id, userId) => {
    const draft = getMailById(id);
    if (!draft || draft.owner !== userId || !draft.isDraft) return null;

    draft.isDraft = false;
    draft.timestamp = new Date();

    for (const recipientId of draft.to) {
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
            isDraft: false
        });
    }

    return draft;
};

const getSpamMails = (userId) => {
    return mails
        .filter(mail => mail.owner === userId && mail.isSpam)
        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
};



module.exports = {
    createMail,
    getMailById,
    deleteMail,
    searchMails,
    getUserMails,
    assignLabels,
    toggleSpam,
    updateDraft,
    sendDraft,
    getSpamMails
};
