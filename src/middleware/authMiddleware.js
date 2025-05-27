module.exports = (req, res, next) => {
  const userId = req.header('user-id');

  // If the header is missing, return a 400 Bad Request response
  if (!userId) {
    return res.status(400).json({ error: 'Missing user-id header' });
  }
  // If present, attach the userId to the request object
  req.userId = userId;

  next(); 
};
