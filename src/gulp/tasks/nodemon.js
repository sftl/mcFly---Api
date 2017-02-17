/**
 * Nodemon task will monitor for any changes in your source and automatically restart your server.
 *
 * var config = {
 *   "ext":    string             By default, nodemon looks for files with the .js, .coffee, .litcoffee, and .json extensions. Example:"js html json",
 *   "script": string             example: "./bin/www/",
 *   "ignore": array of strings   ignore some specific files, directories or file patterns, to prevent nodemon from prematurely restarting your application. Example: ["src_loc8r/", "public/"],
 *   "env": {
 *     "NODE_ENV": string         example: "development"
 *   }
 * }
 */
var config      = require('../config.json').nodemon;
var gulp        = require('gulp');
var nodemon     = require('gulp-nodemon');
var browserSync = require('browser-sync');
var reload      = browserSync.reload;


gulp.task('nodemon', (cb) => {
  var started = false;

  return nodemon(config)
  .on('start', () => {
    if(!started){
      started = true;
      cb();
    }
  })
  .on('restart', () => {
    setTimeout( () => {
      reload({stream: false});
    }, 1000);
  });
});