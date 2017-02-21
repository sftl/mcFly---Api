var mongoose = require('mongoose');
var Tweet    = require("./tweets.model");
var Module   = {
	addNew: addNew,
	getAll: getAll,
	getFavorites: getFavorites,
	getById: getById,
	toggleFavorite: toggleFavorite,
};

module.exports = Module;

/**
 * Add a new tweet
 * @param  object 	req 	request
 * @param  object	res 	response
 * @return json
 */
function addNew(req, res){ 	
 	var author      = req.body.author;
 	var content     = req.body.content;
 	var tweetTosave = {
 		author: author,
 		content: content
 	};

 	// Check for DB connection
   	if(!Tweet.checkForConnection()){
 		_dbConectionFailed(res);
 	}

    // Query
    Tweet.create(tweetTosave, function(err, tweet){
    	if(err){
    		_sendJsonResponse(res, 400, err);
    	}else{
    		_sendJsonResponse(res, 200, tweet);
    	}
    });
}

/**
 * GetAll tweets
 * @param  object 	req 	request
 * @param  object	res 	response
 * @return json
 */
function getAll(req, res){
	// Check for DB connection
 	if(!Tweet.checkForConnection()){
 		_dbConectionFailed(res);
 	}

    // Query
    Tweet
    .find()
    .sort({_id: -1})
    .exec(function(err, tweets){
    	if(err){
    		_sendJsonResponse(res, 404, err);
    	}

    	if(tweets.length === 0){
    		_sendJsonResponse(res, 404, {
    			"message": "There are no Tweets"
    		});
    		return;
    	}

    	_sendJsonResponse(res, 200, tweets);
    });
}

/**
 * Delete a document
 * @param  object 	req 	request
 * @param  object 	res 	response
 * @return json
 */
function getFavorites(req, res){
 	// Check for DB connection
 	if(!Tweet.checkForConnection()){
 		_dbConectionFailed(res);
 	}

    // Query
    Tweet
    .find({favorite: true})
    .sort({_id: -1})
    .exec(function(err, tweets){
    	if(err){
    		_sendJsonResponse(res, 404, err);
    		return;
    	}

    	if(tweets.length === 0){
    		_sendJsonResponse(res, 404, {
    			"message": "There are no favorites"
    		});
    		return;
    	}

    	_sendJsonResponse(res, 200, tweets);
    });
}

/**
 * Get one tweet by id
 * @param  object 	req 	request
 * @param  object	res 	response
 * @return json
 */
function getById(req, res){
 	var tweetId = req.params.id;

 	// Check for DB connection
 	if(!Tweet.checkForConnection()){
 		_dbConectionFailed(res);
 	}

	// Check for params
	if(!req.params || !tweetId){
		_sendJsonResponse(res, 404, {
			"message": "TweetId required"
		});
		return;
	}

	// Query
	Tweet
	.findById(tweetId)
	.exec(function(err, tweet){
		if(!tweet){
			_sendJsonResponse(res, 404, {
				"message": "tweetId not found"
			});
			return;
		}else if(err){
			_sendJsonResponse(res, 404, err);
			return;
		}
		
		_sendJsonResponse(res, 200, tweet);
	});
}

/**
 * Update data in a document
 * 1 - Find the relevant document.
 * 2 - Make some changes to the instance.
 * 3 - Save the document.
 * 4 - Send a JSON response.
 * @param  object 	req 	request
 * @param  object 	res 	response
 * @return json 	
 */
function toggleFavorite(req, res){
 	var tweetId = req.params.id;

 	// Check for DB connection
 	if(!Tweet.checkForConnection()){
 		_dbConectionFailed(res);
 	}

    // Check for params
    if(!tweetId){
    	_sendJsonResponse(res, 404, {
    		message: "Tweet is required"
    	});
    	return;
    }

    // Query
    Tweet
    .findById(tweetId)
    .exec(function(err, tweet){
    	if(!tweet){
    		_sendJsonResponse(res, 404, {
    			message: "Tweet not found"
    		});
    		return;
    	}else if(err){
    		_sendJsonResponse(res, 400, err);
    		return;
    	}

    	tweet.favorite = !tweet.favorite;
    	tweet.save(function(err, tweet){
    		if(err){
    			_sendJsonResponse(res, 404, err);
    		}else{
    			_sendJsonResponse(res, 200, tweet);
    		}
    	});
    })
}

/**
 * Send JSON response and status info
 * @param  object	res 	response
 * @param  int      status  HTTP response status codes.
 * @param  object   content Data returned as JSON
 * @return json
 */
 var _sendJsonResponse = function(res, status, content){
 	res.status(status);
 	res.json(content);
 }

 var _dbConectionFailed = function(res){
 	_sendJsonResponse(res, 503, {
 		message: 'database connection failed'
 	});
 } 