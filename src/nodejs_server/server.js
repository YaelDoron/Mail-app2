const app = require('./app');

// Start listening on the specified port
const PORT =3000;

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

