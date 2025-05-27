const UserService= require('../services/UserService');

function loginUser(req, res) {
  const { email, password } = req.body;

  // Try to find the user by email
  const user = UserService.findUserByEmail(email);

 // If user doesn't exist
  if (!user) {
    return res.status(404).send("User not found");
  }
  
// If login is successful, return the user's ID
  res.status(200).json({ id: user.id });
}

module.exports = {
    loginUser
};