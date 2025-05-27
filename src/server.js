const app = require('./app');

// Start listening on the specified port
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    // Log a message when the server is running - לבדוק אם להשאיר
  console.log(`Server running at http://localhost:${PORT}`);
});

