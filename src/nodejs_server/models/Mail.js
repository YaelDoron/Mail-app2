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
    default: "no subject"
  },

  content: {
    type: String,
    default: " "
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
  default: []
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

Mail.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    ret.id = ret._id;
    delete ret._id;
  }
});

module.exports = mongoose.model('Mail', Mail);