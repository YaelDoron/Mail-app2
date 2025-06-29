const Mail = require('../models/Mail');
const mongoose = require('mongoose');

const createMail = async (from, to, subject, content, isSpam = false, isDraft = false) => {
  const timestamp = new Date();

  const senderMail = await Mail.create({
    from,
    to,
    subject,
    content,
    timestamp,
    owner: from,
    isDraft,
    isSpam,
    labels: []
  });

  if (!isDraft) {
    const recipientMails = to
      .filter(recipientId => recipientId.toString() !== from.toString())
      .map(recipientId => ({
        from,
        to,
        subject,
        content,
        timestamp,
        owner: recipientId,
        isSpam,
        labels: []
      }));

    await Mail.insertMany(recipientMails);
  }
  console.log("Saved mail:", senderMail); // שורת הדיבוג
  return senderMail;
};


const getMailById = async (id) => {
  return await Mail.findById(id);
};


const getUserMails = async (userId) => {
  return await Mail.find({
    owner: userId,
    to: userId,
    isDeleted: false,
    isDraft: false,
    isSpam: false
  }).sort({ timestamp: -1 }).limit(50);
};


const searchMails = async (userId, term) => {
  return await Mail.find({
    owner: userId,
    isDeleted: false,
    isDraft: false,
    isSpam: false,
    $or: [
      { subject: { $regex: term, $options: 'i' } },
      { content: { $regex: term, $options: 'i' } }
    ]
  }).sort({ timestamp: -1 });
};


const markAsRead = async (id, userId) => {
  const mail = await Mail.findOne({ _id: id, owner: userId, isDeleted: false, isDraft: false });
  if (mail) {
    mail.isRead = true;
    await mail.save();
    return mail;
  }
  return null;
};


const moveToTrash = async (id, userId) => {
  const mail = await Mail.findOne({ _id: id, owner: userId, isDeleted: false });
  if (mail) {
    mail.isDeleted = true;
    mail.deletedAt = new Date();
    await mail.save();
    return mail;
  }
  return null;
};


const restoreFromTrash = async (id, userId) => {
  const mail = await Mail.findOne({ _id: id, owner: userId, isDeleted: true });
  if (mail) {
    mail.isDeleted = false;
    mail.deletedAt = null;
    await mail.save();
    return mail;
  }
  return null;
};


const getTrashMails = async (userId) => {
  const THIRTY_DAYS_AGO = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

  // מחיקה של מיילים ישנים מהפח
  await Mail.deleteMany({
    isDeleted: true,
    deletedAt: { $lte: THIRTY_DAYS_AGO }
  });

  // שליפה של כל המיילים בפח אחרי סינון
  return await Mail.find({ owner: userId, isDeleted: true }).sort({ deletedAt: -1 });
};


const getDraftMails = async (userId) => {
  return await Mail.find({ owner: userId, isDraft: true, isDeleted: false }).sort({ timestamp: -1 });
};


const updateDraft = async (id, userId, updates) => {
  const mail = await Mail.findOne({ _id: id, owner: userId, isDraft: true, isDeleted: false });
  if (!mail || mail.from.toString() !== userId.toString()) return null;

  if (updates.subject !== undefined) mail.subject = updates.subject;
  if (updates.content !== undefined) mail.content = updates.content;
  if (updates.to !== undefined) mail.to = updates.to;
  mail.timestamp = new Date();

  await mail.save();
  return mail;
};


const sendDraft = async (id, userId) => {
  const draft = await Mail.findOne({ _id: id, owner: userId, isDraft: true, isDeleted: false });
  if (!draft) return null;

  draft.isDraft = false;
  draft.timestamp = new Date();
  await draft.save();

  const recipientMails = draft.to
    .filter(recipientId => recipientId.toString() !== draft.owner.toString())
    .map(recipientId => ({
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
      deletedAt: null,
      isRead: false
    }));

  await Mail.insertMany(recipientMails);
  return draft;
};


const toggleSpam = async (id, userId) => {
  const mail = await Mail.findOne({ _id: id, owner: userId, isDeleted: false });
  if (!mail) return null;

  mail.isSpam = !mail.isSpam;
  await mail.save();
  return mail;
};


const toggleStarred = async (id, userId) => {
  const mail = await Mail.findOne({ _id: id, owner: userId, isDeleted: false });
  if (!mail) return null;

  mail.isStarred = !mail.isStarred;
  await mail.save();
  return mail;
};


const assignLabels = async (id, userId, labels) => {
  const mail = await Mail.findOne({ _id: id, owner: userId, isDeleted: false });
  if (!mail) return null;

  for (const label of labels) {
    if (!mail.labels.includes(label)) {
      mail.labels.push(label);
    }
  }

  await mail.save();
  return mail;
};


const removeLabelFromMail = async (id, userId, labelId) => {
  const mail = await Mail.findOne({ _id: id, owner: userId, isDeleted: false });
  if (!mail) return null;

  mail.labels = mail.labels.filter(label => label !== labelId);
  await mail.save();
  return mail;
};


const getSpamMails = async (userId) => {
  return await Mail.find({ owner: userId, isSpam: true, isDeleted: false }).sort({ timestamp: -1 });
};


const getStarredMails = async (userId) => {
  return await Mail.find({ owner: userId, isStarred: true, isDeleted: false }).sort({ timestamp: -1 });
};


const getMailsByLabel = async (userId, labelId) => {
  return await Mail.find({
    owner: userId,
    isDeleted: false,
    isDraft: false,
    isSpam: false,
    labels: labelId
  }).sort({ timestamp: -1 });
};


const getSentMails = async (userId) => {
  return await Mail.find({
    owner: userId,
    from: userId,
    isDeleted: false,
    isDraft: false
  }).sort({ timestamp: -1 });
};


const getAllMails = async (userId) => {
  return await Mail.find({
    owner: userId,
    isDeleted: false,
    isSpam: false
  }).sort({ timestamp: -1 });
};


async function getDeletedMailById(id, userId) {
    if (!mongoose.Types.ObjectId.isValid(id)) return null;

    const mail = await Mail.findById(id);
    if (!mail || !mail.isDeleted) return null;

    const isSender = mail.from.toString() === userId;
    const isRecipient = mail.to.map(u => u.toString()).includes(userId);

    if (!isSender && !isRecipient) return null;

    return mail;
}

module.exports = {
  createMail,
  getMailById,
  getUserMails,
  searchMails,
  markAsRead,
  moveToTrash,
  restoreFromTrash,
  getTrashMails,
  getDraftMails,
  updateDraft,
  sendDraft,
  toggleSpam,
  toggleStarred,
  assignLabels,
  removeLabelFromMail,
  getSpamMails,
  getStarredMails,
  getMailsByLabel,
  getSentMails,
  getAllMails,
  getDeletedMailById
};


