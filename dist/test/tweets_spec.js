//During the test the env variable is set to test
process.env.NODE_ENV = 'test';

let mongoose         = require("mongoose");
let Tweet            = require('../app_api/tweets/tweets.model');

//Require the dev-dependencies
let chai             = require('chai');
let chaiHttp         = require('chai-http');
let server           = require('../app');
let should           = chai.should();

chai.use(chaiHttp);

describe('tweets API', () => {
    beforeEach('Before each test we empty Tweets collection from test database', (done) => {
    	Tweet.remove({}, (err) => { 
    		done();         
    	});     
    });
	
	/*
  	 * Test the /GET route
  	 */
  	describe('/GET tweet', () => {
  		it('It should GET all the tweets', (done) => {
  			chai.request(server)
  			.get('/api/tweet')
  			.end((err, res) => {
  				res.should.have.status(200);
  				res.error.should.be.false;
  				res.body.should.be.an('object');
  				done();
  			});
  		});
  	});

  	/**
	 * Test the /GET/:id tweet route
	 */
	describe('/GET/favorites tweet', () => {
		it('It should get all tweets which "favorite" key is TRUE', (done) => {
			let tweets = [
				{
					author: "favorite FALSE",
					content: "favorite FALSE"
				},
				{
					author: "favorite TRUE",
					content: "favorite TRUE",
					favorite: true
				}
			];

			Tweet.create(tweets, (err, tweets) => {
				chai.request(server)
				.get('/api/tweets/favorites')
				.end((err, res) => {
					res.should.have.status(200);
					res.body.should.be.an('array');
					res.body.should.have.lengthOf(1);
					res.body[0].should.have.property('_id');
					res.body[0].should.have.property('author');
					res.body[0].should.have.property('content');
					res.body[0].should.have.property('favorite').eql(true);
					res.body[0].should.have.property('date');
					done();
				});
			});
		});
	});

  	/**
	 * Test the /GET/:id tweet route
	 */
	describe('/GET/:id tweet', () => {
		it('It should get a tweet by the given id', (done) => {
			let tweet = {
				author: "tweet by id",
				content: "tweet by id"
			}

			Tweet.create(tweet, (err, tweet) => {
				chai.request(server)
				.get('/api/tweets/' + tweet.id)
				.end((err, res) => {
					res.should.have.status(200);
					res.body.should.be.an('object');				
					res.body.should.have.property('_id');
					res.body.should.have.property('author');
					res.body.should.have.property('content');
					res.body.should.have.property('favorite');
					res.body.should.have.property('date');
					res.body.should.have.property('_id').eql(tweet.id);
					done();
				});
			});
		});
	});

	/*
	* Test the /POST route
	*/
	describe('/POST tweet', () => {
		it('It should not POST a tweet without "required" fields', (done) => {
			let tweet = {
				author: "",
				content: ""
			}

			chai.request(server)
			.post('/api/tweets')
			.send(tweet)
			.end((err, res) => {
				res.should.have.status(400);
				res.body.should.be.an('object');
				res.body.should.have.property('errors');
				res.body.errors.should.have.property('author');
				res.body.errors.should.have.property('content');
				res.body.errors.author.should.have.property('kind').eql('required');	
				res.body.errors.content.should.have.property('kind').eql('required');
				done();
			});
		});

		it('it should POST a new tweet', (done) => {
			let tweet = {
				author: "Test author",
				content: "Test content"
			}

			chai.request(server)
			.post('/api/tweets')
			.send(tweet)
			.end((err, res) => {
				res.should.have.status(200);
				res.body.should.be.an('object');
				res.body.should.have.property('_id');
				res.body.should.have.property('author');
				res.body.should.have.property('content');
				res.body.should.have.property('favorite');
				res.body.should.have.property('date');
				done();
			});
		});
	});

	/**
	 * Test the /PUT route
	 */
	describe('/PUT tweet', () => {
		it('It should update a tweet to Favorites', (done) => {
			let tweet = {
				author: "Update to favorites",
				content: "Update to favorites",
				// favorite: false (Default value)
			}

			Tweet.create(tweet, (err, tweet) => {
				chai.request(server)
				.put('/api/tweets/' + tweet.id)
				.end((err, res) => {
					res.should.have.status(200);
					res.body.should.be.an('object');				
					res.body.should.have.property('_id');
					res.body.should.have.property('author');
					res.body.should.have.property('content');
					res.body.should.have.property('favorite').eql(true);
					res.body.should.have.property('date');
					res.body.should.have.property('_id').eql(tweet.id);
					done();
				});
			});
		});


		it('It should update a tweet to not Favorites', (done) => {

			let tweet = {
				author: "Update to not favorites",
				content: "Update to not favorites",
				favorite: true
			}

			Tweet.create(tweet, (err, tweet) => {
				chai.request(server)
				.put('/api/tweets/' + tweet.id)
				.end((err, res) => {
					res.should.have.status(200);
					res.body.should.be.an('object');				
					res.body.should.have.property('_id');
					res.body.should.have.property('author');
					res.body.should.have.property('content');
					res.body.should.have.property('favorite').eql(false);
					res.body.should.have.property('date');
					res.body.should.have.property('_id').eql(tweet.id);
					done();
				});
			});
		});
	});

	after('Empty Tweets collection from test database & Close mongoose connection', (done) => {
		Tweet.remove({}, (err) => { 
		 	mongoose.connection.close(function (){
		 	 	console.log('Mongoose disconnected through test termination');
	 		 	done();
	 		});
    	});
	});
});
