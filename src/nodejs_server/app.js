const express = require('express');
const app = express();

app.use(express.json());

// Middleware
const authMiddleware = require('./middleware/authMiddleware');

// Routes
const labelsRoutes = require('./routes/labelsRoutes');
const mailsRoutes = require('./routes/mailsRoutes');
const usersRoutes = require('./routes/usersRoutes');
const blacklistRoutes = require('./routes/blacklistRoutes');
const tokensRoutes = require('./routes/tokensRoutes');

// Public routes (לא דורשים התחברות)
app.use('/api/users', usersRoutes);
app.use('/api/tokens', tokensRoutes);

// Protected routes (דורשים התחברות)
app.use('/api/labels', authMiddleware, labelsRoutes);
app.use('/api/mails', authMiddleware, mailsRoutes);
app.use('/api/blacklist', authMiddleware, blacklistRoutes);

// 404 error
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

module.exports = app;

