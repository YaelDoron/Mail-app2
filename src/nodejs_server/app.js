const express = require('express');
const cors = require("cors");
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const customEnv = require('custom-env');
const path = require("path");

const app = express();
customEnv.env(process.env.NODE_ENV, './config');

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.CONNECTION_STRING, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

// Auth middleware
const authMiddleware = require('./middleware/authMiddleware');

// Routes
const labelsRoutes = require('./routes/labelsRoutes');
const mailsRoutes = require('./routes/mailsRoutes');
const usersRoutes = require('./routes/usersRoutes');
const blacklistRoutes = require('./routes/blacklistRoutes');
const tokensRoutes = require('./routes/tokensRoutes');

// Public routes, don't require authentication
app.use('/api/users', usersRoutes);
app.use('/api/tokens', tokensRoutes);

// Protected routes, require authentication
app.use('/api/labels', authMiddleware, labelsRoutes);
app.use('/api/mails', authMiddleware, mailsRoutes);
app.use('/api/blacklist', authMiddleware, blacklistRoutes);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// 404 error
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

module.exports = app;