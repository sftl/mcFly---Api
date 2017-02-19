/**
 * Development Environment configuration file
 */

/** key -> "db"
 * 	To connect to MongoDB, you will need to use the MongoDB connection URI. 
 *	The MongoDB connection URI is a string URL that tells the MongoDB drivers how to connect to the database instance. 
 *	The MongoDB URI is usually constructed as follows:
 *			mongodb://username:password@hostname:port/database
 * 	WHERE: 
 * 		mongodb 				-> REQUIRED. is MongoDB protocol.
 * 		username:password 	-> OPTIONAL. Login credentials.
 * 		localhost 			-> REQUIRED. Server address.
 * 		27027				-> OPTIONAL. Port.
 * 		database 			-> REQUIRED. Database name.
 * 	
 *  Since you're connecting to a local instance, you can skip the username and password and use the following URI:
 *		mongodb://localhost/database
 */

module.exports = {
	db: 'mongodb://localhost/mcfly_test',
};