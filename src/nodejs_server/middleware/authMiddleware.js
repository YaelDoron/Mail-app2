const jwt = require("jsonwebtoken");
const SECRET = "your-secret-key";

// Middleware function to authenticate users using JWT
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  // If no token is provided, deny access
  if (!token) return res.sendStatus(401);

  // Verify the token using the secret
  jwt.verify(token, SECRET, (err, decoded) => {
    if (err) return res.sendStatus(403);
    req.user = decoded;
    req.userId = decoded.userId;
    next();
  });

}

module.exports = authenticateToken;
