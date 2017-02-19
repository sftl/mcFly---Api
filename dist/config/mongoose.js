/**
 * At this stage we’re going to connect our application to a database.
 * We haven’t created a database yet, 
 * but that doesn’t matter because MongoDB will create a database when we first try to use it.
 * This can seem a little odd, but for putting an application together it’s a great advantage: 
 * 	* we don’t need to leave our application code to mess around in a different environment.
 *
 * BEST-PRACTICE TIP 
 * Opening and closing connections to databases can take a little bit of time, 
 * especially if your database is on a separate server or service. 
 * So it’s best to only run these operations when you need to. 
 * The best practice is to open the connection when your application starts up, 
 * and to leave it open until your application restarts or shuts down. 
 * This is the approach we’re going to take.
 */

var config = require('./config'); 
var mongoose = require('mongoose');
var gracefulShutdown;

module.exports = function(){
    // https://github.com/Automattic/mongoose/issues/4291
    // mongoose.Promise = global.Promise;
    
    /**
     * Using multiple databases
     * What you’ve seen so far is known as the default connection, 
     * and is well suited to keeping a single connection open throughout the uptime of an application. 
     * But if you want to connect to a second database, 
     * say for logging or managing user sessions, then you can use a named connection. 
     * In place of the mongoose.connect method you’d use a different method called mongoose.createConnection, and assign this to a variable. 
     * You can see this in the following code snippet:
     * 
     * 		var dbURIlog = 'mongodb://localhost/Loc8rLog';
     * 		var logDB = mongoose.createConnection(dbURIlog);
     * 
     * This creates a new Mongoose connection object called logDB. 
     * You can interact with this in the same ways as you would with mongoose.connection for the default connection. 
     * 
     * Here are a couple of examples:
     *
     * 		Monitoring connection event for named connection
     * 		
     * 		logDB.on('connected', function () {
     * 			console.log('Mongoose connected to ' + dbURIlog);
     * 		});
     *
     * 		Closing named connection
     * 	 	logDB.close(function () {
     * 	 		console.log('Mongoose log disconnected');
     * 	 	});
     */
    var db = mongoose.connect(config.db); // Create the mongoose connection


    // Require Schemas
    require(__base + 'app_api/tweets/tweets.model');
    
    /**
     * MONITORING THE CONNECTION WITH MONGOOSE CONNECTION EVENTS
     *
     * Mongoose will publish events based on the status of the connection,
     * and these are really easy to hook into so that you can see what’s going on.
     * 
     * We’re going to use events to see:
     *  - when the connection is made, 
     *  - when there’s an error,
     *  - when the connection is disconnected. 
     * When any one of these events occurs we’ll log a message to the con- sole.
     */

    // Monitoring for successful connection through Mongoose
    mongoose.connection.on('connected', function(){
        console.log('Mongoose connected to ' + config.db);
    });

    // Checking for connection error
    mongoose.connection.on('error', function(err){
        console.log('Mongoose connection error: ' + err);
    });

    // Checking for disconnection event
    mongoose.connection.on('disconnected', function(){
        console.log('Mongoose disconnected');
    });

    /**
     * Close Mongoose connection, 
     * passing through an anonymous function to run when closed.
     * @param  string   	Message to show on log
     * @param  functions	Callback, an anonymous function to run when mongoose connection is closed.
     * @return string		Output message on log
     */
    gracefulShutdown = function (msg, callback){
        mongoose.connection.close(function (){
            console.log('Mongoose disconnected through ' + msg);
            callback();
        });
    };

    // Listen for SIGUSR2, which is what nodemon uses
    process.once('SIGUSR2', function(){
        gracefulShutdown('nodemon restart', function(){
            process.kill(process.pid, 'SIGUSR2');
        });
    });

    // Listen for SIGINT emitted on application termination
    process.on('SIGINT', function(){
        gracefulShutdown('app termination', function(){
            process.exit(0);
        });
    });

    // Listen for SIGTERM emitted when Heroku shuts down process
    process.on('SIGTERM', function() {
        gracefulShutdown('Heroku app shutdown', function () {
            process.exit(0);
        });
    });

    return db;
}





