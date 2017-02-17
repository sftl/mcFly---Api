/**
 * BrowserSync makes your tweaking and testing faster by synchronising file changes and interactions across multiple devices.
 * By connecting any number of devices & browsers a BrowserSync created URL can:
 * 
 * 1 - Scroll on one browser; other browsers follow the scroll to the same point
 * 2 - Click links; other browsers load the clicked URL
 * 3 - Fill out & submit forms; other browsers submit
 * 4 - Test responsive designs; see your site rendered on different devices at one time
 * 5 - Change HTML, CSS & JS; automatically inject those new files without a page refresh.
 * 6 - Live reloading.
 *
 * This task open a browser with the config data
 *
 * var config = {
 * 	"proxy":  string 	URL. exmaple: "http://localhost:3000",
 * 	"port":   number 	example: 4000
 * 	"notify": boolean   
 * }
 */
var config      = require('../config.json').browserSync;
var gulp        = require('gulp');
var browserSync = require('browser-sync');

gulp.task('browserSync', ['nodemon'], function() {
  browserSync(config);
});