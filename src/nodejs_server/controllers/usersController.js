// Create and store user
const User = require('../models/User');
const UserService = require('../services/UserService');
const jwt = require("jsonwebtoken");


// Create a new user
function createUser(req, res) {
  const { firstName, lastName, birthDate, gender, email, password} = req.body;
  const profilePicture = req.file?.path;

  // Check required fields
  if (!firstName || !lastName || !birthDate || !gender || !email || !password) {
    return res.status(400).json({ error: "Missing required fields" });
  }
  // Prevent duplicate emails
  if (UserService.findUserByEmail(email)) {
    return res.status(409).json({ error: "Email address already exists" });
  }
  // Validate birthDate format
  const birthDateError = UserService.validateBirthDate(birthDate);
  if (birthDateError) {
    return res.status(400).json({ error: birthDateError });
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
const SECRET = process.env.JWT_SECRET || "your-secret-key";
const token = jwt.sign({ userId: newUser.id }, SECRET, { expiresIn: "2h" });

res.status(201).json({ id: newUser.id, token });
}

// function that gets user by ID
function getUserById(req, res) {
  const id = req.params.id;
  const user = User.getUserById(id);

  if (!user) {
    return res.status(404).json({ error: "User not found" });
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

// פונקציה לשליפת משתמש לפי אימייל
function getUserByEmail(req, res) {
  const email = req.params.email;
  const user = UserService.findUserByEmail(email);
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }
  res.status(200).json({ id: user.id });
}

module.exports = {
  createUser,
  getUserById,
  getUserByEmail
};