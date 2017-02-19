var mongoose    = require('mongoose');
var tweetSchema = new mongoose.Schema({
	author: {
		type: String,
		required: true
	},
	content: {
		type: String,
		required: true,
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

module.exports = mongoose.model('tweet', tweetSchema);