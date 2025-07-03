// Create and store user
const userService = require('../services/UserService');
const jwt = require("jsonwebtoken");


// Create a new user
const createUser = async (req, res) => {
  try{
    const profilePicture = req.file ? req.file.path : 'uploads/default-pic.svg';

    // Check required fields
    if (!req.body.firstName || !req.body.lastName || !req.body.birthDate || !req.body.gender || !req.body.email || !req.body.password) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Check email address ends with @mailsnap.com
    if (!req.body.email.endsWith('@mailsnap.com')) {
      return res.status(400).json({ error: "Email must end with @mailsnap.com" });
    }

    // Prevent duplicate emails
    const existingUser = await userService.findUserByEmail(req.body.email);
      if (existingUser) return res.status(409).json({ error: "Email address already exists" });

    // Validate birthDate format
    const birthDateError = userService.validateBirthDate(req.body.birthDate);
      if (birthDateError) return res.status(400).json({ error: birthDateError });

    // Create a new user 
    const user = await userService.createUser({ ...req.body, profilePicture });

    //the json returns the new user's id
    const SECRET = "your-secret-key";
    const token = jwt.sign({ userId: user._id }, SECRET, { expiresIn: "2h" });

    res.status(201).json({ id: user._id, token });
  }catch(err){
    res.status(400).json({ error: err.message });
  }
}

// function that gets user by ID
const getUserById = async (req, res) => {
  const user = await userService.findUserById(req.params.id);
  if (!user) return res.status(404).json({ error: "User not found" });

  res.json({
    id: user._id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    image: user.profilePicture || "uploads/default.jpg"
  });
};

// Get user ID by email
const getUserByEmail = async (req, res) => {
  const user = await userService.findUserByEmail(req.params.email);
  if (!user) return res.status(404).json({ error: "User not found" });

  res.json({ id: user._id });
};

// Update user's profile image
const updateUserImage = async (req, res) => {
  const user = await userService.findUserById(req.user?.userId);
  if (!user) return res.status(404).json({ error: "User not found" });
  if (!req.file) return res.status(400).json({ error: "No image uploaded" });

  user.profilePicture = req.file.path;
  await user.save();

  res.json({
    id: user._id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    image: user.profilePicture
  });
};

const getCurrentUser = async (req, res) => {
  const user = await userService.findUserById(req.userId);
  if (!user) return res.status(404).json({ error: "User not found" });

  res.json({
    id: user._id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    image: user.profilePicture || "uploads/default.jpg"
  });
};


// Export controller functions
module.exports = {
  createUser,
  getUserById,
  getUserByEmail,
  updateUserImage,
  getCurrentUser
};
