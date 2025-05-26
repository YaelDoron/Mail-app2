let idCounter = 0
const mails = []

const getAllMails = () => mails

const getMailById = (id) => {
    return mails.find(mail => mail.id === id)
}

const deleteMail = (id, userId) => {
    const index = mails.findIndex(mail => mail.id === id && mail.owner === userId);
    if (index === -1) return null;
    return mails.splice(index, 1)[0];
};

const searchMails = (userId, term) => {
    return mails.filter(mail => (mail.owner === userId) &&
        (mail.subject.includes(term) || mail.content.includes(term)));
};

const createMail = (from, to, subject, content) => {
    const mailFrom = {
        id: ++idCounter,
        from,
        to,
        subject,
        content,
        timestamp: new Date(),
        owner: from
    };
    const mailTo = {
        id: ++idCounter,
        from,
        to,
        subject,
        content,
        timestamp: new Date(),
        owner: to
    };
    mails.push(mailFrom, mailTo);
    return mailFrom; 
};

const getUserMails = (userId) => {
    const relevant = mails.filter(mail => mail.owner === userId);
    relevant.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    return relevant.slice(0, 50);
};

const editMail = (id, userId, newData) => {
    const mail = mails.find(mail => mail.id === id && mail.owner === userId);
    if (!mail) return null;
    if (newData.subject) mail.subject = newData.subject;
    if (newData.content) mail.content = newData.content;
    return mail;
};

module.exports = {
    getAllMails,
    getMailById,
    deleteMail,
    searchMails,
    createMail,
    getUserMails,
    editMail
}