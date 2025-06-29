const customEnv = require('custom-env');
customEnv.env(process.env.NODE_ENV, './config');

const app = require('./app');

const PORT = process.env.PORT;

app.listen(PORT , '0.0.0.0', () => {
  console.log(`Server running at http://localhost:${PORT}`);
});