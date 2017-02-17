/**
 * The express.js file is where we configure our Express application.
 * This is where we add everything related to the Express configuration.
 */

var config       = require('./config');   
var express      = require('express');    // Express application object
var cookieParser = require('cookie-parser');
var compress     = require('compression');// Provides response compression
var bodyParser   = require('body-parser') // Provides several middleware to handle request data
//var hbs = require('hbs');
var helmet       = require('helmet');     // Helmet helps you secure your Express apps by setting various HTTP headers. 
                                          // It's not a silver bullet, but it can help!
var morgan       = require('morgan');     // Provides a simple logger middleware
var path         = require('path');       // Node: provides utilities for working with file and directory paths

module.exports = function(){
	var mcflyApi = require(__base + '/app_api/tweets/tweets.routes');
    
	// Creates a new instance of an Express application
	var app = express();
    
    app.use(helmet());

	// Determine environment, using process.env.NODE_ENV
	if(process.env.NODE_ENV === 'development'){
		// Load morgan() middleware in development environment
		app.use(morgan('dev'));
	}else if(process.env.NODE_ENV === 'production'){
		// Load compress() middleware in production environment
		app.use(compress());
	}

    // Parsers
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(cookieParser());

    // Routes
	app.use('/api/tweets', mcflyApi);
    app.use(function(req, res){
        res.sendFile(path.join(__base, 'app_server', 'views', 'index.html'));
    });

    // Return the application instance.
	return app;
}