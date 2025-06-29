const mongoose = require('mongoose');

// Define the schema for a user document
const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName:  { type: String, required: true },
  birthDate: { type: Date, required: true },
  gender:    { type: String, enum: ['male', 'female', 'other'], required: true },
  email:     { type: String, required: true, unique: true },
  password:  { type: String, required: true },
  profilePicture: { type: String, default: null }
});
// Export the User model based on the schema
module.exports = mongoose.model('User', userSchema);
