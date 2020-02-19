require('dotenv').config();

const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');

const serverFuncs = require('./serverFuncs');

const app = express();
const morganSetting = 
  ( process.env.NODE_ENV === 'production' )
    ? 'tiny'
    : 'common';

app.use(
  morgan(morganSetting),
  helmet(),
  cors(),
  serverFuncs.authRequest
);

app.get(
  '/',
  serverFuncs.testAuthAtRoot
);

app.get(
  '/movies',
  serverFuncs.getMovies
);

// Error handling middleware
app.use((error, req, res, next) => {
  let response
  if (process.env.NODE_ENV === 'production') {
    response = { error: { message: 'server error' }}
  } else {
    response = { error }
  }
  res.status(500).json(response)
});

const PORT = process.env.PORT || 8000

app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`);
});