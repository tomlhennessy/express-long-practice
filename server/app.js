const express = require('express');
const path = require('path'); // import path module
const app = express();
require('express-async-errors');

app.use(express.json()); // for JSON parsing

// serve static files under /static
app.use('/static', express.static(path.join(__dirname, 'assets')));

// logger middleware
const loggerMiddleware = (req, res, next) => {
  console.log(`${req.method} ${req.url}`); // log method and URL

  res.on('finish', () => {
    console.log(`Status Code: ${res.statusCode}`); // log status code
  })


  next(); // pass to the next middleware or route handler
}
// add logger middleware
app.use(loggerMiddleware);

// For testing purposes, GET /
app.get('/', (req, res) => {
  res.json("Express server running. No content provided at root level. Please use another route.");
});

// For testing express.json middleware
app.post('/test-json', (req, res, next) => {
  // send the body as JSON with a Content-Type header of "application/json"
  // finishes the response, res.end()
  res.json(req.body);
  next();
});

// For testing express-async-errors
app.get('/test-error', async (req, res) => {
  throw new Error("Hello World!")
});

// resource not found middleware
app.use((req, res, next) => {
  const err = new Error("The requested resource couldn't be found.");
  err.statusCode = 404;
  next(err); // pass to the error handler
})

// Custom Error Handler Middleware
app.use((err, req, res, next) => {
  res.status(err.statusCode || 500).json({
    error: err.message || 'Internal Server Error',
  });
});

const port = 5001;
app.listen(port, () => console.log('Server is listening on port', port));
