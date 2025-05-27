// Create and store user
const User = require('../models/User');
const UserService = require('../services/UserService');


// Create a new user
function createUser(req, res) {
  const { firstName, lastName, birthDate, gender, email, password, profilePicture} = req.body;
  // Check required fields
  if (!firstName || !lastName || !birthDate || !gender || !email || !password) {
    return res.status(400).json("Missing required fields");
  }
  // Prevent duplicate emails
  if (UserService.findUserByEmail(email)) {
    return res.status(409).json("Email address already exists");
  }
  // Validate birthDate format
  const birthDateError = UserService.validateBirthDate(birthDate);
  if (birthDateError) {
    return res.status(400).json(birthDateError);
  }

  // Create a new user object using the model's factory function
  const newUser = User.createUser({
  firstName,
  lastName,
  birthDate,
  gender,
  email,
  password,
  profilePicture
});

  //the json returns the new user's id
  res.status(201).json({ id: newUser.id });
}

// function that gets user by ID
function getUserById(req, res) {
  const id = req.params.id;
  const user = User.getUserById(id);

  if (!user) {
    return res.status(404).send("User not found");
  }

  // Return full user profile
  res.status(200).json({
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    birthDate: user.birthDate,
    gender: user.gender,
    email: user.email,
    profilePicture: user.profilePicture
  });
}

module.exports = {
  createUser,
  getUserById
};