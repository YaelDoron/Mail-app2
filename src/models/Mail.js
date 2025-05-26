let idCounter = 0
const mails = []

const getAllMails = () => mails

const getMailById = (id) => {
    return mails.find(mail => mail.id === id)
}

const deleteMail = (id) => {
    const index = mails.findIndex(mail => mail.id === id)
    if (index === -1) return null;
    return mails.splice(index, 1)[0];
}

const searchMails = (userId, term) => {
    return mails.filter(mail => ((mail.from === userId) || (mail.to === userId)) && 
    ((mail.subject.includes(term)) || (mail.content.includes(term))))
}

const createMail = (from, to, subject, content) => {
    const newMail = {id: ++idCounter, from, to, subject, content, timestamp: new Date()}
    mails.push(newMail)
    return newMail
}

const getUserMails= (userId) => {
    const relevant = mails.filter(mail => (mail.to === userId) || (mail.from === userId))
    relevant.sort((a,b) => new Date(b.timestamp) - new Date(a.timestamp))
    return relevant.slice(0, 50)
}

const editMail = (id, newData) => {
    const mail = mails.find(mail => mail.id === id)
    if (!mail) return null;
    if (newData.subject !== mail.subject) {
        mail.subject = newData.subject;
    }
    if (newData.content !== mail.content) {
        mail.content = mail.content;
    }
    return mail;
}

module.exports = {
    getAllMails,
    getMailById,
    deleteMail,
    searchMails,
    createMail,
    getUserMails,
    editMail
}