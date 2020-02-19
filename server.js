require('dotenv').config();

const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');

const serverFuncs = require('./serverFuncs');

const app = express();

app.use(
  morgan('tiny'),
  helmet(),
  cors(),
  authRequest
);

app.get(
  '/',
  testAuthAtRoot
);

app.get(
  '/movies',
  getMovies
);

const PORT = 8000;

app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`);
});