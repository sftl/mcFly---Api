var mongoose   = require('mongoose');
var tweetSchema = new mongoose.Schema({
	author: {
		type: String,
		require: true
	},
	content: {
		type: String,
		require: true,
	},
    date: { 
        type: Date, 
        default: Date.now 
    },
    favorite: {
        type: Boolean,
        default: false
    }
});

mongoose.model('tweet', tweetSchema);