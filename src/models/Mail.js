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

// Search mails by subject or content, only within the user's own mails
const searchMails = (userId, term) => {
    return mails.filter(mail => (mail.owner === userId) &&
        (mail.subject.includes(term) || mail.content.includes(term)));
};

// Create a mail from sender to one or more recipients
const createMail = (from, to, subject, content) => {
    // Save a copy for the sender
    const senderMail = {
    id: ++idCounter,
    from,
    to,
    subject,
    content,
    timestamp,
    owner: from
  };
  mails.push(senderMail);
  // Save a copy for each recipient
  for (const recipientId of to) {
    mails.push({
      id: ++idCounter,
      from,
      to,
      subject,
      content,
      timestamp,
      owner: recipientId
    });
  }

  return senderMail;
};

// Return up to 50 latest mails owned by the user, sorted by time (most recent first)
const getUserMails = (userId) => {
    const relevant = mails.filter(mail => mail.owner === userId);
    relevant.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    return relevant.slice(0, 50);
};

// Edit subject/content of a mail, only if it's owned and sent by the user
const editMail = (id, userId, newData) => {
    const mail = mails.find(mail => mail.id === id && mail.owner === userId);
    if (!mail) return null;
    // Only the sender is allowed to edit
    if (mail.from !== userId) return null;
    if (newData.subject) mail.subject = newData.subject;
    if (newData.content) mail.content = newData.content;
    return mail;
};

module.exports = {
    getMailById,
    deleteMail,
    searchMails,
    createMail,
    getUserMails,
    editMail
}