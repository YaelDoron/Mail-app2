const jwt = require("jsonwebtoken");
const UserService = require('../services/UserService');

// Secret key used to sign JWT tokens
const SECRET = process.env.JWT_SECRET || "your-secret-key";

/**
 * Handles user login.
 * Expects { email, password } in the request body.
 * If credentials are valid, returns a signed JWT token.
 */
function loginUser(req, res) {
  const { email, password } = req.body;

  // Attempt to find the user by email
  const user = UserService.findUserByEmail(email);

  // If user not found, return 404
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  // If password does not match, return 401 (Unauthorized)
  if (user.password !== password) {
    return res.status(401).json({ error: "Incorrect password" });
  }

  // If login is successful, generate a JWT containing the user's ID
  const token = jwt.sign({ userId: user.id }, SECRET, { expiresIn: "2h" });

  // Send the token back to the client
  res.status(200).json({ token });
}

module.exports = {
  loginUser
};
