const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Label = new Schema({
  name: {
  type: String,
  required: true,
  trim: true,
  minlength: 1
},

  owner: { 
  type: mongoose.Schema.Types.ObjectId,
  required: true 
}
});

Label.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    ret.id = ret._id;
    delete ret._id;
  }
});

module.exports = mongoose.model('Label', Label);