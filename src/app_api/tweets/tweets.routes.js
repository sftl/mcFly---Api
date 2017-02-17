var express = require('express');
var router  = express.Router();

// Requiring controllers
var tweetsCtrl = require(__dirname + '/tweets.controllers');

// EndPoints
router.get('/', tweetsCtrl.getAll);
router.get('/favorites', tweetsCtrl.getFavorites);
router.get('/:id', tweetsCtrl.getById);
router.put('/:id', tweetsCtrl.toggleFavorite);
router.post('/', tweetsCtrl.addNew);

module.exports = router;
