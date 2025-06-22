const jwt = require("jsonwebtoken");
const SECRET = "your-secret-key";

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.sendStatus(401);

  jwt.verify(token, SECRET, (err, decoded) => {
    if (err) return res.sendStatus(403);
    req.user = decoded;
    req.userId = decoded.userId;
    next();
  });

}


module.exports = authenticateToken;
