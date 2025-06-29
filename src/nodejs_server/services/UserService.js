const User = require('../models/User');


// Create a new user in the database
const createUser = async ({ firstName, lastName, birthDate, gender, email, password, profilePicture = null }) => {
  if (!password || password.length < 8) {
    throw new Error("Password must be at least 8 characters long");
  }
  const user = new User({ firstName, lastName, birthDate, gender, email, password, profilePicture });
  return await user.save();
};

// Checks if a user with the given ID exists
const exists = async (id) => {
  const user = await User.findById(id);
  return !!user; // returns true or false
};

// Finds a user by email address
const findUserByEmail = async (email) => {
  return await User.findOne({ email });
};

// Validates the birthDate format and value
// Validate birthDate format and value
const validateBirthDate = (birthDate) => {
  if (!birthDate) {
    return "Missing birthDate";
  }

  const regex = /^\d{4}-\d{2}-\d{2}$/;
  if (!regex.test(birthDate)) {
    return "Birth date must be in format YYYY-MM-DD";
  }

  const date = new Date(birthDate);
  if (isNaN(date.getTime())) {
    return "Birth date is not a valid calendar date";
  }

  const minDate = new Date("1905-01-01");
  const maxDate = new Date("2012-01-01");
  if (date < minDate || date > maxDate) {
    return "You don’t meet the age requirement to create an account";
  }

  return null; // valid
};

//Finds a user by their unique ID
const findUserById = async (id) => {
  return await User.findById(id);
};

module.exports = {
  createUser,
  exists,
  findUserByEmail,
  validateBirthDate,
  findUserById
};