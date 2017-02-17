/**
 * Server
 */

/**
 * The process.env.NODE_ENV variable is set to the default 'development' value if it doesn't exist. 
 * This is because, often, the NODE_ENV environment variable is not properly set.
 * It is recomended to set the NODE_ENV environment variable in your operating system prior to running your application.
 *
 * WINDOWS: > set NODE_ENV=development
 * UNIX: 	$ export NODE_ENV=development
 */
 process.env.NODE_ENV = process.env.NODE_ENV || 'development';

/**
 * https://gist.github.com/branneman/8048520
 * Problem:
 * When the directory structure of your Node.js application (not library!) has some depth, 
 * you end up with a lot of annoying relative paths in your require calls like: 
 * "var Article = require('../../../models/article');"
 * Those suck for maintenance and they're ugly.
 * Ideally, I'd like to have the same basepath from which I require() all my modules. 
 * I'd like the require() calls to be relative to my application entry point file, in my case app.js.
 * 1 - In your app.js: "global.__base = __dirname + '/';"
 * 2 - In your very/far/away/module.js: "var Article = require(__base + 'app/models/article');""
 */
global.__base = __dirname + '/';

var mongoose = require('./config/mongoose');
var express  = require('./config/express');

var db			       = mongoose();
var app            = express();

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err    = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers
/**
 * DEALING WITH AUTHENTICATION REJECTION
 * When the supplied token is invalid — or perhaps doesn’t exist at all — 
 * the middleware will actually throw an error to prevent the code from continuing. 
 * So what we need to do is catch this error, 
 * and return an unauthorized message and status (401).
 */
app.use(function (err, req, res, next) {
  if (err.name === 'UnauthorizedError') {
    res.status(401);
    res.json({
      message: err.name + ": " + err.message
    });
  }
});

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

module.exports = app;