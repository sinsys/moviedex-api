// All data (pseudo database)
const MOVIES = require('./movies-data.json');
// You can use the small json if you want less data to run through
// const MOVIES = require('./movies-data-small.json');

// Helpers
testParam = (val, type) => {
  if ( type === 'number' ) {
    return(
      isNaN(parseFloat(val))
    ) 
  }
  return typeof val !== type
};

// Request, Response functions
// Authentication middleware
authRequest = (req, res, next) => {
  // const authToken = req.get('Authorization');
  // const apiToken = process.env.API_TOKEN;

  const authToken = "Bearer fake_auth_token"; // This will be sent from the client via an Authorization header
  const apiToken = "fake_auth_token"; // This will be stored secretly on the server
  
  if (
    !authToken ||
    authToken.split(' ')[1] !== apiToken
  ) {
    return (
      res
        .status(401)
        .json({
          code: 401,
          error: 'Unauthorized request'
        })
    );
  };

  next();
};

// Verify authentication works on root
testAuthAtRoot = (req, res) => {
  return (
    res
      .status(200)
      .json({
        code: 200,
        message: 'Authorization successful'
      })
  );
};

// GET /movies
getMovies = (req, res) => {
  
  // Decode query parameters
  Object.keys(req.query)
    .forEach(query => {
      decodeURIComponent(req.query.query)
    });

  // Grab query params or set defaults
  let {
    search = '',
    genre = '',
    country = '',
    avg_vote = 0
  } = req.query;

  avg_vote = parseFloat(avg_vote);

  // Verify correct types for query params
  if ( testParam(search, 'string') ) {
    return (
      res
        .status(400)
        .send(`Query parameter search must be a string.`)
    );
  };

  if ( testParam(genre, 'string') ) {
    return (
      res
        .status(400)
        .send(`Query parameter genre must be a string.`)
    );    
  };

  if ( testParam(country, 'string') ) {
    return (
      res
        .status(400)
        .send(`Query parameter country must be a string.`)
    );
  };

  if ( testParam(avg_vote, 'number' ) ) {
    return (
      res
      .status(400)
      .send(`Query parameter avg_vote must be a number.`)
    );
  };

  // Convert vals for easier reducing
  search = search.toString().toLowerCase();
  genre = genre.toString().toLowerCase();
  country = country.toString().toLowerCase();
  avg_vote = parseFloat(avg_vote);

  // Reduce based on query parameters
  const results = MOVIES.reduce((acc, cur) => {

    // Convert vals for easier reducing
    let convCur = {
      title: cur.film_title.toString().toLowerCase(),
      genre: cur.genre.toString().toLowerCase(),
      country: cur.country.toString().toLowerCase(),
      avg_vote: parseFloat(cur.avg_vote)
    };

    // Reduce based on query params
    if (
      convCur.title.includes(search) &&
      convCur.genre.includes(genre) &&
      convCur.country.includes(country) &&
      convCur.avg_vote >= avg_vote
    ) {
      // Add item to results
      acc.push(cur);
    }
    return acc;
  }, []);

  res
    .status(200)
    .json({
      count: results.length,
      results
    });
};

module.exports = {
  authRequest,
  testAuthAtRoot,
  getMovies
};