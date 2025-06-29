const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Mail = new Schema({
  from: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },

  to: [{
    type: mongoose.Schema.Types.ObjectId,
    required: true
  }],

  subject: {
    type: String,
    required: true
  },

  content: {
    type: String,
    required: true
  },

  timestamp: {
    type: Date,
    default: Date.now
  },

  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },

  labels: [{
  type: mongoose.Schema.Types.ObjectId,
  required: true
  }],

  isSpam: {
    type: Boolean,
    default: false
  },

  isDraft: {
    type: Boolean,
    default: false
  },

  isStarred: {
    type: Boolean,
    default: false
  },

  isDeleted: {
    type: Boolean,
    default: false
  },

  deletedAt: {
    type: Date,
    default: null
  },
  
  isRead: {
    type: Boolean,
    default: false
  }
});

module.exports = mongoose.model('Mail', Mail);