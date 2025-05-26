let users = []; // In-memory user list
let nextId = 0; // Counter for user IDs
 // Create and store user
    const { createUser: createUserModel } = require('../models/User');

// Create a new user
function createUser(req, res) {
  const { firstName, lastName, birthDate, gender, email, password, profilePicture} = req.body;
  // Check required fields
  if (!firstName || !lastName || !birthDate || !gender || !email || !password) {
    return res.status(400).send("Missing required fields");
  }

  // Prevent duplicate emails
  const exists = users.find(u => u.email === email);
  if (exists) {
    return res.status(409).send("Email address already exists");
  }

    const newUser = createUserModel({
    id: nextId++,
    firstName,
    lastName,
    birthDate,
    gender,
    email,
    password,
    profilePicture
    });


  users.push(newUser);
  //the json returns the new user's id
  res.status(201).json({ id: newUser.id });
}

// function that gets user by ID
function getUserById(req, res) {
  const user = users.find(u => u.id == req.params.id);
  if (!user) {
    return res.status(404).send("User not found");
  }
  res.json(user);
}

module.exports = {
  createUser,
  getUserById
};